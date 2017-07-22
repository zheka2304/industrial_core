IDRegistry.genBlockID("cableTin");
Block.createBlock("cableTin", [
	{name: "tile.cableTin.name", texture: [["cable_block_tin", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableCopper");
Block.createBlock("cableCopper", [
	{name: "tile.cableCopper.name", texture: [["cable_block_copper", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableGold");
Block.createBlock("cableGold", [
	{name: "tile.cableGold.name", texture: [["cable_block_gold", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableIron");
Block.createBlock("cableIron", [
	{name: "tile.cableIron.name", texture: [["cable_block_iron", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableOptic");
Block.createBlock("cableOptic", [
	{name: "tile.cableOptic.name", texture: [["cable_block_optic", 0]], inCreative: false}
], EU.getWireSpecialType());

var CABLE_BLOCK_WIDTH = 0.25;
Block.setBlockShape(BlockID.cableTin, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableCopper, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableGold, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableIron, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});
Block.setBlockShape(BlockID.cableOptic, {x: 0.5 - CABLE_BLOCK_WIDTH, y: 0.5 - CABLE_BLOCK_WIDTH, z: 0.5 - CABLE_BLOCK_WIDTH}, {x: 0.5 + CABLE_BLOCK_WIDTH, y: 0.5 + CABLE_BLOCK_WIDTH, z: 0.5 + CABLE_BLOCK_WIDTH});

ICRenderLib.registerAsWire(BlockID.cableTin, TILE_RENDERER_CONNECTION_GROUP);
ICRenderLib.registerAsWire(BlockID.cableCopper, TILE_RENDERER_CONNECTION_GROUP);
ICRenderLib.registerAsWire(BlockID.cableGold, TILE_RENDERER_CONNECTION_GROUP);
ICRenderLib.registerAsWire(BlockID.cableIron, TILE_RENDERER_CONNECTION_GROUP);
ICRenderLib.registerAsWire(BlockID.cableOptic, TILE_RENDERER_CONNECTION_GROUP);

// drop 
Block.registerDropFunction("cableTin", function(){
	return [[ItemID.cableTin1, 1, 0]];
});

Block.registerDropFunction("cableCopper", function(){
	return [[ItemID.cableCopper1, 1, 0]];
});

Block.registerDropFunction("cableGold", function(){
	return [[ItemID.cableGold2, 1, 0]];
});

Block.registerDropFunction("cableIron", function(){
	return [[ItemID.cableIron3, 1, 0]];
});

Block.registerDropFunction("cableOptic", function(){
	return [];
});