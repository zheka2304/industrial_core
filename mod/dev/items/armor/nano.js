IDRegistry.genItemID("nanoHelmet");
IDRegistry.genItemID("nanoChestplate");
IDRegistry.genItemID("nanoLeggings");
IDRegistry.genItemID("nanoBoots");

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "armor_nano_helmet"}, {type: "helmet", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplate", "Nano Chestplate", {name: "armor_nano_chestplate"}, {type: "chestplate", armor: 8, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "armor_nano_leggings"}, {type: "leggings", armor: 6, durability: 625, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "armor_nano_boots"}, {type: "boots", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: true});

Player.addItemCreativeInv(ItemID.nanoHelmet, 1, 1);
Player.addItemCreativeInv(ItemID.nanoChestplate, 1, 1);
Player.addItemCreativeInv(ItemID.nanoLeggings, 1, 1);
Player.addItemCreativeInv(ItemID.nanoBoots, 1, 1);

ChargeItemRegistry.registerItem(ItemID.nanoHelmet, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoChestplate, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoLeggings, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoBoots, 100000, 1, true, 160);

IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet", {name: "armor_nano_helmet"}, {type: "helmet", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Chestplate", {name: "armor_nano_chestplate"}, {type: "chestplate", armor: 6, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings", {name: "armor_nano_leggings"}, {type: "leggings", armor: 3, durability: 625, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots", {name: "armor_nano_boots"}, {type: "boots", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmetUncharged, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoChestplateUncharged, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoLeggingsUncharged, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoBootsUncharged, 100000, 1, true, 160);


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
		if(index == 0) UIbuttons.enableButton("button_nightvision");
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		if(slot.data > this.maxDamage - 5){
			slot.id = armor.uncharged;
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			if(index==0 && nightVisionEnabled){
				if(World.getThreadTime()%640==0){slot.data++;}
				var coords = Player.getPosition();
				if(nativeGetLightLevel(coords.x, coords.y, coords.z)==15){
					Entity.addEffect(player, MobEffect.blindness, 25, 1);
				}
				Entity.addEffect(player, MobEffect.nightVision, 225, 1);
			}
			if(index == 3){
				var vel = Player.getVelocity();
				if(vel.y < -0.226 && slot.data < this.maxDamage - 4){
					Entity.addEffect(player, MobEffect.jump, 2, 12);
				}
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
			}
			return true;
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


Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: Item.getMaxDamage(ItemID.nanoHelmet)}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: Item.getMaxDamage(ItemID.nanoChestplate)}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: Item.getMaxDamage(ItemID.nanoLeggings)}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: Item.getMaxDamage(ItemID.nanoBoots)}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
