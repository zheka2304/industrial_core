function TileRenderModel(id, data){
	this.registerAsId = function(id, data){
		var block = Unlimited.API.GetReal(id, data || 0);
		this.id = block.id;
		this.data = block.data;
		this.convertedId = this.id * 16 + this.data;
		
		if (this.convertedId){
			ICRenderLib.registerTileModel(this.convertedId, this);
		}
		else{
			Logger.Log("tile model cannot be registred: block id is undefined or 0", "ERROR");
		}
	}
	
	this.cloneForId = function(id, data){
		this.registerAsId(id, data);
	}
	
	this.registerAsId(id, data);
	
	this.boxes = [];

	this.addBoxF = function(x1, y1, z1, x2, y2, z2, block){
		var M = 1.0;
		var box = [
			x1 * M, y1 * M, z1 * M,
			x2 * M, y2 * M, z2 * M,
		];

		if (block){
			block = Unlimited.API.GetReal(block.id, block.data);
			box.push(parseInt(block.id) || 0);
			box.push(parseInt(block.data) || 0)
		}
		else{
			box.push(-1);
			box.push(-1);
		}

		this.boxes.push(box);
	}
 
	this.addBox = function(x, y, z, size, block){
		var M = 1.0;
		var box = [
			x * M, y * M, z * M,
			(x + size.x) * M,
			(y + size.y) * M,
			(z + size.z) * M
		];
		
		if (block){
			block = Unlimited.API.GetReal(block.id, block.data);
			box.push(parseInt(block.id) || 0);
			box.push(parseInt(block.data) || 0)
		}
		else{
			box.push(-1);
			box.push(-1);
		}
		
		this.boxes.push(box);
	}
	
	this.connections = {};
	this.connectionGroups = [];
	this.connectionWidth = 0.5;
	this.hasConnections = false;
	
	this.setConnectionWidth = function(width){
		this.connectionWidth = width;
	}
	
	this.addConnection = function(id, data){
		var block = Unlimited.API.GetReal(id, data || 0);
		var convertedId = block.id * 16 + block.data;
		this.connections[convertedId] = true;
		this.hasConnections = true;
	}
	
	this.addConnectionGroup = function(name){
		this.connectionGroups.push(name);
		this.hasConnections = true;
	}
	
	this.addConnectionGroupFinal = function(name){
		var group = ICRenderLib.getConnectionGroup(name);
		for (var id in group){
			this.connections[id] = true;
		}
	}
	
	this.addSelfConnection = function(){
		this.connections[this.convertedId] = true;
		this.hasConnections = true;
	}
	
	
	this.writeAsId = function(id){
		var output = "";
		output += id + " " + (this.hasConnections ? 1 : 0) + "\n";
		output += this.boxes.length + "\n";
		
		for (var i in this.boxes){
			output += this.boxes[i].join(" ") + "\n";
		}
		
		var connections = "";
		var count = 0;
		
		for (var i in this.connectionGroups){
			this.addConnectionGroupFinal(this.connectionGroups[i]);
		}
		
		for (var id in this.connections){
			connections += id + " ";
			count++;
		}
		
		output += count + " " + this.connectionWidth + "\n" + connections;
		return output;
	}
}


var ICRenderLib = ModAPI.requireAPI("ICRenderLib");

if (!ICRenderLib){
	var ICRenderLib = {
		/* model registry */
		tileModels: {},
		
		registerTileModel: function(convertedId, model){
			this.tileModels[convertedId] = model;
		},
		
		/* output */
		writeAllData: function(){
			var output = "";
			var count = 0;
			for (var id in this.tileModels){
				output += this.tileModels[id].writeAsId(id) + "\n\n";
				count++;
			}
			
			output = count + "\n\n" + output;
			FileTools.WriteText("games/com.mojang/mods/icrender", output);
		},
		
		/* connection groups functions */
		connectionGroups: {},
		
		addConnectionBlockWithData: function(name, blockId, blockData){
			var group = this.connectionGroups[name];
			if (!group){
				group = {};
				this.connectionGroups[name] = group;
			}
			
			var block = Unlimited.API.GetReal(blockId, blockData);
			group[block.id * 16 + block.data] = true;
		},
		
		addConnectionBlock: function(name, blockId){
			for (var data = 0; data < 16; data++){
				this.addConnectionBlockWithData(name, blockId, data);
			}
		},
		
		addConnectionGroup: function(name, blockIds){
			for (var i in blockIds){
				this.addConnectionBlock(name, blockIds[i]);
			}
		},
		
		getConnectionGroup: function(name){
			return this.connectionGroups[name];
		},
		
		
		/* standart models */
		registerAsWire: function(id, connectionGroupName, width){
			width = width || 0.5;
			
			var model = new TileRenderModel(id, 0);
			model.addConnectionGroup(connectionGroupName);
			model.addSelfConnection();
			model.setConnectionWidth(width);
			model.addBox(.5 - width / 2.0, .5 - width / 2.0, .5 - width / 2.0, {
				x: width,
				y: width,
				z: width,
			});
			
			this.addConnectionBlock(connectionGroupName, id);
		}
	};
	
	
	ModAPI.registerAPI("ICRenderLib", ICRenderLib);
	Callback.addCallback("PostLoaded", function(){
		ICRenderLib.writeAllData();
	});
	Logger.Log("ICRender API was created and shared by " + __name__ + " with name ICRenderLib", "API");
}




/*

// exampe of block model

Block.setPrototype("testRender", {
	getVariations: function(){
		return [
			{name: "pillar", texture: [["cobblestone", 0]], inCreative: true}
		]
	}
});

var pillarRender = new TileRenderModel(BlockID.testRender);

for(var i = 0; i < 4; i++){
	pillarRender.addBoxF(i / 16, i / 16, i / 16, 1.0 - i / 16, (i + 1) / 16, 1.0 - i / 16);
	pillarRender.addBoxF(i / 16, 1.0 - (i + 1) / 16, i / 16, 1.0 - i / 16, 1.0 - i / 16, 1.0 - i / 16);
}

pillarRender.addBoxF(0.25, 0.0, 0.25, 0.75, 1.0, 0.75, {id: 5, data: 2});

*/