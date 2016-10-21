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