var CRAFTING_TOOL_ITEM_MAX_DAMAGE = 96;

IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

IDRegistry.genItemID("craftingCutter");
Item.createItem("craftingCutter", "Cutter", {name: "crafting_cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingCutter, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

function addRecipeWithCraftingTool(result, data, tool){
	data.push({id: tool, data: -1});
	Recipes.addShapeless(result, data, function(api, field, result){
		for (var i in field){
			if (field[i].id == tool){
				field[i].data++;
				if (field[i].data >= CRAFTING_TOOL_ITEM_MAX_DAMAGE){
					field[i].id = field[i].count = field[i].data = 0;
				}
			}
			else {
				api.decreaseFieldSlot(i);
			}
		}
	});
}

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.craftingHammer, count: 1, data: 0}, [
		"xxx",
		"x#x",
		" # "
	], ['x', 265, -1, '#', 280, -1]);

	Recipes.addShaped({id: ItemID.craftingCutter, count: 1, data: 0}, [
		"x x",
		" x ",
		"a a"
	], ['x', 265, -1, '#', ItemID.plateIron, - 1]);
});
	