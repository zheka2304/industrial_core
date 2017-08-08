var MachineRegistry = {
	machineIDs: {},
	
	isMachine: function(id){
		return this.machineIDs[id];
	},
	
	getMachineDrop(coords, blockID, standartDrop){
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrench){
			ToolAPI.breakCarriedTool(10);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			if(Math.random() < 0.8){return [[blockID, 1, 0]];}
			return [[standartDrop, 1, 0]];
		}
		if(item.id==ItemID.electricWrench && item.data < 200){
			Player.setCarriedItem(item.id, 1, Math.min(item.data+10, 200));
			World.setBlock(coords.x, coords.y, coords.z, 0);
			return [[blockID, 1, 0]];
		}
		return [[standartDrop, 1, 0]];
	},
	
	registerPrototype: function(id, Prototype){
		// register render
		ICRenderLib.addConnectionBlock("ic-wire", id);
		// register ID
		this.machineIDs[id] = true;
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
		if(!Prototype.getEnergyStorage){
			Prototype.getEnergyStorage = function(){
				return 0;
			};
		}
		/*
		Prototype.click = function(id, count, data, coords){
			if(id==ItemID.wrench || id==ItemID.electricWrench){
				return true;
			}
		}
		*/
		
		ToolAPI.registerBlockMaterial(id, "stone");
		TileEntity.registerPrototype(id, Prototype);
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	},
	
	// standart functions
	basicEnergyReceiveFunc: function(type, src){
		var energyNeed = this.getEnergyStorage() - this.data.energy;
		this.data.energy += src.getAll(energyNeed);
	}
}
