IDRegistry.genItemID("nanoHelmet");
IDRegistry.genItemID("nanoChestplate");
IDRegistry.genItemID("nanoLeggings");
IDRegistry.genItemID("nanoBoots");

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "armor_nano_helmet"}, {type: "helmet", armor: 4, durability: 1000, texture: "armor/nano_1.png"});
Item.createArmorItem("nanoChestplate", "Nano Chestplate", {name: "armor_nano_chestplate"}, {type: "chestplate", armor: 8, durability: 1000, texture: "armor/nano_1.png"});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "armor_nano_leggings"}, {type: "leggings", armor: 6, durability: 1000, texture: "armor/nano_2.png"});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "armor_nano_boots"}, {type: "boots", armor: 4, durability: 1000, texture: "armor/nano_1.png"});

ChargeItemRegistry.registerItem(ItemID.nanoHelmet, 100000, 1, true, 50);
ChargeItemRegistry.registerItem(ItemID.nanoChestplate, 100000, 1, true, 50);
ChargeItemRegistry.registerItem(ItemID.nanoLeggings, 100000, 1, true, 50);
ChargeItemRegistry.registerItem(ItemID.nanoBoots, 100000, 1, true, 50);

IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet (Uncharged)", {name: "armor_nano_helmet"}, {type: "helmet", armor: 2, durability: 1000, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Chestplate (Uncharged)", {name: "armor_nano_chestplate"}, {type: "chestplate", armor: 6, durability: 1000, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings (Uncharged)", {name: "armor_nano_leggings"}, {type: "leggings", armor: 3, durability: 1000, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots (Uncharged)", {name: "armor_nano_boots"}, {type: "boots", armor: 2, durability: 1000, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmetUncharged, 100000, 1, true, 50);
ChargeItemRegistry.registerItem(ItemID.nanoChestplateUncharged, 100000, 1, true, 50);
ChargeItemRegistry.registerItem(ItemID.nanoLeggingsUncharged, 100000, 1, true, 50);
ChargeItemRegistry.registerItem(ItemID.nanoBootsUncharged, 100000, 1, true, 50);


MachineRecipeRegistry.registerRecipesFor("nano-armor-charge", {
	"ItemID.nanoHelmet": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoHelmetUncharged": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoChestplate": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoChestplateUncharged": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoLeggings": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoLeggingsUncharged": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoBoots": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
	"ItemID.nanoBootsUncharged": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
}, true);


var NANO_ARMOR_FUNCS_CHARGED = {
	maxDamage: Item.getMaxDamage(ItemID.nanoHelmet),
	tick: function(slot, inventory, index){
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		if (slot.data > this.maxDamage - 5){
			slot.id = armor.uncharged;
			slot.data = this.maxDamage - 4;
			return true;
		}
		else if (slot.id != armor.charged){
			slot.id = armor.charged;
			return true;
		}
		
		if (index == 3){
			var vel = Player.getVelocity();
			if (vel.y < -.226 && slot.data < this.maxDamage - 4){
				Entity.addEffect(Player.get(), MobEffect.jump, 2, 12);
				slot.data++;
				return true;
			}
		}
	}
};

Armor.registerFuncs("nanoHelmet", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoHelmetUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplate", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplateUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggings", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggingsUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBoots", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBootsUncharged", NANO_ARMOR_FUNCS_CHARGED);




Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: Item.getMaxDamage(ItemID.nanoHelmet)}, [
		"x#x",
		"xax"
	], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, -1, 'a', 20, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: Item.getMaxDamage(ItemID.nanoChestplate)}, [
		"x x",
		"x#x",
		"xxx"
	], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: Item.getMaxDamage(ItemID.nanoLeggings)}, [
		"x#x",
		"x x",
		"x x"
	], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: Item.getMaxDamage(ItemID.nanoBoots)}, [
		"x x",
		"x#x"
	], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
});
