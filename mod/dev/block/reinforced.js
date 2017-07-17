var BLOCK_TYPE_REINFORCED_BLOCK = Block.createSpecialType({
	base: 1,
	destroytime: 5,
	explosionres: 150,
	opaque: false,
	lightopacity: 0
}, "reinfrorced_block");

IDRegistry.genBlockID("reinforcedStone");
Block.createBlock("reinforcedStone", [
	{name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true}
], BLOCK_TYPE_REINFORCED_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.reinforcedStone, "stone", 2);
Block.registerDropFunction("reinforcedStone", function(coords, blockID, blockData, level){
	if(level > 2){
		return [[blockID, 1, 0]]
	}
	return [];
}, 3);

IDRegistry.genBlockID("reinforcedGlass");
Block.createBlock("reinforcedGlass", [
	{name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true}
], BLOCK_TYPE_REINFORCED_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.reinforcedGlass, "stone", 2);
Block.setBlockShape(BlockID.reinforcedGlass, {x: 0.001, y: 0.001, z: 0.001}, {x: 0.999, y: 0.999, z: 0.999});
Block.registerDropFunction("reinforcedGlass", function(coords, blockID, blockData, level){
	if(level > 2){
		return [[blockID, 1, 0]]
	}
	return [];
}, 3);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.reinforcedStone, count: 8, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 1, 0]);
	
	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"axa",
		"aaa",
		"axa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"aaa",
		"xax",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
});