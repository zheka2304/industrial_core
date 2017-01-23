
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
		"ItemID.latex": {id: ItemID.rubber, count: 3, data: 0},
		"BlockID.rubberTreeLog": {id: ItemID.rubber, count: 1, data: 0}
	}, true);
});

MachineRegistry.registerPrototype(BlockID.extractor, {
	defaultValues: {
		result: 0,
		progress: 0,
		maxProgress: 360
	},
	
	getGuiScreen: function(){
		return guiExtractor;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
		if (this.data.result){
			if (this.data.energy > 2){
				this.data.energy -= 3;
				this.data.progress++;
			}
			if (this.data.progress >= this.data.maxProgress){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == this.data.result.id && resultSlot.data == this.data.result.data && resultSlot.count <= 64 - this.data.result.count || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = this.data.result.id;
					resultSlot.data = this.data.result.data;
					resultSlot.count += this.data.result.count;
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
		
		this.container.setScale("progressScale", this.data.progress / this.data.maxProgress) ;
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc,
	 wrenchDescriptions:MachineRegistry.StandardDescriptions.PROCESSING_MACHINE
});