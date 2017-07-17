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
		ICRenderLib.addConnectionBlock(TILE_RENDERER_CONNECTION_GROUP, id);
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
		/*
		Prototype.click = function(id, count, data, coords){
			if(id==ItemID.wrench || id==ItemID.electricWrench){
				return true;
			}
		}
		*/
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
		
		ToolAPI.registerBlockMaterial(id, "stone");
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

