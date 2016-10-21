IDRegistry.genBlockID("genWindmill");
Block.createBlock("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill_generator_side", 0], ["windmill_generator_side", 0], ["windmill_generator_side", 0], ["windmill_generator_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, -1]);
});

MachineRegistry.registerPrototype(BlockID.genWindmill, {
	energyTick: function(){
		if (World.getThreadTime() % 20 == 0){
			var height = Math.min(0, this.y - 64) / 64;
			var output = height * 160;
			var radius = 3;
			if (nativeGetTile(
					this.x - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.y - Math.floor((Math.random() - .5) * (radius * 2 + 1)),
					this.z - Math.floor((Math.random() - .5) * (radius * 2 + 1))
				) == 0){
				this.web.addEnergy(output);
			}
		}
	}
});
