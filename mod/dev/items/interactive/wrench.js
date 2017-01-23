IDRegistry.genItemID("wrench"); 
Item.createItem("wrench", "wrench", {
	name: "wrench", 
	meta: 0
	},{
	isTech:false,
	stack:1
	});

 Item.registerUseFunction("wrench", function(coords, item, block){
	if (MachineRegistry.isMachine(block.id)){
		World.setBlock(coords.x, coords.y, coords.z, block.id, block.data == coords.side - 2 ? coords.side : block.data);
		Player.setCarriedItem(item.id, ++item.data < 250 ? item.count : 0, item.data);
		var machine = World.getTileEntity(coords.x, coords.y, coords.z)
		var desc = machine.wrenchDescriptions
		for (var type in desc){
		Game.message(desc[type].description + ': ' + desc[type].value.call(machine))
		}
		ToolsModule.CEDumpCreate()
	}
});

Recipes.addShaped({id: "wrench", count: 1, data: 0}, [
	"x x",
	"xxx",
	" x "
], ['x', ItemID.plateBronse, -1]);