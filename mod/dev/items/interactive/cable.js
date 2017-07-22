IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin wire", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Tin wire (isolated)", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper wire", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Copper wire (isolated)", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold wire", {name: "cable_gold", meta: 0});
Item.createItem("cableGold2", "Gold wire (isolated 2x)", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "Iron wire", {name: "cable_iron", meta: 0});
Item.createItem("cableIron3", "Iron wire (isolated 3x)", {name: "cable_iron", meta: 3});

// cutting recipes
Callback.addCallback("PostLoaded", function(){
	addRecipeWithCraftingTool({id: ItemID.cableTin0, count: 3, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingCutter);
	addRecipeWithCraftingTool({id: ItemID.cableCopper0, count: 3, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingCutter);
	addRecipeWithCraftingTool({id: ItemID.cableGold0, count: 4, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingCutter);
});

// isolation recipes
addShapelessRecipe({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, count: 1, data: 0}, {id: ItemID.rubber, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, count: 1, data: 0}, {id: ItemID.rubber, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold0, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);
addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron0, count: 1, data: 0}, {id: ItemID.rubber, count: 3, data: 0}]);


// place funcs 
Item.registerUseFunction("cableTin1", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableTin);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableCopper1", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableCopper);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableGold2", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableGold);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableIron3", function(coords, item, block){
	var place = coords.relative;
	if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableIron);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});