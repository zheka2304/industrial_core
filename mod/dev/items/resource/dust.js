IDRegistry.genItemID("dustCopper");
Item.createItem("dustCopper", "Copper Dust", {name: "dust_copper"});

IDRegistry.genItemID("dustTin");
Item.createItem("dustTin", "Tin Dust", {name: "dust_tin"});

IDRegistry.genItemID("dustIron");
Item.createItem("dustIron", "Iron Dust", {name: "dust_iron"});

IDRegistry.genItemID("dustBronze");
Item.createItem("dustBronze", "Bronze Dust", {name: "dust_bronze"});

IDRegistry.genItemID("dustCoal");
Item.createItem("dustCoal", "Coal Dust", {name: "dust_coal"});

IDRegistry.genItemID("dustGold");
Item.createItem("dustGold", "Gold Dust", {name: "dust_gold"});

IDRegistry.genItemID("dustLapis");
Item.createItem("dustLapis", "Lapis Dust", {name: "dust_lapis"});

IDRegistry.genItemID("dustLead");
Item.createItem("dustLead", "Lead Dust", {name: "dust_lead"});

IDRegistry.genItemID("dustDiamond");
Item.createItem("dustDiamond", "Diamond Dust", {name: "dust_diamond"});

IDRegistry.genItemID("dustEnergium");
Item.createItem("dustEnergium", "Energium Dust", {name: "dust_energium"});

Recipes.addShapeless({id: ItemID.dustBronze, count: 4, data: 0}, [
	{id: ItemID.dustCopper, data: -1},
	{id: ItemID.dustCopper, data: -1}, 
	{id: ItemID.dustCopper, data: -1}, 
	{id: ItemID.dustTin, data: -1}
]);

Recipes.addShapeless({id: ItemID.dustEnergium, count: 4, data: 0}, [
	{id: ItemID.dustDiamond, data: -1},
	{id: ItemID.dustDiamond, data: -1}, 
	{id: ItemID.dustDiamond, data: -1}, 
	{id: ItemID.dustDiamond, data: -1}, 
	{id: 331, data: -1},
	{id: 331, data: -1},
	{id: 331, data: -1},
	{id: 331, data: -1},
	{id: 331, data: -1},
]);