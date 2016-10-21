IDRegistry.genItemID("fluidCellEmpty");
Item.createItem("fluidCellEmpty", "Cell", {name: "fluid_cell_empty"});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.fluidCellEmpty, count: 16, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, -1]);
});

