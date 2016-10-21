IDRegistry.genBlockID("solarPannel");
Block.createBlock("solarPannel", [
	{name: "Solar Pannel", texture: [["machine_bottom", 0], ["solar_pannel_top", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPannel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.dustCoal, 0, 'b', ItemID.cableCopper1, -1, 'a', 20, 0]);
});

MachineRegistry.registerPrototype(BlockID.solarPannel, {
	energyTick: function(){
		if (World.getThreadTime() % 10 == 0 && nativeGetLightLevel(this.x, this.y + 1, this.z) == 15){
			this.web.addEnergy(10);
		}
	}
});
