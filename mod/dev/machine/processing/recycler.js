
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
		result: 0,
		progress: 0,
		maxProgress: 40
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
			if (this.data.progress >= this.data.maxProgress){
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
		
		this.container.setScale("progressScale", this.data.progress / this.data.maxProgress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return 500;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc,
	 wrenchDescriptions:MachineRegistry.StandardDescriptions.PROCESSING_MACHINE
});