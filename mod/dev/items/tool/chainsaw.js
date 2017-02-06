IDRegistry.genItemID("chainsaw");
Item.createItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.chainsaw, 30000, 1, true, 50);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: Item.getMaxDamage(ItemID.drill)}, [
		" pp",
		"ppp",
		"xp "
	], ['x', ItemID.powerUnit, -1, 'p', ItemID.plateIron, 0]);
});


ToolType.chainsaw = {
	damage: 0,
	blockTypes: ["wood"],
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

ToolAPI.setTool(ItemID.chainsaw, {durability: 625, level: 3, efficiency: 8, damage: 4},  ToolType.chainsaw);