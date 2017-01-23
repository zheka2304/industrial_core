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
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageBatBox, {
	defaultValues: {
		TRANSFER: 32
	},
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
		
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(this.data.TRANSFER, energyStorage - this.data.energy), 0);
		this.data.energy += ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), Math.min(this.data.TRANSFER, this.data.energy), 0) - Math.min(this.data.TRANSFER, this.data.energy);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	energyTick: function(){
		var delta = 8 - this.web.energy;
		var transfer = Math.min(Math.abs(delta), this.data.TRANSFER);
		
		if (delta > 0){
			var output = Math.min(this.data.TRANSFER, this.data.energy);
			var left = this.web.addEnergy(output);
			this.data.energy += left - output;
		}
		if (delta < 0){
			var input = this.web.requireEnergy(Math.min(transfer, this.getEnergyStorage() - this.data.energy));
			this.data.energy += input;
		}
	},
	wrenchDescriptions: MachineRegistry.StandardDescriptions.ENERGY_STORAGE
});