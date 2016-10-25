IDRegistry.genItemID("bronzeHelmet");
IDRegistry.genItemID("bronzeChestplate");
IDRegistry.genItemID("bronzeLeggings");
IDRegistry.genItemID("bronzeBoots");

Item.createArmorItem("bronzeHelmet", "Bronze Helmet", {name: "armor_bronze_helmet"}, {type: "helmet", armor: 2, durability: 166, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeChestplate", "Bronze Chestplate", {name: "armor_bronze_chestplate"}, {type: "chestplate", armor: 6, durability: 241, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeLeggings", "Bronze Leggings", {name: "armor_bronze_leggings"}, {type: "leggings", armor: 3, durability: 226, texture: "armor/bronze_2.png"});
Item.createArmorItem("bronzeBoots", "Bronze Boots", {name: "armor_bronze_boots"}, {type: "boots", armor: 2, durability: 196, texture: "armor/bronze_1.png"});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.bronzeHelmet, count: 1, data: 0}, [
		"xxx",
		"x x"
	], ['x', ItemID.ingotBronze, -1]);
	
	Recipes.addShaped({id: ItemID.bronzeChestplate, count: 1, data: 0}, [
		"x x",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotBronze, -1]);
	
	Recipes.addShaped({id: ItemID.bronzeLeggings, count: 1, data: 0}, [
		"xxx",
		"x x",
		"x x"
	], ['x', ItemID.ingotBronze, -1]);
	
	Recipes.addShaped({id: ItemID.bronzeBoots, count: 1, data: 0}, [
		"x x",
		"x x"
	], ['x', ItemID.ingotBronze, -1]);
});