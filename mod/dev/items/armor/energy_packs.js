IDRegistry.genItemID("batpack");
IDRegistry.genItemID("lappack");
Item.createArmorItem("batpack", "Batpack", {name: "armor_batpack"}, {type: "chestplate", armor: 3, durability: 6000, texture: "armor/batpack_1.png", isTech: true});
Item.createArmorItem("lappack", "Lappack", {name: "armor_lappack"}, {type: "chestplate", armor: 3, durability: 30000, texture: "armor/lappack_1.png", isTech: true});
Player.addItemCreativeInv(ItemID.batpack, 1, 1);
Player.addItemCreativeInv(ItemID.lappack, 1, 1);
ChargeItemRegistry.registerItem(ItemID.batpack, 60000, 0, true, 10);
ChargeItemRegistry.registerItem(ItemID.lappack, 300000, 1, true, 10);

Recipes.addShaped({id: ItemID.batpack, count: 1, data: 6000}, [
	"bcb",
	"bab",
	"b b"
], ['a', ItemID.plateIron, 0, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitBasic, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.lappack, count: 1, data: 30000}, [
	"bcb",
	"bab",
	"b b"
], ['a', ItemID.batpack, -1, 'b', 22, 0, 'c', ItemID.circuitAdvanced, 0], RECIPE_FUNC_TRANSPORT_ENERGY);


var ENERGY_PACK_TICK = function(slot){
	if(slot.data > this.maxDamage-5){
		slot.data = this.maxDamage-4;
		return true;
	}
	
	var item = Player.getCarriedItem();
	var data = ChargeItemRegistry.getItemData(item.id);
	if(!data || !data.isTool || data.level > this.level || item.data <= 1){
		return false;
	}
	
	var itemDataChange = Math.min(Math.max(this.transfer/data.perDamage, 1), item.data-1);
	var armorDataChange = itemDataChange*data.perDamage/10;
	if(this.maxDamage-5-slot.data >= armorDataChange){
		slot.data += armorDataChange;
		Player.setCarriedItem(item.id, 1, item.data - itemDataChange);
		return true;
	}
}

Armor.registerFuncs("batpack", {maxDamage: 6000, level: 0, transfer: 30, tick: ENERGY_PACK_TICK});
Armor.registerFuncs("lappack", {maxDamage: 30000, level: 1, transfer: 120, tick: ENERGY_PACK_TICK});