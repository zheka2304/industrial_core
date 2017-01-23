
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
		result: 0,
		progress: 0,
		maxProgress: 120
	},
	
	getGuiScreen: function(){
		return guiElectricFurnace;
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		this.data.result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if (this.data.result){
			if (this.data.energy > 1){
				this.data.energy -= 2;
				this.data.progress++;
			}
			if (this.data.progress >= this.data.maxProgress){
				var resultSlot = this.container.getSlot("slotResult");
				if (resultSlot.id == this.data.result.id && resultSlot.data == this.data.result.data && resultSlot.count < 64 || resultSlot.id == 0){
					sourceSlot.count--;
					resultSlot.id = this.data.result.id;
					resultSlot.data = this.data.result.data;
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
		
		this.container.setScale("progressScale", this.data.progress / this.data.maxProgress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 2000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc,
	 wrenchDescriptions:MachineRegistry.StandardDescriptions.PROCESSING_MACHINE
});