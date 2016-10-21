IDRegistry.genItemID("casingCopper");
Item.createItem("casingCopper", "Copper Casing", {name: "casing_copper"});

IDRegistry.genItemID("casingTin");
Item.createItem("casingTin", "Tin Casing", {name: "casing_tin"});

IDRegistry.genItemID("casingIron");
Item.createItem("casingIron", "Iron Casing", {name: "casing_iron"});

IDRegistry.genItemID("casingBronze");
Item.createItem("casingBronze", "Bronze Casing", {name: "casing_bronze"});

IDRegistry.genItemID("casingSteel");
Item.createItem("casingSteel", "Steel Casing", {name: "casing_steel"});

IDRegistry.genItemID("casingGold");
Item.createItem("casingGold", "Gold Casing", {name: "casing_gold"});

IDRegistry.genItemID("casingLead");
Item.createItem("casingLead", "Lead Casing", {name: "casing_lead"});

// recipes
addRecipeWithCraftingTool({id: ItemID.casingCopper, count: 1, data: 0}, [{id: ItemID.plateCopper, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingTin, count: 1, data: 0}, [{id: ItemID.plateTin, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingIron, count: 1, data: 0}, [{id: ItemID.plateIron, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingBronze, count: 1, data: 0}, [{id: ItemID.plateBronze, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingSteel, count: 1, data: 0}, [{id: ItemID.plateSteel, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingGold, count: 1, data: 0}, [{id: ItemID.plateGold, data: -1}], ItemID.craftingHammer);
addRecipeWithCraftingTool({id: ItemID.casingLead, count: 1, data: 0}, [{id: ItemID.plateLead, data: -1}], ItemID.craftingHammer);
