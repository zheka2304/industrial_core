
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