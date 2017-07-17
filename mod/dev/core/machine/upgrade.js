var UpgradeAPI = {
	_elements: {},

	registerUpgrade: function(id, upgrade){
		UpgradeAPI._elements[id] = upgrade;
	},

	executeUpgrade: function(item, machine, container, data, coords){
		if(UpgradeAPI._elements[item.id]){
			UpgradeAPI._elements[item.id](item.count, machine, container, data, coords);
		}
	},

	executeAll: function(machine){
		var container = machine.container;
		var data = machine.data;
		var coords = {x: machine.x, y: machine.y, z: machine.z};
		
		var upgrades = {};
		for(var slotName in container.slots){
			if(slotName.match(/Upgrade/)){
				var slot = container.getSlot(slotName);
				if(!upgrades[slot.id]){upgrades[slot.id] = slot.count;}
				else{upgrades[slot.id] += slot.count;}
			}
		}
		for(var upgrade in upgrades){
			UpgradeAPI.executeUpgrade({id: upgrade, count: upgrades[upgrade]}, machine, container, data, coords);
		}
	},
	
	findNearestContainers: function(coords, direction){
		var directions = {
			up: {x: 0, y: 1, z: 0},
			down: {x: 0, y: -1, z: 0},
			east: {x: 1, y: 0, z: 0},
			west: {x: -1, y: 0, z: 0},
			south: {x: 0, y: 0, z: 1},
			north: {x: 0, y: 0, z: -1},
		}
		var containers = [];
		if(direction){
			dir = directions[direction]
			var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
			if(container){containers.push(container);}
		}
		else{
			for(var i in directions){
				var dir = directions[i];
				var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
				if(container){containers.push(container);}
			}
		}
		return containers;
	}
}
