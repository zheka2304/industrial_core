IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel_top", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.dustCoal, 0, 'b', ItemID.cableCopper1, -1, 'a', 20, 0]);
});

MachineRegistry.registerPrototype(BlockID.solarPanel, {
	energyTick: function(){
		if (World.getThreadTime() % 10 == 0 && nativeGetLightLevel(this.x, this.y + 1, this.z) == 15){
			this.web.addEnergy(10);
		}
	}
});
