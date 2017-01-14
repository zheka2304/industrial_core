var EnergyWebBuilder = {
	rebuildFor: function(machine){
		var web = new EnergyWeb();
		this.rebuildRecursive(web, machine.x, machine.y, machine.z, {});
		return web;
	},
	
	rebuildRecursive: function(web, x, y, z, explored){
		var coordKey = x + ":" + y + ":" + z;
		if (explored[coordKey]){
			return;
		}
		else{
			explored[coordKey] = true;
		}
		
		var mech = MachineRegistry.accessMachineAtCoords(x, y, z);
		if (mech){
			web.addMachine(mech);
			this.rebuildFor6Sides(web, x, y, z, explored);
		}
		else {
			var tile = nativeGetTile(x, y, z);
			if (tile == BLOCK_TYPE_CABLE_ID){
				this.rebuildFor6Sides(web, x, y, z, explored);
			}
			else {
				return;
			}
		}
	},
	
	rebuildFor6Sides: function(web, x, y, z, explored){
		this.rebuildRecursive(web, x - 1, y, z, explored);
		this.rebuildRecursive(web, x + 1, y, z, explored);
		this.rebuildRecursive(web, x, y - 1, z, explored);
		this.rebuildRecursive(web, x, y + 1, z, explored);
		this.rebuildRecursive(web, x, y, z - 1, explored);
		this.rebuildRecursive(web, x, y, z + 1, explored);
	},
	
	postedRebuildTimer: 0,
	
	clearWebData: function(){
		MachineRegistry.executeForAll(function(machine){
			machine.web = null;
		});
	},
	
	postWebRebuild: function(delay){
		this.postedRebuildTimer = delay || 60;
	}
}

Callback.addCallback("tick", function(){
	if (EnergyWebBuilder.postedRebuildTimer > 0){
		EnergyWebBuilder.postedRebuildTimer--;
		if (EnergyWebBuilder.postedRebuildTimer <= 0){
			EnergyWebBuilder.clearWebData();
		}
	}
});