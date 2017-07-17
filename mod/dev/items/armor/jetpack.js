IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "armor_jetpack"}, {type: "chestplate", armor: 3, durability: 6000, texture: "armor/jetpack_1.png", isTech: true});
Player.addItemCreativeInv(ItemID.jetpack, 1, 1) ;
ChargeItemRegistry.registerItem(ItemID.jetpack, 6000, 0, true, 5);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: 6000}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, "d", 348, 0]);
	

Armor.registerFuncs("jetpack", {
	maxDamage: Item.getMaxDamage(ItemID.jetpack),
	tick: function(slot, inventory, index){
		if(slot.data > this.maxDamage - 5){
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			UIbuttons.enableButton("button_fly");
			var vel = Player.getVelocity();
			if(vel.y < -0.226 && vel.y > -0.9){
				Entity.addEffect(player, MobEffect.jump, 2, 255);
			}
			return true;
		}
	}
});