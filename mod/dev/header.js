/*
  ___               _                 _                    _      ____                         
 |_ _|  _ __     __| |  _   _   ___  | |_   _ __    __ _  | |    / ___|   ___    _ __    ___   
  | |  | '_ \   / _` | | | | | / __| | __| | '__|  / _` | | |   | |      / _ \  | '__|  / _ \  
  | |  | | | | | (_| | | |_| | \__ \ | |_  | |    | (_| | | |   | |___  | (_) | | |    |  __/  
 |___| |_| |_|  \__,_|  \__,_| |___/  \__| |_|     \__,_| |_|    \____|  \___/  |_|     \___|  
 
 by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/

// constants
var GUI_BAR_STANDART_SCALE = 3.2;
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
var nativeGetLightLevel = ModAPI.requireGlobal("Level.getBrightness");
var MobEffect = ModAPI.requireGlobal("MobEffect")

// square lava texture for geothermal generator ui.
LiquidRegistry.getLiquidData("lava").uiTextures.push("gui_lava_texture_16x16");


// if mod running on core engine 1.02 or less, it will make callback for undeground generation to be called with usual generation
if (getCoreAPILevel() < 3){
	Callback.addCallback("GenerateChunk", function(x, z){
		Callback.invokeCallback("GenerateChunkUnderground", x, z);
	});
	Logger.Log("Core Engine with low api level detected, ore generation will not be optimized", "WARNING");
}














