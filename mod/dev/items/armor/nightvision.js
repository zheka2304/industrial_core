IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "armor_nightvision"}, {type: "helmet", armor: 1, durability: 30000, texture: "armor/nightvision_1.png", isTech: true});
Player.addItemCreativeInv(ItemID.nightvisionGoggles, 1, 1);
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, 30000, 0, true, 1);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: 30000}, [
		"bbb",
		"aca",
		"i i"
	], ['a', 102, 0, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitAdvanced, 0, "i", ItemID.casingIron, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

var nightVisionEnabled = false;

Armor.registerFuncs("nightvisionGoggles", {
	maxDamage: 30000,
	tick: function(slot, inventory){
		UIbuttons.enableButton("button_nightvision");
		if(slot.data > this.maxDamage - 5){
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			if(nightVisionEnabled){
				if(World.getThreadTime()%4==0){slot.data++;Game.message(slot.data);}
				var coords = Player.getPosition();
				if(nativeGetLightLevel(coords.x, coords.y, coords.z)==15){
					Entity.addEffect(player, MobEffect.blindness, 25, 1);
				}
				Entity.addEffect(player, MobEffect.nightVision, 225, 1);
				return true;
			}
			return false;
		}
	}
});