IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 2);

Block.registerDropFunction("machineBlockBasic", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 2);

Block.registerDropFunction("machineBlockAdvanced", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, 0]);
	
	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" x ",
		"a#a",
		" x "
	], ['x', ItemID.carbonPlate, 0, 'a', ItemID.plateAlloy, 0, '#', BlockID.machineBlockBasic, 0]);
	
	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});

