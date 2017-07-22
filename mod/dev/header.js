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
var TILE_RENDERER_CONNECTION_GROUP = "ic-wire";

var FURNACE_FUEL_MAP = {
	5: 300,
	6: 100,
	17: 300,
	263: 1600,
	280: 100,
	268: 200,
	269: 200,
	270: 200,
	271: 200,
	85: 300,
	107: 300,
	134: 300,
	135: 300,
	158: 150,
	162: 300,
	163: 300,
	164: 300,
	184: 300,
	185: 300,
	186: 300,
	187: 300,
	53: 300,
	54: 300,
	58: 300
};



// import native methods & values, that work faster
var nativeGetTile = ModAPI.requireGlobal("getTile_origin");
var nativeSetDestroyTime = ModAPI.requireGlobal("Block.setDestroyTime");
var nativeGetLightLevel = ModAPI.requireGlobal("Level.getBrightness");
var nativeAddShapelessRecipe = ModAPI.requireGlobal("Item.addCraftRecipe");
var MobEffect = Native.PotionEffect;
Player.addItemCreativeInv = ModAPI.requireGlobal("Player.addItemCreativeInv");
Player.getArmorSlotID = ModAPI.requireGlobal("Player.getArmorSlot");
Player.getArmorSlotDamage = ModAPI.requireGlobal("Player.getArmorSlotDamage");
Player.setArmorSlot = ModAPI.requireGlobal("Player.setArmorSlot");

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

// Core Engine bug fix
Recipes.addFurnace(162, 263, 1);