/*
  ___               _                 _                    _      ____                         
 |_ _|  _ __     __| |  _   _   ___  | |_   _ __    __ _  | |    / ___|   ___    _ __    ___   
  | |  | '_ \   / _` | | | | | / __| | __| | '__|  / _` | | |   | |      / _ \  | '__|  / _ \  
  | |  | | | | | (_| | | |_| | \__ \ | |_  | |    | (_| | | |   | |___  | (_) | | |    |  __/  
 |___| |_| |_|  \__,_|  \__,_| |___/  \__| |_|     \__,_| |_|    \____|  \___/  |_|     \___|  
 
 by zheka_smirnov (vk.com/zheka_smirnov) and MineExplorer (vk.com/vlad.gr2027)

 This code is a copyright, do not distribute.
*/

// constants
var GUI_BAR_STANDART_SCALE = 3.2;

var FURNACE_FUEL_MAP = {
	5: 300,
	6: 100,
	17: 300,
	25: 300,
	47: 300,
	53: 300,
	54: 300,
	58: 300,
	65: 300,
	72: 300,
	85: 300,
	96: 300,
	107: 300,
	134: 300,
	135: 300,
	136: 300,
	146: 300,
	151: 300,
	158: 150,
	162: 300,
	163: 300,
	164: 300,
	173: 16000,
	183: 300,
	184: 300,
	185: 300,
	186: 300,
	187: 300,
	261: 200,
	263: 1600,
	268: 200,
	269: 200,
	270: 200,
	271: 200,
	280: 100,
	281: 200,
	290: 200,
	232: 200,
	333: 1200,
	346: 200,
	369: 2400,
	427: 300,
	428: 300,
	429: 300,
	430: 300,
	431: 300
};



// import native methods & values, that work faster
var nativeGetTile = ModAPI.requireGlobal("getTile_origin");
var nativeGetLightLevel = ModAPI.requireGlobal("Level.getBrightness");
var nativeAddShapelessRecipe = ModAPI.requireGlobal("Item.addCraftRecipe");
var MobEffect = Native.PotionEffect;
var Enchantment = Native.Enchantment;
var BlockSide = Native.BlockSide;
var EntityType = Native.EntityType;
Player.addItemCreativeInv = ModAPI.requireGlobal("Player.addItemCreativeInv");
Player.getArmorSlotID = ModAPI.requireGlobal("Player.getArmorSlot");
Player.getArmorSlotDamage = ModAPI.requireGlobal("Player.getArmorSlotDamage");
Player.setArmorSlot = ModAPI.requireGlobal("Player.setArmorSlot");
Player.getSelectedSlotId = ModAPI.requireGlobal("Player.getSelectedSlotId");
Player.enchant = ModAPI.requireGlobal("Player.enchant");

// square lava texture for geothermal generator ui.
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_16x16");

importLib("ToolType", "*");
importLib("energylib", "*");

var player;
Callback.addCallback("LevelLoaded", function(){
	player = Player.get();
});

function random(min, max){
	return Math.floor(Math.random()*(max-min+1))+min
}

Item.setElectricItem = function(id, name, texture){
	Item.createItem(id, name, texture, {isTech: true, stack: 1});
	Player.addItemCreativeInv(ItemID[id], 1, 1);
}
addShapelessRecipe = function(result, ingredients){
	var nativeIngredients = [];
	var CEIngredients = [];
	for(var i in ingredients){
		var item = ingredients[i];
		nativeIngredients.push(item.id, item.count, item.data);
		for(var n = 0; n < item.count; n++){
			CEIngredients.push(item);
		}
	}
	nativeAddShapelessRecipe(result.id, result.count, result.data, nativeIngredients);
	Recipes.addShapeless(result, CEIngredients);
}
Player.getArmorSlot = function(n){
	return {id: Player.getArmorSlotID(n), data: Player.getArmorSlotDamage(n)};
}

// energy (Eu)
var EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// Core Engine bugs fix
Recipes.addFurnace(19, 19, 1, "iron");
Recipes.addFurnace(81, 351, 2, "iron");
Recipes.addFurnace(82, 172, 0, "iron");
Recipes.addFurnace(162, 263, 1, "iron");
Recipes.addFurnace(411, 412, 0, "iron");
Recipes.addFurnace(423, 424, 0, "iron");
