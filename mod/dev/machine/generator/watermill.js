IDRegistry.genBlockID("genWatermill");
Block.createBlock("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill_generator_side", 0], ["watermill_generator_side", 0], ["watermill_generator_side", 0], ["watermill_generator_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 2, data: 0}, [
		"xax",
		"a#a",
		"xax"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, -1]);
	
	Recipes.addShaped({id: BlockID.genWatermill, count: 2, data: 0}, [
		"axa",
		"x#x",
		"axa"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, -1]);
});


MachineRegistry.registerPrototype(BlockID.genWatermill, {
	energyTick: function(){
		if (World.getThreadTime() % 20 == 0){
			var output = 20;
			var radius = 1;
			var tile = nativeGetTile(
					this.x - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.y - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.z - Math.floor((Math.random() - .5) * (radius * 2 + 1))
				);
			if (tile == 8 || tile == 9){
				this.web.addEnergy(output);
			}
		}
	}
});
