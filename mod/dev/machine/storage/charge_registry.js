var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(item, energy, level, preventUncharge){
		var power = Math.floor(Math.log10(energy));
		var energyPerDamage = Math.pow(2, power);
		var maxDamage = Math.floor(energy / energyPerDamage + .999) + 1;
		
		Item.setMaxDamage(item, maxDamage);
		this.chargeData[item] = {
			type: "normal",
			id: item,
			level: level || 0,
			maxDamage: maxDamage,
			maxCharge: energy,
			perDamage: energyPerDamage,
			preventUncharge: preventUncharge
		};
	},
	
	registerFlashItem: function(item, energy, level){
		this.chargeData[item] = {
			type: "flash",
			id: item,
			level: level || 0,
			energy: energy,
		};
	},
	
	getItemData: function(id){
		return this.chargeData[id];
	},
	
	isFlashStorage: function(id){
		var data = this.getItemData(id);
		return data && data.type == "flash";
	},
	
	getEnergyFrom: function(item, amount, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if (!data || data.level > level || data.preventUncharge){
			return 0;
		}
		if (data.type == "flash"){
			if (amount < 1){
				return 0;
			}
			item.count--;
			if (item.count < 1){
				item.id = item.data = item.count = 0;
			}
			return data.energy;
		}
		if (item.data < 1){
			item.data = 1;
		}
		
		var damageAdd = Math.min(data.maxDamage - item.data, Math.floor(amount / data.perDamage));
		var energyGot = damageAdd * data.perDamage;
		item.data += damageAdd;
		return energyGot;
	},
	
	addEnergyTo: function(item, amount, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if (!data || data.type == "flash" || data.level > level){
			return amount;
		}
		
		var damageGot = Math.min(Math.max(item.data - 1, 0), Math.floor(amount / data.perDamage));
		var energyAdd = damageGot * data.perDamage;
		item.data -= damageGot;
		return amount - energyAdd;
	},
	
	getEnergyStored: function(item){
		var data = this.getItemData(item.id);
		if (!data){
			return 0;
		}
		return  (data.maxDamage - item.data) * data.perDamage;
	}
}

ChargeItemRegistry.registerFlashItem(331, 500, 0); // redstone