var ICRenderLib = ModAPI.requireAPI("ICRenderLib");

if (!ICRenderLib){
	ICRenderLib = {
		wireTiles: {},
		connectorTiles: {},
		
		addTileToArray: function(array, id, data){
			var real = Unlimited.API.GetReal(id, data);
			array[real.id * 16 + real.data] = true;
		},
		
		addAllDatasToArray: function(array, id){
			for (var data = 0; data < 16; data++){
				this.addTileToArray(array, id, data);
			}
		},
		
		registerAsWire: function(id){
			this.addAllDatasToArray(this.wireTiles, id);
		},
		
		registerAsConnector: function(id){
			this.addAllDatasToArray(this.connectorTiles, id);
		},
		
		writeData: function(){
			var wires = [];
			for (var id in this.wireTiles){
				wires.push(parseInt(id));
			}
			var connectors = [];
			for (var id in this.connectorTiles){
				connectors.push(parseInt(id));
			}
			var filecontent = wires.length + "\n" + wires.join(" ") + "\n" + connectors.length + "\n" + connectors.join(" ");
			FileTools.WriteText("games/com.mojang/mods/icrender", filecontent);
		}
	};
	
	ModAPI.registerAPI("ICRenderLib", ICRenderLib);
	Callback.addCallback("PostLoaded", function(){
		ICRenderLib.writeData();
	});
	Logger.Log("ICRender API was created and shared by " + __name__ + " with name ICRenderLib", "API");
}