IDRegistry.genBlockID("inductionFurnace");
Block.createBlockWithRotation("inductionFurnace", [
	{name: "Induction Furnace", texture: [["machine_bottom", 1], ["machine_advanced", 0], ["machine_side", 1], ["electric_furnace_side", 0], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.inductionFurnace, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xax"
	], ['#', BlockID.electricFurnace, -1, 'x', ItemID.plateCopper, -1, 'a', BlockID.machineBlockAdvanced, -1]);
});

var guiInductionFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Induction Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource1": {type: "slot", x: 511, y: 75},
		"slotSource2": {type: "slot", x: 571, y: 75},
		"slotEnergy": {type: "slot", x: 541, y: 212},
		"slotResult1": {type: "slot", x: 725, y: 142},
		"slotResult2": {type: "slot", x: 785, y: 142},
		"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: "Heat:"},
		"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});


MachineRegistry.registerPrototype(BlockID.inductionFurnace, {
	defaultValues: {
		isHeating: false,
		heat: 0,
		progress: 0
	},
	
	getGuiScreen: function(){
		return guiInductionFurnace;
	},
	
	getResult: function(){
		var sourceSlot1 = this.container.getSlot("slotSource1");
		var sourceSlot2 = this.container.getSlot("slotSource2");
		var result1 = Recipes.getFurnaceRecipeResult(sourceSlot1.id, "iron");
		var result2 = Recipes.getFurnaceRecipeResult(sourceSlot2.id, "iron");
		if (result1 || result2){
			return {
				result1: result1,
				result2: result2,
			};
		}
	},
	
	putResult: function(result, sourceSlot, resultSlot){
		if (result && sourceSlot && resultSlot){
			if (resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				this.container.validateAll();
				return true;
			}
		}
	},
	
	getEfficiency: function(){
		return 16 / (6000 - this.data.heat * 5792);
	},
	
	tick: function(){
		var result = this.getResult();
		if (result){
			var efficiency = this.getEfficiency();
			if (this.data.energy > 15){
				this.data.energy -= 16;
				this.data.progress += efficiency;
			}
			if (this.data.progress >= 1){
				var put1 = this.putResult(result.result1, this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
				var put2 = this.putResult(result.result2, this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
				if (put1 || put2){
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		if (this.data.isHeating && this.data.energy > 0){
			if (this.data.heat < 1){
				this.data.heat += 0.001;
				this.data.energy--;
			}
		}
		else if (this.data.heat > 0){
			this.data.heat -= 0.001;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 1);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", parseInt(this.data.heat * 100) + "%");
	},
	
	redstone: function(signal){
		this.data.isHeating = signal.power > 0;
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});