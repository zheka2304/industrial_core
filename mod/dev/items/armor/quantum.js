IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "armor_quantum_helmet"}, {type: "helmet", armor: 4, durability: 1000, texture: "armor/quantum_1.png"});
Item.createArmorItem("quantumChestplate", "Quantum Chestplate", {name: "armor_quantum_chestplate"}, {type: "chestplate", armor: 8, durability: 1000, texture: "armor/quantum_1.png"});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "armor_quantum_leggings"}, {type: "leggings", armor: 6, durability: 1000, texture: "armor/quantum_2.png"});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "armor_quantum_boots"}, {type: "boots", armor: 4, durability: 1000, texture: "armor/quantum_1.png"});

ChargeItemRegistry.registerItem(ItemID.quantumHelmet, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplate, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggings, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.quantumBoots, 1000000, 1, true);

IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet (Uncharged)", {name: "armor_quantum_helmet"}, {type: "helmet", armor: 2, durability: 1000, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Chestplate (Uncharged)", {name: "armor_quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 1000, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings (Uncharged)", {name: "armor_quantum_leggings"}, {type: "leggings", armor: 3, durability: 1000, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots (Uncharged)", {name: "armor_quantum_boots"}, {type: "boots", armor: 2, durability: 1000, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.quantumHelmetUncharged, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.quantumChestplateUncharged, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.quantumLeggingsUncharged, 1000000, 1, true);
ChargeItemRegistry.registerItem(ItemID.quantumBootsUncharged, 1000000, 1, true);


MachineRecipeRegistry.registerRecipesFor("quantum-armor-charge", {
	"ItemID.quantumHelmet": {charged: ItemID.quantumHelmet, uncharged: ItemID.quantumHelmetUncharged},
	"ItemID.quantumHelmetUncharged": {charged: ItemID.quantumHelmet, uncharged: ItemID.quantumHelmetUncharged},
	"ItemID.quantumChestplate": {charged: ItemID.quantumChestplate, uncharged: ItemID.quantumChestplateUncharged},
	"ItemID.quantumChestplateUncharged": {charged: ItemID.quantumChestplate, uncharged: ItemID.quantumChestplateUncharged},
	"ItemID.quantumLeggings": {charged: ItemID.quantumLeggings, uncharged: ItemID.quantumLeggingsUncharged},
	"ItemID.quantumLeggingsUncharged": {charged: ItemID.quantumLeggings, uncharged: ItemID.quantumLeggingsUncharged},
	"ItemID.quantumBoots": {charged: ItemID.quantumBoots, uncharged: ItemID.quantumBootsUncharged},
	"ItemID.quantumBootsUncharged": {charged: ItemID.quantumBoots, uncharged: ItemID.quantumBootsUncharged},
}, true);

var quantumUIbuttons = new UI.Window({
	location: {
		x: 900,
		y: 400,
		width: 50,
		height: 150
	},
	drawing: [{type: "background", color: 0}],
	elements: {}
})

var quantumArmorMap = {
	button_jump: false,
	button_run: false,
	button_fly: false,
}

function updateQuantumUI(){
	var buttonContent = {
		button_jump: {
			y: 2000,
			type: "button",
			bitmap: "button_jump_on",
			bitmap2: "button_jump_off",
			scale: 50,
			clicker: {
				onClick: function(){
					if(Math.abs(Player.getVelocity().y + 0.078) < 0.01){
						Player.addVelocity(0, 1.4, 0);
					}
				}
			}
		},
		button_run: {
			y: 1000,
			type: "button",
			bitmap: "button_run_on",
			bitmap2: "button_run_off",
			scale: 50
		},
		button_fly: {
			y: 0,
			type: "button",
			bitmap: "button_fly_on",
			bitmap2: "button_fly_off",
			scale: 50
		}
	}
	var elements = quantumUIbuttons.content.elements;
	for(var name in quantumArmorMap){
		if(quantumArmorMap[name]){
			if (!elements[name]){
				elements[name] = buttonContent[name];
			}
			elements[name].x = 0;
		}
		else{
			elements[name] = null;
		}
	}
}

var isQuantumEquiped = false;
var quantumUIcontainer = null;

Callback.addCallback("tick", function(){
	if(isQuantumEquiped){
		updateQuantumUI();
		if(!quantumUIcontainer){
			quantumUIcontainer = new UI.Container();
			quantumUIcontainer.openAs(quantumUIbuttons);
		}
		if(quantumUIcontainer.isElementTouched("button_run")){
			Entity.addEffect(Player.get(), MobEffect.movementSpeed, 3, 5);
		}
		if(quantumUIcontainer.isElementTouched("button_fly")){
			if(Player.getPosition().y < 255){
				Player.addVelocity(0, 0.13, 0);
			}
		}
	}
	else{
		if(quantumUIcontainer){
			quantumUIcontainer.close();
			quantumUIcontainer = null;
		}
	}
	isQuantumEquiped = false;
	for(var name in quantumArmorMap){
		quantumArmorMap[name] = false;
	}
});

Callback.addCallback("LevelLeft", function(){
	if(quantumUIcontainer){
		quantumUIcontainer.close();
		quantumUIcontainer = null;
	}
});

var QUANTUM_ARMOR_FUNCS_CHARGED = {
	maxDamage: Item.getMaxDamage(ItemID.quantumHelmet),
	tick: function(slot, inventory, index){
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		isQuantumEquiped = true;
		if (slot.data > this.maxDamage - 5){
			slot.id = armor.uncharged;
			slot.data = this.maxDamage - 4;
			return true;
		}
		else if (slot.id != armor.charged){
			slot.id = armor.charged;
			return true;
		}
		switch (index){
			case 1:
			quantumArmorMap.button_fly = true;
			break;
			case 2:
			quantumArmorMap.button_run = true;
			break;
			case 3:
			quantumArmorMap.button_jump = true;
			break;
		}
		if (index == 3){
			var vel = Player.getVelocity();
			if (vel.y < - 0.226 && slot.data < this.maxDamage - 4){
				Entity.addEffect(Player.get(), MobEffect.jump, 2, 12);
				slot.data++;
				return true;
			}
		}
	}
};

Armor.registerFuncs("quantumHelmet", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumHelmetUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumChestplate", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumChestplateUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumLeggings", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumLeggingsUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumBoots", QUANTUM_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("quantumBootsUncharged", QUANTUM_ARMOR_FUNCS_CHARGED);




Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: Item.getMaxDamage(ItemID.quantumHelmet)}, [
		"x#x",
		"xax"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.carbonPlate, -1, 'a', ItemID.nanoHelmet, -1], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
		"xax",
		"x#x",
		"xxx"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.carbonPlate, -1, 'a', ItemID.nanoChestplate], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
		"x#x",
		"xax",
		"x x"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.carbonPlate, -1, 'a', ItemID.nanoLeggings], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
		"xax",
		"x#x"
	], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.carbonPlate, -1, 'a', ItemID.nanoBoots], RECIPE_FUNC_TRANSPORT_ENERGY);
});
