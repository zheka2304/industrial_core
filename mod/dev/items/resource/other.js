IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap", data: 0});

IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", {name: "scrap_box", data: 0});

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.scrab, -1]);
