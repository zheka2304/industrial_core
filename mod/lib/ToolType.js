var ToolType = {
	sword: {
		isWeapon: true,
		damage: 4,
		blockTypes: ["fibre", "corweb"],
		enchantType: Native.EnchantType.weapon
	},
	
	shovel: {
		enchantType: Native.EnchantType.shovel,
		damage: 2,
		blockTypes: ["dirt"],
		useItem: function(coords, item, block){
			if(block.id==2&&coords.side==1){ 
				World.setBlock(coords.x, coords.y, coords.z, 198);
				World.playSoundAtEntity(player, "step.grass", 0.5, 0.75);
				ToolAPI.breakCarriedTool(1);
			}
		}
	},
	
	pickaxe: {
		enchantType: Native.EnchantType.pickaxe,
		damage: 2,
		blockTypes: ["stone"]
	},
	
	axe: {
		enchantType: Native.EnchantType.axe,
		damage: 3,
		blockTypes: ["wood"]
	},
	
	hoe: {
		useItem: function(coords, item, block){
			if((block.id==2 || block.id==3) && coords.side==1){ 
				World.setBlock(coords.x, coords.y, coords.z, 60);
				World.playSoundAtEntity(player, "step.grass", 0.5, 0.75);
				ToolAPI.breakCarriedTool(1);
			}
		}
	}
}

ToolAPI.breakCarriedTool = function(damage){
	var carried = Player.getCarriedItem(true);
	carried.data += damage;
	if(carried.data > Item.getMaxDamage()){
		carried.id = 0;
	}
	Player.setCarriedItem(carried.id, carried.count, carried.data, carried.enchant);
}

ToolAPI.setTool = function(itemID, toolProperties, toolType){
	if(toolType.blockTypes){
		ToolAPI.registerTool(itemID, toolProperties, toolType.blockTypes, toolType);
	}
	if(toolType.useItem){
		Item.registerUseFunctionForID(itemID, toolType.useItem);
	}
	if(toolType.enchantType){
		Item.setEnchantType(itemID, toolType.enchantType, toolProperties.enchantability);
	}
}

registerAPIUnit("ToolType", ToolType);