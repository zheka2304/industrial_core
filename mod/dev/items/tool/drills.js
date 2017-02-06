IDRegistry.genItemID("drill");
IDRegistry.genItemID("drillDiamond");
//IDRegistry.genItemID("drillIridium");
Item.createItem("drill", "Drill", {name: "drill", meta: 0}, {stack: 1});
Item.createItem("drillDiamond", "Diamond Drill", {name: "diamond_drill", meta: 0}, {stack: 1});
//Item.createItem("drillIridium", "Iridium Drill", {name: "tool_iridium_drill", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.drill, 30000, 0, true, 50);
ChargeItemRegistry.registerItem(ItemID.drillDiamond, 30000, 0, true, 80);
//ChargeItemRegistry.registerItem(ItemID.drillIridium, 100000, 1, true, 160);

ToolType.drill = {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	onBroke: function(item){
		item.data = Math.min(item.data, Item.getMaxDamage(item.id));
		return true;
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

ToolAPI.setTool(ItemID.drill, {durability: 625, level: 3, efficiency: 8, damage: 4},  ToolType.drill);
ToolAPI.setTool(ItemID.drillDiamond, {durability: 375, level: 4, efficiency: 16, damage: 5}, ToolType.drill);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.drill, count: 1, data: Item.getMaxDamage(ItemID.drill)}, [
		" p ",
		"ppp",
		"pxp"
	], ['x', ItemID.powerUnit, -1, 'p', ItemID.plateIron, 0]);
	
	Recipes.addShaped({id: ItemID.drillDiamond, count: 1, data: Item.getMaxDamage(ItemID.drillDiamond)}, [
		" a ",
		"ada"
	], ['d', ItemID.drill, -1, 'a', ItemID.dustDiamond, 0]);
	
	Recipes.addShaped({id: ItemID.drillIridium, count: 1, data: Item.getMaxDamage(ItemID.drillIridium)}, [
		" a ",
		"ada",
		" e "
	], ['d', ItemID.drill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});