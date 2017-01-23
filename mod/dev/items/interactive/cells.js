IDRegistry.genItemID("fluidCellEmpty");
Item.createItem("fluidCellEmpty", "Cell", {name: "fluid_cell_empty"});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.fluidCellEmpty, count: 16, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, -1]);
});


ToolsModule.addCell = function(id, texture, name, idLiquid, blockLiquid){
	var addItem = ModAPI.requireGlobal("Player.addItemInventory")
	IDRegistry.genItemID(id);
	Item.createItem(id, name, {name: texture});
	LiquidRegistry.registerItem(idLiquid, {id: "fluidCellEmpty", data: -1}, {id: id, data: -1})
	if (blockLiquid){
	 	Item.registerUseFunction("fluidCellEmpty", function(coords, item, block){
			var place = coords;
			if (GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
				World.setBlock(place.x, place.y, place.z, blockLiquid);
				Player.setCarriedItem(item.id, item.count - 1, item.data);
				addItem(id, 1)
			}
		})
	}
}