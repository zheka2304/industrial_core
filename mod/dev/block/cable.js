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

var STANDART_CABLE_WIDTH = 1/2; // 6
var GOLD_CABLE_WIDTH = 5/8; // 8
var HV_CABLE_WIDTH = 3/4; // 10
var OPTIC_CABLE_WIDTH = 1/4;

Block.setBlockShape(BlockID.cableTin, {x: 0.5 - STANDART_CABLE_WIDTH/2, y: 0.5 - STANDART_CABLE_WIDTH/2, z: 0.5 - STANDART_CABLE_WIDTH/2}, {x: 0.5 + STANDART_CABLE_WIDTH/2, y: 0.5 + STANDART_CABLE_WIDTH/2, z: 0.5 + STANDART_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableCopper, {x: 0.5 - STANDART_CABLE_WIDTH/2, y: 0.5 - STANDART_CABLE_WIDTH/2, z: 0.5 - STANDART_CABLE_WIDTH/2}, {x: 0.5 + STANDART_CABLE_WIDTH/2, y: 0.5 + STANDART_CABLE_WIDTH/2, z: 0.5 + STANDART_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableGold, {x: 0.5 - GOLD_CABLE_WIDTH/2, y: 0.5 - GOLD_CABLE_WIDTH/2, z: 0.5 - GOLD_CABLE_WIDTH/2}, {x: 0.5 + GOLD_CABLE_WIDTH/2, y: 0.5 + GOLD_CABLE_WIDTH/2, z: 0.5 + GOLD_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableIron, {x: 0.5 - HV_CABLE_WIDTH/2, y: 0.5 - HV_CABLE_WIDTH/2, z: 0.5 - HV_CABLE_WIDTH/2}, {x: 0.5 + HV_CABLE_WIDTH/2, y: 0.5 + HV_CABLE_WIDTH/2, z: 0.5 + HV_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableOptic, {x: 0.5 - OPTIC_CABLE_WIDTH/2, y: 0.5 - OPTIC_CABLE_WIDTH/2, z: 0.5 - OPTIC_CABLE_WIDTH/2}, {x: 0.5 + OPTIC_CABLE_WIDTH/2, y: 0.5 + OPTIC_CABLE_WIDTH/2, z: 0.5 + OPTIC_CABLE_WIDTH/2});

ICRenderLib.registerAsWire(BlockID.cableTin, "ic-wire", STANDART_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableCopper, "ic-wire", STANDART_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableGold, "ic-wire", GOLD_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableIron, "ic-wire", HV_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableOptic, "ic-wire", OPTIC_CABLE_WIDTH);

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
	return [[ItemID.cableOptic, 1, 0]];;
});