var CRAFTING_TOOL_ITEM_MAX_DAMAGE = 100;

IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

IDRegistry.genItemID("craftingCutter");
Item.createItem("craftingCutter", "Cutter", {name: "crafting_cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingCutter, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

ToolsModule.addRecipeWithCraftingTool = function(result, data, tool,toolDamage){
	data.push({id: tool, data: -1});
	Recipes.addShapeless(result, data, function(api, field, result){
		for (var i in field){
			if (field[i].id == tool){
				if(toolDamage!=undefined){
				field[i].data += toolDamage;
				}
			else{
				field[i].data++;
				}
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

ToolsModule.addShapedRecipeWithCraftingTool = function(result,recipe, descriptor,tool,toolDamage){
	data.push({id: tool, data: -1});
	Recipes.addShaped(result, recipe, descriptor, function(api, field, result){
		for (var i in field){
			if (field[i].id == tool){
			if (toolDamage!=undefined){
					field[i].data += toolDamage;
				}
				else{
					field[i].data++;
				}
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
	], ['a', 265, -1, 'x', ItemID.plateIron, - 1]);
});
	