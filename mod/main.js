/*
  ___               _                 _                    _      ____                         
 |_ _|  _ __     __| |  _   _   ___  | |_   _ __    __ _  | |    / ___|   ___    _ __    ___   
  | |  | '_ \   / _` | | | | | / __| | __| | '__|  / _` | | |   | |      / _ \  | '__|  / _ \  
  | |  | | | | | (_| | | |_| | \__ \ | |_  | |    | (_| | | |   | |___  | (_) | | |    |  __/  
 |___| |_| |_|  \__,_|  \__,_| |___/  \__| |_|     \__,_| |_|    \____|  \___/  |_|     \___|  
 
 by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/

// constants
var GUI_BAR_STANDART_SCALE = 3.2;
var FURNACE_FUEL_MAP = {
	5: 300,
	6: 100,
	17: 300,
	263: 1600,
	280: 100,
	268: 200,
	269: 200,
	270: 200,
	271: 200,
	85: 300,
	107: 300,
	134: 300,
	135: 300,
	158: 150,
	162: 300,
	163: 300,
	164: 300,
	184: 300,
	185: 300,
	186: 300,
	187: 300,
	53: 300,
	54: 300,
	58: 300
};


// import native methods, that work faster
var nativeGetTile = ModAPI.requireGlobal("getTile_origin");
var nativeGetLightLevel = ModAPI.requireGlobal("Level.getBrightness");


// square lava texture for geothermal generator ui.
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_16x16");


// if mod running on core engine 1.02 or less, it will make callback for undeground generation to be called with usual generation
if (getCoreAPILevel() < 3){
	Callback.addCallback("GenerateChunk", function(x, z){
		Callback.invokeCallback("GenerateChunkUnderground", x, z);
	});
	Logger.Log("Core Engine with low api level detected, ore generation will not be optimized", "WARNING");
}


var MachineRegistry = {
	machineIDs: {},
	
	isMachine: function(id){
		return this.machineIDs[id];
	},
	
	quickCoordAccess: {},
	
	addMacineAccessAtCoords: function(x, y, z, machine){
		this.quickCoordAccess[x + ":" + y + ":" + z] = machine;
	},
	
	removeMachineAccessAtCoords: function(x, y, z){
		delete this.quickCoordAccess[x + ":" + y + ":" + z];
	},
	
	accessMachineAtCoords: function(x, y, z){
		return this.quickCoordAccess[x + ":" + y + ":" + z];
	},
	
	registerPrototype: function(id, Prototype){
		// register ID
		this.machineIDs[id] = true;
		// set base for web object
		Prototype.web = null;
		// setup energy value
		if (Prototype.defaultValues){
			Prototype.defaultValues.energy = 0;
		}
		else{
			Prototype.defaultValues = {
				energy: 0
			};
		}
		// copy functions
		if (Prototype.tick){
			Prototype.mechTick = Prototype.tick;
		}
		else if (!Prototype.mechTick){
			Prototype.mechTick = function(){};
		}
		if (Prototype.init){
			Prototype.mechInit = Prototype.init;
		}
		else if (!Prototype.mechInit){
			Prototype.mechInit = function(){};
		}
		if (Prototype.destroy){
			Prototype.mechDestroy = Prototype.destroy;
		}
		else if (!Prototype.mechDestroy){
			Prototype.mechDestroy = function(){};
		}
		if (!Prototype.energyTick){
			Prototype.energyTick = function(){};
		}
		if (!Prototype.getEnergyStorage){
			Prototype.getEnergyStorage = function(){
				return 0;
			};
		}
		// set default functions
		Prototype.init = function(){
			MachineRegistry.addMacineAccessAtCoords(this.x, this.y, this.z, this);
			// TODO: reload webs, apply to energy web
			EnergyWebBuilder.postWebRebuild();
			this.mechInit();
		}
		Prototype.tick = function(){
			if (!this.web){
				EnergyWebBuilder.rebuildFor(this);
			}
			else{
				this.energyTick(this.web);
			}
			this.mechTick();
		}
		Prototype.destroy = function(){
			if (this.web){
				this.web.removeMachine(this);
			}
			MachineRegistry.removeMachineAccessAtCoords(this.x, this.y, this.z);
			EnergyWebBuilder.postWebRebuild();
			this.mechDestroy();
		}
		
		TileEntity.registerPrototype(id, Prototype);
	},
	
	executeForAll: function(func){
		for (var key in this.quickCoordAccess){
			var mech = this.quickCoordAccess[key];
			if (mech){
				func(mech);
			}
		}
	},
	
	// standart functions
	basicEnergyReceiveFunc: function(){
		var energyNeed = this.getEnergyStorage() - this.data.energy;
		this.data.energy += this.web.requireEnergy(energyNeed);
	}
}

Callback.addCallback("LevelLoaded", function(){
	MachineRegistry.quickCoordAccess = {};
});



var MachineRecipeRegistry = {
	recipeData: {},
	
	registerRecipesFor: function(name, data, validateKeys){
		if (validateKeys){
			var newData = {};
			for (var key in data){
				newData[eval(key)] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	},
	
	addRecipeFor: function(name, source, result){
		this.requireRecipesFor(name, true)[source] = result;
	},
	
	requireRecipesFor: function(name, createIfNotFound){
		if (!this.recipeData[name] && createIfNotFound){
			this.recipeData[name] = {};
		}
		return this.recipeData[name];
	},
	
	getRecipeResult: function(name, sourceKey){
		var data = this.requireRecipesFor(name);
		if (data){
			return data[sourceKey];
		}
	}
}


var MIN_ENERGY_TRANSPORT_AMOUNT = 16;

function EnergyWeb(){
	this.energyType = "Eu";
	this.energy = 0;
	
	this.machines = [];
	
	this.addMachine = function(machine){
		machine.web = this;
		this.machines.push(machine);
	}
	
	this.removeMachine = function(machine){
		for (var i in this.machines){
			if (this.machines[i] == machine){
				machine.web = null;
				this.machines.splice(i--, 1);
			}
		}
	}
	
	
	this.energyTransportedTime = -1;
	this.energyTransportedLastTick = 0;
	this.energyTransportedThisTick = 0;
	
	this.requireEnergy = function(amount){
		var time = World.getThreadTime();
		if (time != this.energyTransportedTime){
			this.energyTransportedLastTick = this.energyTransportedThisTick;
			this.energyTransportedThisTick = 0;
			this.energyTransportedTime = time;
		}
		
		var max = Math.min(this.energy * 2 / this.machines.length, this.energy);
		if (amount != amount){
			amount = max;
		}
		var got = Math.min(max, amount);
		this.energy -= got;
		this.energyTransportedThisTick += got;
		//Game.tipMessage(this.energyTransportedLastTick);
		return got;
	}
	
	
	this.addEnergy = function(amount){
		if (this.energy < MIN_ENERGY_TRANSPORT_AMOUNT + this.energyTransportedLastTick && this.machines.length > 1){
			this.energy += amount;
			return 0;
		}
		else{
			return amount;
		}
	}
	
	this.destroy = function(){
		
	}
}


var EnergyWebBuilder = {
	rebuildFor: function(machine){
		var web = new EnergyWeb();
		this.rebuildRecursive(web, machine.x, machine.y, machine.z, {});
		return web;
	},
	
	rebuildRecursive: function(web, x, y, z, explored){
		var coordKey = x + ":" + y + ":" + z;
		if (explored[coordKey]){
			return;
		}
		else{
			explored[coordKey] = true;
		}
		
		var mech = MachineRegistry.accessMachineAtCoords(x, y, z)
		if (mech){
			web.addMachine(mech);
			this.rebuildFor6Sides(web, x, y, z, explored);
		}
		else {
			var tile = nativeGetTile(x, y, z);
			if (tile == BLOCK_TYPE_CABLE_ID){
				this.rebuildFor6Sides(web, x, y, z, explored);
			}
			else {
				return;
			}
		}
	},
	
	rebuildFor6Sides: function(web, x, y, z, explored){
		this.rebuildRecursive(web, x - 1, y, z, explored);
		this.rebuildRecursive(web, x + 1, y, z, explored);
		this.rebuildRecursive(web, x, y - 1, z, explored);
		this.rebuildRecursive(web, x, y + 1, z, explored);
		this.rebuildRecursive(web, x, y, z - 1, explored);
		this.rebuildRecursive(web, x, y, z + 1, explored);
	},
	
	postedRebuildTimer: 0,
	
	clearWebData: function(){
		MachineRegistry.executeForAll(function(machine){
			machine.web = null;
		});
	},
	
	postWebRebuild: function(delay){
		this.postedRebuildTimer = delay || 60;
	}
}

Callback.addCallback("tick", function(){
	if (EnergyWebBuilder.postedRebuildTimer > 0){
		EnergyWebBuilder.postedRebuildTimer--;
		if (EnergyWebBuilder.postedRebuildTimer <= 0){
			EnergyWebBuilder.clearWebData();
		}
	}
});


IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["machine_side", 1], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0]], inCreative: true}
]);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, -1]);
	
	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.plateSteel, -1, '#', BlockID.machineBlockBasic, -1]);
	
	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});



var BLOCK_TYPE_CABLE_ID = Block.createSpecialType({
	base: 35
});

var CABLE_BLOCK_TEXTURE_META = 0;
var CABLE_BLOCK_ADD_IN_CREATIVE = false;

IDRegistry.genBlockID("cableTin");
Block.createBlock("cableTin", [
	{name: "tile.cableTin.name", texture: [["cable_block_tin", CABLE_BLOCK_TEXTURE_META]], inCreative: CABLE_BLOCK_ADD_IN_CREATIVE}
], BLOCK_TYPE_CABLE_ID);

IDRegistry.genBlockID("cableCopper");
Block.createBlock("cableCopper", [
	{name: "tile.cableCopper.name", texture: [["cable_block_copper", CABLE_BLOCK_TEXTURE_META]], inCreative: CABLE_BLOCK_ADD_IN_CREATIVE}
], BLOCK_TYPE_CABLE_ID);

IDRegistry.genBlockID("cableGold");
Block.createBlock("cableGold", [
	{name: "tile.cableGold.name", texture: [["cable_block_gold", CABLE_BLOCK_TEXTURE_META]], inCreative: CABLE_BLOCK_ADD_IN_CREATIVE}
], BLOCK_TYPE_CABLE_ID);

IDRegistry.genBlockID("cableIron");
Block.createBlock("cableIron", [
	{name: "tile.cableIron.name", texture: [["cable_block_iron", CABLE_BLOCK_TEXTURE_META]], inCreative: CABLE_BLOCK_ADD_IN_CREATIVE}
], BLOCK_TYPE_CABLE_ID);

IDRegistry.genBlockID("cableOptic");
Block.createBlock("cableOptic", [
	{name: "tile.cableOptic.name", texture: [["cable_block_optic", CABLE_BLOCK_TEXTURE_META]], inCreative: CABLE_BLOCK_ADD_IN_CREATIVE}
], BLOCK_TYPE_CABLE_ID);

var CABLE_BLOCK_WIDTH = 0.25;
Block.setBlockShape(BlockID.cableTin, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableCopper, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableGold, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableIron, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableOptic, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});

// drop 
Block.registerDropFunction("cableTin", function(){
	EnergyWebBuilder.postWebRebuild();
	return [[ItemID.cableTin1, 1, 0]];
});

Block.registerDropFunction("cableCopper", function(){
	EnergyWebBuilder.postWebRebuild();
	return [[ItemID.cableCopper1, 1, 0]];
});

Block.registerDropFunction("cableGold", function(){
	EnergyWebBuilder.postWebRebuild();
	return [[ItemID.cableGold2, 1, 0]];
});

Block.registerDropFunction("cableIron", function(){
	EnergyWebBuilder.postWebRebuild();
	return [[ItemID.cableIron3, 1, 0]];
});

Block.registerDropFunction("cableOptic", function(){
	EnergyWebBuilder.postWebRebuild();
	return [];
});


var BLOCK_TYPE_ORE = Block.createSpecialType({
	base: 1,
	opaque: true
});

IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Tin Copper (block)", texture: [["ore_copper", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone");
Block.registerDropFunction("oreCopper", function(coords, blockID, blockData, level){
	if (level > 1){
		return [[ItemID.oreCrushedCopper, 1, 0]]
	}
	return [];
}, 2);


IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore (block)", texture: [["ore_tin", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone");
Block.registerDropFunction("oreTin", function(coords, blockID, blockData, level){
	if (level > 1){
		return [[ItemID.oreCrushedTin, 1, 0]]
	}
	return [];
}, 2);


IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore (block)", texture: [["ore_lead", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone");
Block.registerDropFunction("oreLead", function(coords, blockID, blockData, level){
	if (level > 1){
		return [[ItemID.oreCrushedLead, 1, 0]]
	}
	return [];
}, 2);


IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore (block)", texture: [["ore_uranium", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone");
Block.registerDropFunction("oreUranium", function(coords, blockID, blockData, level){
	if (level > 2){
		return [[ItemID.uraniumChunk, 1, 0]]
	}
	return [];
}, 3);




Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
	for (var i = 0; i < 12; i++){
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 24, 64);
		GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.oreCopper,
			data: 0,
			size: 3,
			ratio: .3,
			checkerTile: 1,
			checkerMode: false
		});
	}
	for (var i = 0; i < 9; i++){
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 18, 52);
		GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.oreTin,
			data: 0,
			size: 2,
			ratio: .3,
			checkerTile: 1,
			checkerMode: false
		});
	}
	for (var i = 0; i < 7; i++){
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 18, 48);
		GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.oreLead,
			data: 0,
			size: 1,
			ratio: .4,
			checkerTile: 1,
			checkerMode: false
		});
	}
	for (var i = 0; i < 3; i++){
		var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 18, 48);
		GenerationUtils.genMinable(coords.x, coords.y, coords.z, {
			id: BlockID.oreUranium,
			data: 0,
			size: 1,
			ratio: 1,
			checkerTile: 1,
			checkerMode: false
		});
	}
});


var BLOCK_TYPE_LOG = Block.createSpecialType({
	base: 17
});

var BLOCK_TYPE_LEAVES = Block.createSpecialType({
	base: 18
});


IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
	{name: "tile.rubberTreeLog.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false}
], BLOCK_TYPE_LOG);
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");

IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlock("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2]], inCreative: false}
], BLOCK_TYPE_LOG);
Block.registerDropFunction("rubberTreeLogLatex", function(){
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");

IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "tile.rubberTreeLeaves.name", texture: [["rubber_tree_leaves", 0]], inCreative: false}
], BLOCK_TYPE_LEAVES);
Block.registerDropFunction("rubberTreeLeaves", function(){
	if (Math.random() < .075){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	else {
		return [];
	}
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");



var RubberTreeGenerationHelper = {
	/*
	 params: {
		 leaves: {
			 id: 
			 data: 
		 },
		 log: {
			 id: 
			 data:
			 resin: 
		 },
		 height: {
			 min:
			 max:
			 start: 
		 },
		 pike:
		 radius: 
	 }
	*/
	generateCustomTree: function(x, y, z, params){
		var leaves = params.leaves;
		var log = params.log;
		
		var height = parseInt(Math.random() * (.5 + params.height.max - params.height.min) + params.height.min);
		var resinHeight = -1;
		if (log.resin){
			resinHeight = parseInt(Math.random() * (height - 2)) + 1;
		}
		for (var ys = 0; ys < height; ys++){
			if (ys == resinHeight){
				World.setBlock(x, y + ys, z, log.resin, parseInt(Math.random() * 4));
			}
			else{
				World.setFullBlock(x, y + ys, z, log);
			}
		}
		
		GenerationUtils.lockInBlock(leaves.id, leaves.data);
		if (params.pike){
			for (var ys = 0; ys < params.pike; ys++){
				GenerationUtils.setLockedBlock(x, y + ys + height, z);
			}
		}
		
		var leavesStart = params.height.start;
		var leavesEnd = height;
		var leavesMiddle = (leavesEnd + leavesStart) / 2;
		var leavesLen = leavesEnd - leavesStart;
		for (var ys = leavesStart; ys < leavesEnd; ys++){
			for (var xs = -params.radius; xs <= params.radius; xs++){
				for (var zs = -params.radius; zs <= params.radius; zs++){
					var d = Math.sqrt(xs * xs + zs * zs) + (Math.random() * .5 + .5) * Math.pow(Math.abs(leavesMiddle - ys) / leavesLen, 1.5) * 1.2;
					if (d <= params.radius + .5 && nativeGetTile(x + xs, y + ys, z + zs) == 0){
						GenerationUtils.setLockedBlock(x + xs, y + ys, z + zs);
					}
				}	
			}
		}
	},
	
	generateRubberTree: function(x, y, z, activateTileEntity){
		RubberTreeGenerationHelper.generateCustomTree(x, y, z, {
			log: {
				id: BlockID.rubberTreeLog,
				data: 0,
				resin: BlockID.rubberTreeLogLatex
			},
			leaves: {
				id: BlockID.rubberTreeLeaves,
				data: 0
			},
			height: {
				min: 5,
				max: 7,
				start: 2 + parseInt(Math.random() * 2)
			},
			pike: 2 + parseInt(Math.random() * 1.5),
			radius: 2
		});
		if (activateTileEntity){
			return World.addTileEntity(x, y, z);
		}
	}
}


var DesertBiomeIDs = {2:true, 17:true};
var ForestBiomeIDs = {4:true, 18:true, 27:true, 28:true, 29:true};
var JungleBiomeIDs = {21:true};
var SwampBiomeIDs = {6:true};

var RUBBER_TREE_BIOME_DATA = {
	4: .5,
	18: .5,
	27: .5,
	28: .5,
	29: .5,
	21: .8,
	6: 1
};

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	if (Math.random() < .08){
		if(Math.random() < RUBBER_TREE_BIOME_DATA[World.getBiome((chunkX + .5) * 16, (chunkZ + .5) * 16)] || .1){
			for (var i = 0; i < 1 + Math.random() * 2; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 64, 128);
				coords = GenerationUtils.findSurface(coords.x, coords.y, coords.z);
				if (World.getBlockID(coords.x, coords.y, coords.z) == 2){	
					coords.y++;	
					RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z, false);
				}
			}
		}
	}
});




IDRegistry.genBlockID("ironFurnace");
Block.createBlockWithRotation("ironFurnace", [
	{name: "Iron Furnace", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["iron_furnace_side", 0], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.ironFurnace, count: 1, data: 0}, [
		" x ",
		"x x",
		"x#x"
	], ['#', 61, -1, 'x', ItemID.plateIron]);
});


var guiIronFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Iron Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
	}
});


MachineRegistry.registerPrototype(BlockID.ironFurnace, {
	defaultValues: {
		progress: 0,
		burn: 0,
		burnMax: 0
	},
	
	getGuiScreen: function(){
		return guiIronFurnace;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if (result && this.data.burn > 0){
			if (this.data.progress++ >= 150){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count++;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		if (this.data.burn > 0){
			this.data.burn--;
		}
		else if(result){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel");
		}
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("progressScale", this.data.progress / 160);
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if (fuelSlot.id > 0){
			var burn = FURNACE_FUEL_MAP[fuelSlot.id];
			if (burn){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				return burn;
			}
			if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
				var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
				fuelSlot.id = empty.id;
				fuelSlot.data = empty.data;
				return 20000;
			}
		}
		return 0;
	},
	
});



IDRegistry.genBlockID("electricFurnace");
Block.createBlockWithRotation("electricFurnace", [
	{name: "Electric Furnace", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["electric_furnace_side", 0], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.electricFurnace, count: 1, data: 0}, [
		" a ",
		"x#x"
	], ['#', BlockID.ironFurnace, -1, 'x', 331, -1, 'a', ItemID.circuitBasic, -1]);
});

var guiElectricFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Electric Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
	}
});


MachineRegistry.registerPrototype(BlockID.electricFurnace, {
	defaultValues: {
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiElectricFurnace;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if (result){
			if (this.data.energy > 1){
				this.data.energy -= 2;
				this.data.progress++;
			}
			if (this.data.progress >= 100){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count++;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress / 100);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});



IDRegistry.genBlockID("macerator");
Block.createBlockWithRotation("macerator", [
	{name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
		"xxx",
		"b#b",
		" a "
	], ['#', BlockID.machineBlockBasic, -1, 'x', 318, 0, 'b', 4, -1, 'a', ItemID.circuitBasic, -1]);
});

var guiMacerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Macerator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "macerator_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "macerator_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142}
	}
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("macerator", {
		// ores
		14: {id: ItemID.dustGold, count: 2, data: 0},
		15: {id: ItemID.dustIron, count: 2, data: 0},
		"ItemID.oreCrushedCopper": {id: ItemID.dustCopper, count: 2, data: 0},
		"ItemID.oreCrushedTin": {id: ItemID.dustTin, count: 2, data: 0},
		"ItemID.oreCrushedLead": {id: ItemID.dustLead, count: 2, data: 0},
		// ingots
		265: {id: ItemID.dustIron, count: 1, data: 0},
		266: {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.ingotCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.ingotTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.ingotLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.ingotSteel": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.ingotBronze": {id: ItemID.dustBrone, count: 1, data: 0},
		// plates
		"ItemID.plateIron": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.plateGold": {id: ItemID.dustGold, count: 1, data: 0},
		"ItemID.plateCopper": {id: ItemID.dustCopper, count: 1, data: 0},
		"ItemID.plateTin": {id: ItemID.dustTin, count: 1, data: 0},
		"ItemID.plateLead": {id: ItemID.dustLead, count: 1, data: 0},
		"ItemID.plateSteel": {id: ItemID.dustIron, count: 1, data: 0},
		"ItemID.plateBronze": {id: ItemID.dustBronze, count: 1, data: 0},
		// other items
		263: {id: ItemID.dustCoal, count: 1, data: 0},
		264: {id: ItemID.dustDiamond, count: 1, data: 0},
		// other materials
		1: {id: 4, count: 1, data: 0},
		4: {id: 12, count: 1, data: 0},
		13: {id: 318, count: 1, data: 0},
		369: {id: 377, count: 5, data: 0},
		35: {id: 287, count: 2, data: 0},
		352: {id: 351, count: 5, data: 15} 
	}, true);
});

MachineRegistry.registerPrototype(BlockID.macerator, {
	defaultValues: {
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiMacerator;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("macerator", sourceSlot.id);
		if (result){
			if (this.data.energy > 2){
				this.data.energy -= 3;
				this.data.progress++;
			}
			if (this.data.progress >= 400){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress / 400);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});



IDRegistry.genBlockID("recycler");
Block.createBlockWithRotation("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["recycler_top", 0], ["machine_side", 0], ["compressor_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, -1, 'b', ItemID.ingotSteel]);
});

var guiRecycler = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Recycler"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "recycler_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142}
	}
});


MachineRegistry.registerPrototype(BlockID.recycler, {
	defaultValues: {
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiRecycler;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		if (sourceSlot.id > 0){
			if (this.data.energy > 0){
				this.data.energy --;
				this.data.progress++;
			}
			if (this.data.progress >= 50){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0){
					sourceSlot.count--;
					if (Math.random() < 0.125){
						resultSlot.id = ItemID.scrap;
						resultSlot.count++;
					}
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress / 50);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 500;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});



IDRegistry.genBlockID("compressor");
Block.createBlockWithRotation("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top_hole", 0], ["machine_side", 0], ["compressor_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"x x",
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, -1, 'x', 1, 0, 'a', ItemID.circuitBasic, -1]);
});

var guiCompressor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Compressor"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "compressor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
		//{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "compressor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142}
	}
});


Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("compressor", {
		265: {id: ItemID.plateIron, count: 1, data: 0},
		266: {id: ItemID.plateGold, count: 1, data: 0},
		"ItemID.ingotCopper": {id: ItemID.plateCopper, count: 1, data: 0},
		"ItemID.ingotTin": {id: ItemID.plateTin, count: 1, data: 0},
		"ItemID.ingotLead": {id: ItemID.plateLead, count: 1, data: 0},
		"ItemID.ingotSteel": {id: ItemID.plateSteel, count: 1, data: 0},
		"ItemID.ingotBronze": {id: ItemID.plateBronze, count: 1, data: 0},
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), ingredientCount: 9},
		87: {id: 405, count: 2, data: 0},
		332: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0},
	}, true);
});

MachineRegistry.registerPrototype(BlockID.compressor, {
	defaultValues: {
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiCompressor;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id);
		if (result && (sourceSlot.count >= result.ingredientCount || !result.ingredientCount)){
			if (this.data.energy > 2){
				this.data.energy -= 3;
				this.data.progress++;
			}
			if (this.data.progress >= 400){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= Item.getMaxStack(result.id) - result.count || resultSlot.id == 0){
					sourceSlot.count -= result.ingredientCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress / 400);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});



IDRegistry.genBlockID("extractor");
Block.createBlockWithRotation("extractor", [
	{name: "Extractor", texture: [["machine_bottom", 0], ["machine_top_hole", 0], ["machine_side", 0], ["extractor_side", 0], ["extractor_side", 1], ["extractor_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.extractor, count: 1, data: 0}, [
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, -1, 'x', ItemID.treetap, -1, 'a', ItemID.circuitBasic, -1]);
});

var guiExtractor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Extractor"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "extractor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142}
	}
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("extractor", {
		"ItemID.latex": {id: ItemID.rubber, count: 3, data: 0}
	}, true);
});

MachineRegistry.registerPrototype(BlockID.extractor, {
	defaultValues: {
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiExtractor;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
		if (result){
			if (this.data.energy > 2){
				this.data.energy -= 3;
				this.data.progress++;
			}
			if (this.data.progress >= 400){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress / 400);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("primalGenerator");
Block.createBlockWithRotation("primalGenerator", [
	{name: "Generator", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["iron_furnace_side", 1], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		" # ",
		" a "
	], ['#', BlockID.machineBlockBasic, -1, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);
	
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		"###",
		" a "
	], ['#', ItemID.plateIron, -1, 'a', BlockID.ironFurnace, 0, 'x', ItemID.storageBattery, -1]);
});



var guiGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.primalGenerator, {
	defaultValues: {
		burn: 0,
		burnMax: 0
	},
	
	getGuiScreen: function(){
		return guiGenerator;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var energyStorage = this.getEnergyStorage();
		
		if (this.data.burn > 0){
			if (this.data.energy < energyStorage){
				this.data.energy = Math.min(this.data.energy + 10, energyStorage);
				this.data.burn--;
			}
		}
		else {
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel") / 4;
		}
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", this.data.energy + "/");
		this.container.setText("textInfo2", energyStorage + "");
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if (fuelSlot.id > 0){
			var burn = FURNACE_FUEL_MAP[fuelSlot.id];
			if (burn){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				return burn;
			}
			if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
				var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
				fuelSlot.id = empty.id;
				fuelSlot.data = empty.data;
				return 20000;
			}
		}
		return 0;
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(){
		var output = Math.min(32, this.data.energy);
		this.data.energy += this.web.addEnergy(output) - output;
	}
});


IDRegistry.genBlockID("geothermalGenerator");
Block.createBlockWithRotation("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["geothermal_generator_side", 1], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"axa",
		"axa",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', ItemID.fluidCellEmpty, 0, 'b', ItemID.ingotSteel, -1, 'x', 102, 0]);
});

var guiGeothermalGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Geothermal Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		//{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "geotermal_liquid_slot", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		//"energyScale": {type: "scale", x: 530, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 450 + GUI_BAR_STANDART_SCALE, y: 150 + GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "geotermal_empty_liquid_slot", overlay: "geotermal_liquid_slot_overlay", overlayOffset: {x: -GUI_BAR_STANDART_SCALE, y: -GUI_BAR_STANDART_SCALE}, scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 542, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 542, y: 172, width: 300, height: 30, text: "16000 mB"}
	}
});




MachineRegistry.registerPrototype(BlockID.geothermalGenerator, {
	defaultValues: {
		burn: 0,
		burnMax: 0
	},
	
	getGuiScreen: function(){
		return guiGeothermalGenerator;
	},
	
	init: function(){
		this.liquidStorage.setLimit("lava", 16);
		
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("liquidScale", "lava");
		
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if (empty && empty.liquid == "lava"){
			if (this.liquidStorage.getAmount("lava") <= 15 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				this.liquidStorage.addLiquid("lava", 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		
		this.container.setText("textInfo1", parseInt(this.liquidStorage.getAmount("lava") * 1000) + "/");
	},
	
	
	energyTick: function(){
		if (this.liquidStorage.getLiquid("lava", 0.001) > 0){
			if (this.web.addEnergy(20) > 0){
				this.liquidStorage.addLiquid("lava", 0.001);
			}
		}
	}
	
});


IDRegistry.genBlockID("solarPannel");
Block.createBlock("solarPannel", [
	{name: "Solar Pannel", texture: [["machine_bottom", 0], ["solar_pannel_top", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPannel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.dustCoal, 0, 'b', ItemID.cableCopper1, -1, 'a', 20, 0]);
});

MachineRegistry.registerPrototype(BlockID.solarPannel, {
	energyTick: function(){
		if (World.getThreadTime() % 10 == 0 && nativeGetLightLevel(this.x, this.y + 1, this.z) == 15){
			this.web.addEnergy(10);
		}
	}
});


IDRegistry.genBlockID("genWindmill");
Block.createBlock("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill_generator_side", 0], ["windmill_generator_side", 0], ["windmill_generator_side", 0], ["windmill_generator_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, -1]);
});

MachineRegistry.registerPrototype(BlockID.genWindmill, {
	energyTick: function(){
		if (World.getThreadTime() % 20 == 0){
			var height = Math.min(0, this.y - 64) / 64;
			var output = height * 160;
			var radius = 3;
			if (nativeGetTile(
					this.x - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.y - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.z - Math.floor((Math.random() - .5) * (radius * 2 + 1))
				) == 0){
				this.web.addEnergy(output);
			}
		}
	}
});


IDRegistry.genBlockID("genWatermill");
Block.createBlock("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_generator_side", 0], ["watermill_generator_side", 0], ["watermill_generator_side", 0], ["watermill_generator_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 2, data: 0}, [
		"xax",
		"a#a",
		"xax"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, -1]);
	
	Recipes.addShaped({id: BlockID.genWatermill, count: 2, data: 0}, [
		"axa",
		"x#x",
		"axa"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, -1]);
});


MachineRegistry.registerPrototype(BlockID.genWatermill, {
	energyTick: function(){
		if (World.getThreadTime() % 20 == 0){
			var output = 20;
			var radius = 1;
			var tile = nativeGetTile(
					this.x - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.y - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.z - Math.floor((Math.random() - .5) * (radius * 2 + 1))
				);
			if (tile == 8 || tile == 9){
				this.web.addEnergy(output);
			}
		}
	}
});


var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(item, energy, level){
		var power = Math.floor(Math.log10(energy));
		var energyPerDamage = Math.pow(2, power);
		var maxDamage = Math.floor(energy / energyPerDamage + .999) + 1;
		
		Item.setMaxDamage(item, maxDamage);
		this.chargeData[item] = {
			type: "normal",
			id: item,
			level: level || 0,
			maxDamage: maxDamage,
			maxCharge: energy,
			perDamage: energyPerDamage
		};
	},
	
	registerFlashItem: function(item, energy, level){
		this.chargeData[item] = {
			type: "flash",
			id: item,
			level: level || 0,
			energy: energy,
		};
	},
	
	getItemData: function(id){
		return this.chargeData[id];
	},
	
	getEnergyFrom: function(item, amount, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if (!data || data.level > level){
			return 0;
		}
		if (data.type == "flash" && amount > 0){
			item.count--;
			if (item.count < 1){
				item.id = item.data = item.count = 0;
			}
			return data.energy;
		}
		if (item.data < 1){
			item.data = 1;
		}
		
		var damageAdd = Math.min(data.maxDamage - item.data, Math.floor(amount / data.perDamage));
		var energyGot = damageAdd * data.perDamage;
		item.data += damageAdd;
		return energyGot;
	},
	
	addEnergyTo: function(item, amount, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if (!data || data.type == "flash" || data.level > level){
			return amount;
		}
		
		var damageGot = Math.min(Math.max(item.data - 1, 0), Math.floor(amount / data.perDamage));
		var energyAdd = damageGot * data.perDamage;
		item.data -= damageGot;
		return amount - energyAdd;
	},
	
	getEnergyStored: function(item){
		var data = this.getItemData(item.id);
		if (!data){
			return 0;
		}
		return  (data.maxDamage - item.data) * data.perDamage;
	}
}

ChargeItemRegistry.registerFlashItem(331, 500, 0); // redstone


IDRegistry.genBlockID("storageBatBox");
Block.createBlock("storageBatBox", [
	{name: "Bat-Box", texture: [["bat_box", 0], ["bat_box", 2], ["bat_box", 1], ["bat_box", 1], ["bat_box", 1], ["bat_box", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableTin1, -1, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
	
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableCopper1, -1, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});


var guiBatBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Bat-Box"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageBatBox, {
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 32;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 0);
		this.data.energy += ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), Math.min(TRANSFER, this.data.energy), 0) - Math.min(TRANSFER, this.data.energy);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	energyTick: function(){
		var output = Math.min(32, this.data.energy);
		var left = this.web.addEnergy(output);
		this.data.energy += left - output;
		if (left == output){
			var input = this.web.requireEnergy(Math.min(32, this.getEnergyStorage() - this.data.energy));
			this.data.energy += input;
		}
	}
});


IDRegistry.genBlockID("storageMFE");
Block.createBlock("storageMFE", [
	{name: "MFE", texture: [["machine_bottom", 0], ["mfe", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFE, count: 1, data: 0}, [
		"aba",
		"bxb",
		"aba"
	], ['b', ItemID.cableGold1, -1, 'a', ItemID.storageCrystal, -1, 'x', BlockID.machineBlockBasic, -1]);
});


var guiMFE = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFE"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});






MachineRegistry.registerPrototype(BlockID.storageMFE, {
	getGuiScreen: function(){
		return guiMFE;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 128;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 1);
		this.data.energy += ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), Math.min(TRANSFER, this.data.energy), 1) - Math.min(TRANSFER, this.data.energy);
	},
	
	getEnergyStorage: function(){
		return 600000;
	},
	
	energyTick: function(){
		var output = Math.min(128, this.data.energy);
		var left = this.web.addEnergy(output);
		this.data.energy += left - output;
		if (left == output){
			var input = this.web.requireEnergy(Math.min(128, this.getEnergyStorage() - this.data.energy));
			this.data.energy += input;
		}
	}
});


IDRegistry.genBlockID("storageMFSU");
Block.createBlock("storageMFSU", [
	{name: "MFSU", texture: [["mfsu", 0], ["mfsu", 2], ["mfsu", 1], ["mfsu", 1], ["mfsu", 1], ["mfsu", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageCrystal, -1, 'x', BlockID.machineBlockAdvanced, -1, 'c', ItemID.circuitAdvanced]);
});


var guiMFSU = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFSU"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 350, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageMFSU, {
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 512;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 2);
		this.data.energy += ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), Math.min(TRANSFER, this.data.energy), 2) - Math.min(TRANSFER, this.data.energy);
	},
	
	getEnergyStorage: function(){
		return 10000000;
	},
	
	energyTick: function(){
		var output = Math.min(128, this.data.energy);
		var left = this.web.addEnergy(output);
		this.data.energy += left - output;
		if (left == output){
			var input = this.web.requireEnergy(Math.min(128, this.getEnergyStorage() - this.data.energy));
			this.data.energy += input;
		}
	}
});


TileEntity.registerPrototype(BlockID.rubberTreeLog, {	
	addLatex: function(){
		var possibleYs = [];
		var checkY = this.y + 1;
		while (true){
			var block = World.getBlock(this.x, checkY, this.z);
			if (block.id == BlockID.rubberTreeLog){
				possibleYs.push(checkY);
			}
			else if (block.id != BlockID.rubberTreeLogLatex){
				break;
			}
			checkY++;
		}
		
		var randomY = possibleYs[parseInt(Math.random() * possibleYs.length)];
		World.setBlock(this.x, randomY, this.z, BlockID.rubberTreeLogLatex, parseInt(Math.random() * 4));
	},
	
	checkLog: function(){
		var block = World.getBlock(this.x, this.y - 1, this.z);
		if (block.id == BlockID.rubberTreeLog || block.id == BlockID.rubberTreeLogLatex){
			this.selfDestroy();
		}
	},
	
	tick: function(){
		if (World.getThreadTime() % 100 == 0){
			if (Math.random() < .5){
				this.addLatex();
			}
			this.checkLog();
		}
	}
});


var RUBBER_SAPLING_GROUND_TILES = {
	2: true,
	3: true,
	60: true
};

IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_sapling", data: 0});

Item.registerUseFunction("rubberSapling", function(coords, item, tile){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (GenerationUtils.isTransparentBlock(tile1.id) && RUBBER_SAPLING_GROUND_TILES[tile2.id]){
		World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
		World.addTileEntity(place.x, place.y, place.z);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0]], inCreative: false}
], BLOCK_TYPE_LEAVES);

Block.setBlockShape(BlockID.rubberTreeSapling, {x: 0, y: 0, z: 0}, {x: 1, y: 0.1, z: 1});
Block.registerDropFunction("rubberTreeSapling", function(){
	return [[ItemID.rubberSapling, 1, 0]];
});

TileEntity.registerPrototype(BlockID.rubberTreeSapling, {
	defaultValues: {
		size: 0,
		growth: 0,
		lastGrowth: 0
	},
	
	created: function(){
		this.data.size = .85 + Math.random() * .25;
	},
	
	initAnimation: function(){
		this.animation1 = new Animation.Item(this.x + .5, this.y + this.data.size / 2 - .02, this.z + .5);
		this.animation2 = new Animation.Item(this.x + .5, this.y + this.data.size / 2 - .02, this.z + .5);
		this.animation1.describeItem({
			id: ItemID.rubberSapling,
			count: 1,
			data: 0,
			rotation: "x",
			size: this.data.size
		});
		this.animation1.load();
		this.animation2.describeItem({
			id: ItemID.rubberSapling,
			count: 1,
			data: 0,
			rotation: "z",
			size: this.data.size
		});
		this.animation2.load();
	},
	
	destroyAnimation: function(){
		if (this.animation1){
			this.animation1.destroy();
		}
		if (this.animation2){
			this.animation2.destroy();
		}
	},
	
	updateAnimation: function(){
		this.destroyAnimation();
		this.initAnimation();
	},
	
	init: function(){
		this.initAnimation();
	},
	
	destroy: function(){
		this.destroyAnimation();
	},
	
	tick: function(){
		if (World.getThreadTime() % 20 == 0){
			this.data.growth += Math.random() * 2;
			this.checkGrowth();
			if (!RUBBER_SAPLING_GROUND_TILES[World.getBlockID(this.x, this.y - 1, this.z)]){
				World.destroyBlock(this.x, this.y, this.z, true);
				this.selfDestroy();
			}
		}
	},
	
	click: function(id, count, data){
		if (id == 351 && data == 15){
			this.data.growth += 256 + Math.random() * 128;
			this.checkGrowth();
			Player.setCarriedItem(id, count - 1, data);
		}
	},
	
	checkGrowth: function(){
		if (this.data.growth - 56 > this.data.lastGrowth){
			this.data.size += (this.data.growth - this.data.lastGrowth) / 480;
			this.data.lastGrowth = this.data.growth;
			this.updateAnimation();
		}
		if (this.data.growth > 512){
			this.selfDestroy();
			RubberTreeGenerationHelper.generateRubberTree(this.x, this.y, this.z, true);
		}
	}
});


var CRAFTING_TOOL_ITEM_MAX_DAMAGE = 96;

IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

IDRegistry.genItemID("craftingCutter");
Item.createItem("craftingCutter", "Cutter", {name: "crafting_cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingCutter, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

function addRecipeWithCraftingTool(result, data, tool){
	data.push({id: tool, data: -1});
	Recipes.addShapeless(result, data, function(api, field, result){
		for (var i in field){
			if (field[i].id == tool){
				field[i].data++;
				if (field[i].data >= CRAFTING_TOOL_ITEM_MAX_DAMAGE){
					field[i].id = field[i].count = field[i].data = 0;
				}
			}
			else {
				api.decreaseFieldSlot(i);
			}
		}
	});
}

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.craftingHammer, count: 1, data: 0}, [
		"xxx",
		"x#x",
		" # "
	], ['x', 265, -1, '#', 280, -1]);

	Recipes.addShaped({id: ItemID.craftingCutter, count: 1, data: 0}, [
		"x x",
		" x ",
		"a a"
	], ['x', 265, -1, '#', ItemID.plateIron, - 1]);
});
	


IDRegistry.genItemID("oreCrushedCopper");
Item.createItem("oreCrushedCopper", "Copper Ore", {name: "crushed_ore_copper"});

IDRegistry.genItemID("oreCrushedTin");
Item.createItem("oreCrushedTin", "Tin Ore", {name: "crushed_ore_tin"});

IDRegistry.genItemID("oreCrushedLead");
Item.createItem("oreCrushedLead", "Lead Ore", {name: "crushed_ore_lead"});

IDRegistry.genItemID("uraniumChunk");
Item.createItem("uraniumChunk", "Uranium", {name: "uranium"})


IDRegistry.genItemID("dustCopper");
Item.createItem("dustCopper", "Copper Dust", {name: "dust_copper"});

IDRegistry.genItemID("dustTin");
Item.createItem("dustTin", "Tin Dust", {name: "dust_tin"});

IDRegistry.genItemID("dustIron");
Item.createItem("dustIron", "Iron Dust", {name: "dust_iron"});

IDRegistry.genItemID("dustBronze");
Item.createItem("dustBronze", "Bronze Dust", {name: "dust_bronze"});

IDRegistry.genItemID("dustCoal");
Item.createItem("dustCoal", "Coal Dust", {name: "dust_coal"});

IDRegistry.genItemID("dustGold");
Item.createItem("dustGold", "Gold Dust", {name: "dust_gold"});

IDRegistry.genItemID("dustLapis");
Item.createItem("dustLapis", "Lapis Dust", {name: "dust_lapis"});

IDRegistry.genItemID("dustLead");
Item.createItem("dustLead", "Lead Dust", {name: "dust_lead"});

IDRegistry.genItemID("dustDiamond");
Item.createItem("dustDiamond", "Diamond Dust", {name: "dust_diamond"});

IDRegistry.genItemID("dustEnergium");
Item.createItem("dustEnergium", "Energium Dust", {name: "dust_energium"});

Recipes.addShapeless({id: ItemID.dustBronze, count: 4, data: 0}, [
	{id: ItemID.dustCopper, data: -1},
	{id: ItemID.dustCopper, data: -1}, 
	{id: ItemID.dustCopper, data: -1}, 
	{id: ItemID.dustTin, data: -1}
]);

Recipes.addShapeless({id: ItemID.dustEnergium, count: 4, data: 0}, [
	{id: ItemID.dustDiamond, data: -1},
	{id: ItemID.dustDiamond, data: -1}, 
	{id: ItemID.dustDiamond, data: -1}, 
	{id: ItemID.dustDiamond, data: -1}, 
	{id: 331, data: -1},
	{id: 331, data: -1},
	{id: 331, data: -1},
	{id: 331, data: -1},
	{id: 331, data: -1},
]);


IDRegistry.genItemID("ingotCopper");
Item.createItem("ingotCopper", "Copper Ingot", {name: "ingot_copper"});

IDRegistry.genItemID("ingotTin");
Item.createItem("ingotTin", "Tin Ingot", {name: "ingot_tin"});

IDRegistry.genItemID("ingotBronze");
Item.createItem("ingotBronze", "Bronze Ingot", {name: "ingot_bronze"});

IDRegistry.genItemID("ingotSteel");
Item.createItem("ingotSteel", "Steel Ingot", {name: "ingot_steel"});

IDRegistry.genItemID("ingotLead");
Item.createItem("ingotLead", "Lead Ingot", {name: "ingot_lead"});


Callback.addCallback("PreLoaded", function(){
	// steel
	Recipes.addFurnace(265, ItemID.ingotSteel, 0);
	// from dust
	Recipes.addFurnace(ItemID.dustCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.dustTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.dustBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.dustIron, 265, 0);
	Recipes.addFurnace(ItemID.dustGold, 266, 0);
	// from plates
	Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.plateIron, 265, 0);
	Recipes.addFurnace(ItemID.plateGold, 266, 0);
	// from ore
	Recipes.addFurnace(ItemID.oreCrushedCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.oreCrushedTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.oreCrushedLead, ItemID.ingotLead, 0);
});


IDRegistry.genItemID("plateCopper");
Item.createItem("plateCopper", "Copper Plate", {name: "plate_copper"});

IDRegistry.genItemID("plateTin");
Item.createItem("plateTin", "Tin plate", {name: "plate_tin"});

IDRegistry.genItemID("plateIron");
Item.createItem("plateIron", "Iron Plate", {name: "plate_iron"});

IDRegistry.genItemID("plateBronze");
Item.createItem("plateBronze", "Bronze Plate", {name: "plate_bronze"});

IDRegistry.genItemID("plateSteel");
Item.createItem("plateSteel", "Steel Plate", {name: "plate_steel"});

IDRegistry.genItemID("plateGold");
Item.createItem("plateGold", "Gold Plate", {name: "plate_gold"});

IDRegistry.genItemID("plateLapis");
Item.createItem("plateLapis", "Lapis Plate", {name: "plate_lapis"});

IDRegistry.genItemID("plateLead");
Item.createItem("plateLead", "Lead Plate", {name: "plate_lead"});

// recipes
addRecipeWithCraftingTool({id: ItemID.plateCopper, count: 1, data: 0}, [{id: ItemID.ingotCopper, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateTin, count: 1, data: 0}, [{id: ItemID.ingotTin, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateIron, count: 1, data: 0}, [{id: 265, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateBronze, count: 1, data: 0}, [{id: ItemID.ingotBronze, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateSteel, count: 1, data: 0}, [{id: ItemID.ingotSteel, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateGold, count: 1, data: 0}, [{id: 266, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateLapis, count: 1, data: 0}, [{id: 351, data: 4}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.plateLead, count: 1, data: 0}, [{id: ItemID.ingotLead, data: -1}], ItemID.craftingHammer);



IDRegistry.genItemID("casingCopper");
Item.createItem("casingCopper", "Copper Casing", {name: "casing_copper"});

IDRegistry.genItemID("casingTin");
Item.createItem("casingTin", "Tin Casing", {name: "casing_tin"});

IDRegistry.genItemID("casingIron");
Item.createItem("casingIron", "Iron Casing", {name: "casing_iron"});

IDRegistry.genItemID("casingBronze");
Item.createItem("casingBronze", "Bronze Casing", {name: "casing_bronze"});

IDRegistry.genItemID("casingSteel");
Item.createItem("casingSteel", "Steel Casing", {name: "casing_steel"});

IDRegistry.genItemID("casingGold");
Item.createItem("casingGold", "Gold Casing", {name: "casing_gold"});

IDRegistry.genItemID("casingLead");
Item.createItem("casingLead", "Lead Casing", {name: "casing_lead"});

// recipes
addRecipeWithCraftingTool({id: ItemID.casingCopper, count: 1, data: 0}, [{id: ItemID.plateCopper, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingTin, count: 1, data: 0}, [{id: ItemID.plateTin, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingIron, count: 1, data: 0}, [{id: ItemID.plateIron, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingBronze, count: 1, data: 0}, [{id: ItemID.plateBronze, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingSteel, count: 1, data: 0}, [{id: ItemID.plateSteel, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingGold, count: 1, data: 0}, [{id: ItemID.plateGold, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingLead, count: 1, data: 0}, [{id: ItemID.plateLead, data: -1}], ItemID.craftingHammer);


IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", {name: "latex", data: 0});

IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", {name: "rubber", data: 0});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);


IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap", data: 0});

IDRegistry.genItemID("scrapBox");
Item.createThrowableItem("scrapBox", "Scrap Box", {name: "scrap_box", data: 0});

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.scrab, -1]);
	


Item.registerThrowableFunction("scrapBox", function(projectile, item, target){
	var drop = getScrapDropItem();
	World.drop(target.x, target.y + .1, target.z, drop.id, 1, drop.data);
});











	
var SCRAP_BOX_RANDOM_DROP = [
	{chance: .1, id: 264, data: 0},
	{chance: 1.8, id: 15, data: 0},
	{chance: 1.0, id: 14, data: 0},
	{chance: 3, id: 331, data: 0},
	{chance: 0.5, id: 348, data: 0},
	{chance: 5, id: 351, data: 15},
	{chance: 2, id: 17, data: 0},
	{chance: 2, id: 6, data: 0},
	{chance: 2, id: 263, data: 0},
	{chance: 3, id: 260, data: 0},
	{chance: 2.1, id: 262, data: 0},
	{chance: 1, id: 354, data: 0},
	{chance: 3, id: 296, data: 0},
	{chance: 5, id: 280, data: 0},
	{chance: 3.5, id: 287, data: 0},
	{chance: 10, id: 3, data: 0},
	{chance: 3, id: 12, data: 0},
	{chance: 3, id: 13, data: 0},
	{chance: 4, id: 2, data: 0},
	{chance: 1.0, id: ItemID.dustIron, data: 0},
	{chance: 0.8, id: ItemID.dustGold, data: 0},
	{chance: 1.2, id: ItemID.dustCopper, data: 0},
	{chance: 1.2, id: ItemID.dustLead, data: 0},
	{chance: 1.2, id: ItemID.dustTin, data: 0},
	{chance: 1.2, id: ItemID.dustCoal, data: 0},
	{chance: 0.4, id: ItemID.dustDiamond, data: 0},
	{chance: 1.0, id: ItemID.casingIron, data: 0},
	{chance: 0.8, id: ItemID.casingGold, data: 0},
	{chance: 1.2, id: ItemID.casingCopper, data: 0},
	{chance: 1.2, id: ItemID.casingLead, data: 0},
	{chance: 1.2, id: ItemID.casingTin, data: 0},
	{chance: 1.2, id: ItemID.casingCoal, data: 0},
	{chance: 0.4, id: ItemID.casingDiamond, data: 0},
	{chance: 2, id: ItemID.rubber, data: 0},
	{chance: 2, id: ItemID.latex, data: 0},
	{chance: 0.4, id: ItemID.uraniumChunk, data: 0},
	{chance: 2.5, id: ItemID.oreCrushedCopper, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedTin, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedLead, data: 0},
];

function getScrapDropItem(){
	var total = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		total += SCRAP_BOX_RANDOM_DROP[i].chance;
	}
	var random = Math.random() * total * 1.4;
	var current = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		var drop = SCRAP_BOX_RANDOM_DROP[i];
		if (current < random && current + drop.chance > random){
			return drop;
		}
		current += drop.chance;
	}
	
	return {id: ItemID.scrap, data: 0};
}


IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin wire", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Tin wire (isolated)", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper wire", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Copper wire (isolated)", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold1");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold wire", {name: "cable_gold", meta: 0});
Item.createItem("cableGold1", "Gold wire (isolated 1x)", {name: "cable_gold", meta: 1});
Item.createItem("cableGold2", "Gold wire (isolated 2x)", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron1");
IDRegistry.genItemID("cableIron2");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "Iron wire", {name: "cable_iron", meta: 0});
Item.createItem("cableIron1", "Iron wire (isolated 1x)", {name: "cable_iron", meta: 1});
Item.createItem("cableIron2", "Iron wire (isolated 2x)", {name: "cable_iron", meta: 2});
Item.createItem("cableIron3", "Iron wire (isolated 3x)", {name: "cable_iron", meta: 3});

// cutting recipes

addRecipeWithCraftingTool({id: ItemID.cableTin0, count: 3, data: 0}, [{id: ItemID.plateTin, data: -1}], ItemID.craftingCutter);
addRecipeWithCraftingTool({id: ItemID.cableCopper0, count: 3, data: 0}, [{id: ItemID.plateCopper, data: -1}], ItemID.craftingCutter);
addRecipeWithCraftingTool({id: ItemID.cableGold0, count: 4, data: 0}, [{id: ItemID.plateGold, data: -1}], ItemID.craftingCutter);
addRecipeWithCraftingTool({id: ItemID.cableIron0, count: 4, data: 0}, [{id: ItemID.plateIron, data: -1}], ItemID.craftingCutter);

// isolation recipes
Recipes.addShapeless({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableGold1, count: 1, data: 0}, [{id: ItemID.cableGold0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold1, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableIron1, count: 1, data: 0}, [{id: ItemID.cableIron0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [{id: ItemID.cableIron1, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron2, data: -1}, {id: ItemID.rubber, data: -1}]);


// place funcs 
Item.registerUseFunction("cableTin1", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableTin);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});

Item.registerUseFunction("cableCopper1", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableCopper);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});

Item.registerUseFunction("cableGold2", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableGold);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});

Item.registerUseFunction("cableIron3", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableIron);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});


IDRegistry.genItemID("treetap");
Item.createItem("treetap", "Treetap", {name: "treetap", data: 0}, {stack: 1});
Item.setMaxDamage(ItemID.treetap, 17);

Item.registerUseFunction("treetap", function(coords, item, block){
	if (block.id == BlockID.rubberTreeLogLatex && block.data == coords.side - 2){
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLog);
		Player.setCarriedItem(item.id, ++item.data < 17 ? item.count : 0, item.data);
		Entity.setVelocity(
			World.drop(
				coords.relative.x + .5,
				coords.relative.y + .5,
				coords.relative.z + .5,
				ItemID.latex, 1 + parseInt(Math.random() * 3), 0
			),
			(coords.relative.x - coords.x) * .25,
			(coords.relative.y - coords.y) * .25,
			(coords.relative.z - coords.z) * .25
		);
	}
});

Recipes.addShaped({id: ItemID.treetap, count: 1, data: 0}, [
	" x ",
	"xxx",
	"x  "
], ['x', 5, -1]);


IDRegistry.genItemID("fluidCellEmpty");
Item.createItem("fluidCellEmpty", "Cell", {name: "fluid_cell_empty"});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.fluidCellEmpty, count: 16, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, -1]);
});



IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "Battery", {name: "re_battery", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageBattery, 10000, 0);

IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageCrystal, 100000, 1);

IDRegistry.genItemID("circuitBasic");
Item.createItem("circuitBasic", "Circuit", {name: "circuit", meta: 0});

IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitAdvanced", "Advanced Circuit", {name: "circuit", meta: 1});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"a#a",
		"a#a"
	], ['x', ItemID.cableTin1, -1, 'a', ItemID.casingTin, -1, '#', 331, -1]);
	
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xxx",
		"a#a",
		"xxx"
	], ['x', ItemID.cableCopper1, -1, 'a', 331, -1, '#', ItemID.plateIron, -1]);
	
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xax",
		"x#x",
		"xax"
	], ['x', ItemID.cableCopper1, -1, 'a', 331, -1, '#', ItemID.plateIron, -1]);
	
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xbx",
		"a#a",
		"xbx"
	], ['x', 331, -1, 'a', 348, -1, 'b', 351, 4, '#', ItemID.circuitBasic, -1]);
	
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['x', 331, -1, 'a', 348, -1, 'b', 351, 4, '#', ItemID.circuitBasic, -1]);
});


