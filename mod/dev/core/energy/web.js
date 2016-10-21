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