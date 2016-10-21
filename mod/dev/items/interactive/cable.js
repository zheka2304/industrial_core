IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin wire", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Tin wire (isolated)", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper wire", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Copper wire (isolated)", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold1");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold wire", {name: "cable_gold", meta: 0});
Item.createItem("cableGold1", "Gold wire (isolated 1x)", {name: "cable_gold", meta: 1});
Item.createItem("cableGold2", "Gold wire (isolated 2x)", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron1");
IDRegistry.genItemID("cableIron2");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "Iron wire", {name: "cable_iron", meta: 0});
Item.createItem("cableIron1", "Iron wire (isolated 1x)", {name: "cable_iron", meta: 1});
Item.createItem("cableIron2", "Iron wire (isolated 2x)", {name: "cable_iron", meta: 2});
Item.createItem("cableIron3", "Iron wire (isolated 3x)", {name: "cable_iron", meta: 3});

// cutting recipes

addRecipeWithCraftingTool({id: ItemID.cableTin0, count: 3, data: 0}, [{id: ItemID.plateTin, data: -1}], ItemID.craftingCutter);
addRecipeWithCraftingTool({id: ItemID.cableCopper0, count: 3, data: 0}, [{id: ItemID.plateCopper, data: -1}], ItemID.craftingCutter);
addRecipeWithCraftingTool({id: ItemID.cableGold0, count: 4, data: 0}, [{id: ItemID.plateGold, data: -1}], ItemID.craftingCutter);
addRecipeWithCraftingTool({id: ItemID.cableIron0, count: 4, data: 0}, [{id: ItemID.plateIron, data: -1}], ItemID.craftingCutter);

// isolation recipes
Recipes.addShapeless({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableGold1, count: 1, data: 0}, [{id: ItemID.cableGold0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold1, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableIron1, count: 1, data: 0}, [{id: ItemID.cableIron0, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableIron2, count: 1, data: 0}, [{id: ItemID.cableIron1, data: -1}, {id: ItemID.rubber, data: -1}]);
Recipes.addShapeless({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron2, data: -1}, {id: ItemID.rubber, data: -1}]);


// place funcs 
Item.registerUseFunction("cableTin1", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableTin);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});

Item.registerUseFunction("cableCopper1", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableCopper);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});

Item.registerUseFunction("cableGold2", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableGold);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});

Item.registerUseFunction("cableIron3", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableIron);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyWebBuilder.postWebRebuild();
	}
});