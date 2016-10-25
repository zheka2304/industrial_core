IDRegistry.genItemID("storageBattery");
Item.createItem("storageBattery", "Battery", {name: "re_battery", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageBattery, 10000, 0);

IDRegistry.genItemID("storageCrystal");
Item.createItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageCrystal, 100000, 1);


IDRegistry.genItemID("storageLapotronCrystal");
Item.createItem("storageLapotronCrystal", "Lapotron Crystal", {name: "lapotron_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageLapotronCrystal, 1000000, 2);


IDRegistry.genItemID("circuitBasic");
Item.createItem("circuitBasic", "Circuit", {name: "circuit", meta: 0});

IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitAdvanced", "Advanced Circuit", {name: "circuit", meta: 1});


var RECIPE_FUNC_TRANSPORT_ENERGY = function(api, field, result){
	var energy = 0;
	for (var i in field){
		if (!ChargeItemRegistry.isFlashStorage(field[i].id)){
			energy += ChargeItemRegistry.getEnergyFrom(field[i], 10000000, 3);
		}
		api.decreaseFieldSlot(i);
	}
	ChargeItemRegistry.addEnergyTo(result, energy, 3);
}

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"a#a",
		"a#a"
	], ['x', ItemID.cableTin1, -1, 'a', ItemID.casingTin, -1, '#', 331, -1]);
	
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xxx",
		"a#a",
		"xxx"
	], ['x', ItemID.cableCopper1, -1, 'a', 331, -1, '#', ItemID.plateIron, -1]);
	
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xax",
		"x#x",
		"xax"
	], ['x', ItemID.cableCopper1, -1, 'a', 331, -1, '#', ItemID.plateIron, -1]);
	
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xbx",
		"a#a",
		"xbx"
	], ['x', 331, -1, 'a', 348, -1, 'b', 351, 4, '#', ItemID.circuitBasic, -1]);
	
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['x', 331, -1, 'a', 348, -1, 'b', 351, 4, '#', ItemID.circuitBasic, -1]);
	
	Recipes.addShaped({id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal)}, [
		"x#x",
		"xax",
		"x#x"
	], ['a', ItemID.storageCrystal, -1, 'x', 351, 4, '#', ItemID.circuitBasic, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
});
