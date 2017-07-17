IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");
Item.setElectricItem("drill", "Drill", {name: "drill", meta: 0});
Item.setElectricItem("diamondDrill", "Diamond Drill", {name: "drill", meta: 1});
//Item.setElectricItem("iridiumDrill", "Iridium Drill", {name: "drill", meta: 2}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.drill, 30000, 0, true, 50, true);
ChargeItemRegistry.registerItem(ItemID.diamondDrill, 30000, 0, true, 80, true);
//ChargeItemRegistry.registerItem(ItemID.iridiumDrill, 100000, 1, true, 200, true);

ToolType.drill = {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	onBroke: function(item){
		item.data = Math.min(item.data, Item.getMaxDamage(item.id));
		return true;
	},
	onAttack: function(item, mob){
		if(item.data < Item.getMaxDamage(item.id)){
			item.data--;
		}
		else{item.data -= 2;}
	},
	calcDestroyTime: function(item, block, params, destroyTime, enchant){
		if(item.data < Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		else{
			return params.base;
		}
	}
}

ToolAPI.setTool(ItemID.drill, {durability: 600, level: 3, efficiency: 8, damage: 3},  ToolType.drill);
ToolAPI.setTool(ItemID.diamondDrill, {durability: 375, level: 4, efficiency: 16, damage: 4}, ToolType.drill);
//ToolAPI.setTool(ItemID.iridiumDrill, {durability: 500, level: 4, efficiency: 24, damage: 5}, ToolType.drill);


Recipes.addShaped({id: ItemID.drill, count: 1, data: 600}, [
	" p ",
	"ppp",
	"pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: 375}, [
	" a ",
	"ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
/*
Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: Item.getMaxDamage(ItemID.iridiumDrill)}, [
	" a ",
	"ada",
	" e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
*/