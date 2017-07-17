var BLOCK_TYPE_METAL_BLOCK = Block.createSpecialType({
	base: 1,
	destroytime: 5,
}, "metal_block");

IDRegistry.genBlockID("blockCopper");
Block.createBlock("blockCopper", [
	{name: "Copper Block", texture: [["block_copper", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockCopper, "stone", 2);
Block.registerDropFunction("blockCopper", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockTin");
Block.createBlock("blockTin", [
	{name: "Tin Block", texture: [["block_tin", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockTin, "stone", 2);
Block.registerDropFunction("blockTin", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockBronze");
Block.createBlock("blockBronze", [
	{name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockBronze, "stone", 2);
Block.registerDropFunction("blockBronze", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockLead");
Block.createBlock("blockLead", [
	{name: "Lead Block", texture: [["block_lead", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockLead, "stone", 2);
Block.registerDropFunction("blockLead", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockSteel");
Block.createBlock("blockSteel", [
	{name: "Steel Block", texture: [["block_steel", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockSteel, "stone", 2);
Block.registerDropFunction("blockSteel", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 3);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.blockCopper, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotCopper, 0]);
	
	Recipes.addShaped({id: BlockID.blockTin, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotTin, 0]);
	
	Recipes.addShaped({id: BlockID.blockBronze, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotBronze, 0]);
	
	Recipes.addShaped({id: BlockID.blockLead, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotLead, 0]);
	
	Recipes.addShaped({id: BlockID.blockSteel, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotSteel, 0]);
	
	Recipes.addShaped({id: ItemID.ingotCopper, count: 9, data: 0}, ["x"], ['x', BlockID.blockCopper, 0]);
	Recipes.addShaped({id: ItemID.ingotTin, count: 9, data: 0}, ["x"], ['x', BlockID.blockTin, 0]);
	Recipes.addShaped({id: ItemID.ingotBronze, count: 9, data: 0}, ["x"], ['x', BlockID.blockBronze, 0]);
	Recipes.addShaped({id: ItemID.ingotLead, count: 9, data: 0}, ["x"], ['x', BlockID.blockLead, 0]);
	Recipes.addShaped({id: ItemID.ingotSteel, count: 9, data: 0}, ["x"], ['x', BlockID.blockSteel, 0]);
});