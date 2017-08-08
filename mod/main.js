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


﻿// BLOCKS
Translation.addTranslation("Machine Block", {ru: "Машинный блок", es: "Máquina", zh: "基础机械外壳"});
Translation.addTranslation("Advanced Machine Block", {ru: "Улучшенный машинный блок", es: "Máquina Avanzada", zh: "基础机械外壳"});
Translation.addTranslation("Copper Ore", {ru: "Медная руда", es: "Mineral de Cobre", zh: "铜矿石"});
Translation.addTranslation("Tin Ore", {ru: "Оловянная руда", es: "Mineral de Estaño", zh: "锡矿石"});
Translation.addTranslation("Lead Ore", {ru: "Свинцовая руда", es: "Mineral de Plomo", zh: "铅矿石"});
Translation.addTranslation("Uranium Ore", {ru: "Урановая руда", es: "Mineral de Uranium", zh: "铀矿石"});
Translation.addTranslation("Copper Block", {ru: "Медный блок", es: "Bloque de Cobre", zh: "铜块"});
Translation.addTranslation("Tin Block", {ru: "Оловянный блок", es: "Bloque de Estaño", zh: "锡矿石"});
Translation.addTranslation("Bronze Block", {ru: "Бронзовый блок", es: "Bloque de Bronce", zh: "青铜块"});
Translation.addTranslation("Lead Block", {ru: "Свинцовый блок", es: "Bloque de Plomo", zh: "铅块"});
Translation.addTranslation("Steel Block", {ru: "Стальной блок", es: "Bloque de Hierro Refinado", zh: "钢块"});
Translation.addTranslation("Reinforced Stone", {ru: "Укреплённый камень", es: "Piedra Reforzada", zh: "防爆石"});
Translation.addTranslation("Reinforced Glass", {ru: "Укреплённое стекло", es: "Cristal Reforzado", zh: "防爆玻璃"});
Translation.addTranslation("Rubber Tree Log", {ru: "Древесина гевеи", es: "Madera de Árbol de Caucho", zh: "橡胶树原木"});
Translation.addTranslation("Rubber Tree Leaves", {ru: "Листва гевеи", es: "Hojas de Arbol de Cáucho", zh: "橡胶树树叶"});
Translation.addTranslation("Rubber Tree Sapling", {ru: "Саженец гевеи", es: "Pimpollo de Árbol de Caucho", zh: "橡胶树树苗"});

// Generators
Translation.addTranslation("Generator", {ru: "Генератор", es: "Generador", zh: "火力发电机"});
Translation.addTranslation("Geothermal Generator", {ru: "Геотермальный генератор", es: "Generador Geotérmico", zh: "地热发电机"});
Translation.addTranslation("Solar Panel", {ru: "Солнечная панель", es: "Panel Solar", zh: "太阳能发电机"});
Translation.addTranslation("Water Mill", {ru: "Гидрогенератор", es: "Molino de Agua", zh: "水力发电机"});
Translation.addTranslation("Wind Mill", {ru: "Ветрогенератор", es: "Molino de Viento", zh: "风力发电机"});

// Machines
Translation.addTranslation("Iron Furnace", {ru: "Железная печь", es: "Horno de Hierro", zh: "铁炉"});
Translation.addTranslation("Electric Furnace", {ru: "Электрическая печь", es: "Horno Eléctrico", zh: "感应炉"});
Translation.addTranslation("Induction Furnace", {ru: "Индукционная печь", es: "Horno de Induccion", zh: "感应炉"});
Translation.addTranslation("Macerator", {ru: "Дробитель", es: "Trituradora", zh: "打粉机"});
Translation.addTranslation("Compressor", {ru: "Компрессор", es: "Compresor", zh: "压缩机"});
Translation.addTranslation("Recycler", {ru: "Утилизатор", es: "Reciclador", zh: "回收机"});
Translation.addTranslation("Extractor", {ru: "Экстрактор", es: "Extractor", zh: "提取机"});
Translation.addTranslation("Metal Former", {ru: "Металлоформовщик", es: "Arqueador de Metal", zh: "Arqueador de Metal"});
Translation.addTranslation("Mass Fabricator", {ru: "Генератор материи", es: "Materializador", zh: "物质生成机"});

// Energy storage
Translation.addTranslation("BatBox", {ru: "Энергохранилище", es: "Caja de Baterías", zh: "储电盒"});
Translation.addTranslation("MFE", {ru: "МФЕ", es: "Unidad MFE", zh: "充电座(MFE)"});
Translation.addTranslation("MFSU", {ru: "МФСУ", es: "Unidad MFSU", zh: "充电座(MFSU)"});


// ITEMS
Translation.addTranslation("Uranium", {ru: "Уран", es: "Bloque de Uranio", zh: "铀"});
Translation.addTranslation("Iridium", {ru: "Иридий", es: "Mineral de Iridio", zh: "铱碎片"});
Translation.addTranslation("Latex", {ru: "Латекс", es: "Caucho", zh: "胶乳"});
Translation.addTranslation("Rubber", {ru: "Резина", es: "Rubber", zh: "橡胶"});
Translation.addTranslation("Scrap", {ru: "Утильсырьё", es: "Chatarra", zh: "废料"});
Translation.addTranslation("Scrap Box", {ru: "Коробка утильсырья", es: "Caja de Chatarra", zh: "废料盒"});
Translation.addTranslation("UU-Matter", {ru: "Материя", es: "Materia", zh: "物质"});
Translation.addTranslation("Coal Ball", {ru: "Угольный шарик", es: "Bola de Carbón", zh: "煤球"});
Translation.addTranslation("Coal Block", {ru: "Сжатый угольный шарик", es: "Bola de Carbón Compactada", zh: "压缩煤球"});
Translation.addTranslation("Coal Chunk", {ru: "Угольная глыба", es: "Carbono Bruto", zh: "煤块"});
Translation.addTranslation("Carbon Fibre", {ru: "Углеволокно", es: "Fibra de Carbono Básica", zh: "粗制碳网"});
Translation.addTranslation("Carbon Mesh", {ru: "Углеткань", es: "Malla de Carbono Básica", zh: "粗制碳板"});
Translation.addTranslation("Carbon Plate", {ru: "Углепластик", es: "Placa de Carbono", zh: "碳板"});
Translation.addTranslation("Alloy Plate", {ru: "Композит", es: "Compuesto Avanzado", zh: "高级合金"});
Translation.addTranslation("Iridium Reinforced Plate", {ru: "Иридиевый композит", es: "Placa de Iridio", zh: "强化铱板"});
Translation.addTranslation("Tool Box", {ru: "Ящик для инструментов", es: "Caja de Herramientas", zh: "工具盒"});

// Electric
Translation.addTranslation("Circuit", {ru: "Электросхема", es: "Circuito Electrónico", zh: "电路板"});
Translation.addTranslation("Advanced Circuit", {ru: "Улучшенная электросхема", es: "Circuito Avanzado", zh: "高级电路板"});
Translation.addTranslation("Coil", {ru: "Катушка", es: "Bobina", zh: "线圈"});
Translation.addTranslation("Electric Motor", {ru: "Электромотор", es: "Motor Eléctrico", zh: "电动马达"});
Translation.addTranslation("Power Unit", {ru: "Силовой агрегат", es: "Unidad de Potencia", zh: "驱动把手"});
Translation.addTranslation("Small Power Unit", {ru: "Малый силовой агрегат", es: "Pequeña Unidad de Potencia", zh: "小型驱动把手"});
Translation.addTranslation("Battery", {ru: "Аккумулятор", es: "Batería Recargable", zh: "充电电池"});
Translation.addTranslation("Energy Crystal", {ru: "Энергетический кристалл", es: "Cristal de Energía", zh: "能量水晶"});
Translation.addTranslation("Lapotron Crystal", {ru: "Лазуротроновый кристалл", es: "Cristal Lapotron", zh: "兰波顿水晶"});

// Upgrades
Translation.addTranslation("Overclocker Upgrade", {ru: "Улучшение «Ускоритель»", es: "Mejora de Sobreproducción", zh: "超频升级"});
Translation.addTranslation("Energy Storage Upgrade", {ru: "Улучшение «Энергохранитель»", es: "Mejora de Almacenador de Energía", zh: "储能升级"});
Translation.addTranslation("Redstone Signal Inverter Upgrade", {ru: "Улучшение «Инвертор сигнала красного камня»", es: "Majora de Invesor de señal Redstone", zh: "红石信号反转升级"});
Translation.addTranslation("Ejector Upgrade", {ru: "Улучшение «Выталкиватель»", es: "Mejora Expulsora", zh: "弹出升级"});
Translation.addTranslation("Fluid Ejector Upgrade", {ru: "Улучшение «Выталкиватель жидкости»", es: "Mejora Expulsora de Líquidos", zh: "流体弹出升级"});
Translation.addTranslation("Pulling Upgrade", {ru: "Улучшение «Загрузчик»", zh: "抽入升级"});

// Dusts
Translation.addTranslation("Copper Dust", {ru: "Медная пыль", es: "Polvo de Cobre", zh: "铜粉"});
Translation.addTranslation("Tin Dust", {ru: "Оловянная пыль", es: "Polvo de Estaño", zh: "锡粉"});
Translation.addTranslation("Iron Dust", {ru: "Железная пыль", es: "Polvo de Hierro", zh: "铁粉"});
Translation.addTranslation("Bronze Dust", {ru: "Бронзовая пыль", es: "Polvo de Bronce", zh: "青铜粉"});
Translation.addTranslation("Coal Dust", {ru: "Угольная пыль", es: "Polvo de Carbón", zh: "煤粉"});
Translation.addTranslation("Gold Dust", {ru: "Золотая пыль", es: "Polvo de Oro", zh: "金粉"});
Translation.addTranslation("Lapis Dust", {ru: "Лазуритовая пыль", es: "Polvo de Lapislázuli", zh: "青金石粉"});
Translation.addTranslation("Lead Dust", {ru: "Свинцовая пыль", es: "Polvo de Plomo", zh: "铅粉"});
//Translation.addTranslation("Silver Dust", {ru: "Серебрянная пыль", es: "Polvo de Plata", zh: "银粉"});
//Translation.addTranslation("Stone Dust", {ru: "Каменная пыль", es: "Polvo de Piedra", zh: "石粉"});
//Translation.addTranslation("Sulfur Dust", {ru: "Серная пыль", es: "Polvo de Sulfuro", zh: "硫粉"});
Translation.addTranslation("Diamond Dust", {ru: "Алмазная пыль", es: "Polvo de Diamante", zh: "钻石粉"});
Translation.addTranslation("Energium Dust", {ru: "Энергетическая пыль", es: "Polvo de Energium", zh: "能量水晶粉"});

// Small Dusts
/*
Translation.addTranslation("Small Copper Dust", {ru: "Небольшая кучка медной пыли", es: "Diminuta Pila de Polvo de Cobre", zh: "小撮铜粉"});
Translation.addTranslation("Small Tin Dust", {ru: "Небольшая кучка оловянной пыли", es: "Diminuta Pila de Polvo de Estaño", zh: "小撮锡粉"});
Translation.addTranslation("Small Iron Dust", {ru: "Небольшая кучка железной пыли", es: "Diminuta Pila de Polvo de Hierro", zh: "小撮铁粉"});
Translation.addTranslation("Small Bronze Dust", {ru: "Небольшая кучка бронзовой пыли", es: "Diminuta Pila de Polvo de Bronce", zh: "小撮青铜粉"});
Translation.addTranslation("Small Gold Dust", {ru: "Небольшая кучка золотой пыли", es: "Diminuta Pila de Polvo de Oro", zh: "小撮金粉"});
Translation.addTranslation("Small Lapis Dust", {ru: "Небольшая кучка лазуритовой пыли", es: "Diminuta Pila de Polvo de Lapislázuli", zh: "小撮青金石粉"});
Translation.addTranslation("Small Lead Dust", {ru: "Небольшая кучка свинцовой пыли", es: "Diminuta Pila de Polvo de Plomo", zh: "小撮铅粉"});
Translation.addTranslation("Small Silver Dust", {ru: "Небольшая кучка серебрянной пыли", es: "Diminuta Pila de Polvo de Plata", zh: "小撮银粉"});
Translation.addTranslation("Small Sulfur Dust", {ru: "Небольшая кучка серной пыли", es: "Diminuta Pila de Polvo de Sulfuro", zh: "小撮硫粉"});
*/

// Ingots
Translation.addTranslation("Copper Ingot", {ru: "Медный слиток", es: "Lingote de Cobre", zh: "铜锭"});
Translation.addTranslation("Tin Ingot", {ru: "Оловянный слиток", es: "Lingote de Estaño", zh: "锡锭"});
Translation.addTranslation("Bronze Ingot", {ru: "Бронзовый слиток", es: "Lingote de Bronce", zh: "青铜锭"});
Translation.addTranslation("Steel Ingot", {ru: "Стальной слиток", es: "Lingote de Hierro Refinado", zh: "钢锭"});
Translation.addTranslation("Lead Ingot", {ru: "Свинцовый слиток", es: "Lingote de Plomo", zh: "铅锭"});
//Translation.addTranslation("Silver Ingot", {ru: "Серебрянный слиток", es: "Lingote de Plata", zh: "银锭"});
Translation.addTranslation("Alloy Ingot", {ru: "Композитный слиток", es: "Lingote de Metal Compuesto", zh: "合金锭"})

// Plates
Translation.addTranslation("Copper Plate", {ru: "Медная пластина", es: "Placa de Cobre", zh: "铜板"});
Translation.addTranslation("Tin Plate", {ru: "Оловянная пластина", es: "Placa de Estaño", zh: "锡板"});
Translation.addTranslation("Iron Plate", {ru: "Железная пластина", es: "Placa de Hierro", zh: "铁板"});
Translation.addTranslation("Bronze Plate", {ru: "Бронзовая пластина", es: "Placa de Bronce", zh: "青铜板"});
Translation.addTranslation("Steel Plate", {ru: "Стальная пластина", es: "Placa de Hierro Refinado", zh: "钢板"});
Translation.addTranslation("Gold Plate", {ru: "Золотая пластина", es: "Placa de Oro", zh: "金板"});
Translation.addTranslation("Lapis Plate", {ru: "Лазуритовая пластина", es: "Placa de Lapislázuli", zh: "青金石板"});
Translation.addTranslation("Lead Plate", {ru: "Свинцовая пластина", es: "Placa de Plomo", zh: "铅板"});

// Casings
Translation.addTranslation("Copper Casing", {ru: "Медная оболочка", es: "Carcasa para Objetos de Cobre", zh: "铜质外壳"});
Translation.addTranslation("Tin Casing", {ru: "Оловянная оболочка", es: "Carcasa para Objetos de Estaño", zh: "锡质外壳"});
Translation.addTranslation("Iron Casing", {es: "Carcasa para Objetos de Hierro", zh: "铁质外壳"});
Translation.addTranslation("Bronze Casing", {ru: "Бронзовая оболочка", es: "Carcasa para Objetos de Bronce", zh: "青铜外壳"});
Translation.addTranslation("Steel Casing", {ru: "Стальная оболочка", es: "Carcasa para Objetos de Hierro", zh: "钢质外壳а"});
Translation.addTranslation("Gold Casing", {ru: "Золотая оболочка", es: "Carcasa para Objetos de Oro", zh: "黄金外壳"});
Translation.addTranslation("Lead Casing", {ru: "Свинцовая оболочка", es: "Carcasa para Objetos de Plomo", zh: "铅质外壳"});

// Cells
Translation.addTranslation("Cell", {ru: "Капсула", es: "Celda Vacía", zh: "空单元"});
Translation.addTranslation("Water Cell", {ru: "Капсула с водой", es: "Celda de Agua", zh: "水单元"});
Translation.addTranslation("Lava Cell", {ru: "Капсула с лавой", es: "Celda de Lava", zh: "岩浆单元"});

// Wires
Translation.addTranslation("Tin Wire", {ru: "Оловянный провод", es: "Cable de Ultra-Baja Tensión", zh: "锡质导线"});
Translation.addTranslation("Insulated Tin Wire", {ru: "Изолированный оловянный провод", es: "Cable de Estaño Aislado", zh: "绝缘锡质导线"});
Translation.addTranslation("Copper Wire", {ru: "Медный провод", es: "Cable de Cobre", zh: "铜质导线"});
Translation.addTranslation("Insulated Copper Wire", {ru: "Изолированный медный провод", es: "Cable de Cobre Aislado", zh: "绝缘质铜导线"});
Translation.addTranslation("Gold Cable", {ru: "Золотой провод", es: "Cable de Oro", zh: "金质导线"});
Translation.addTranslation("Gold Cable (insulated x2)", {ru: "Золотой провод с двойной изоляцией", es: "Cable de Oro Aislado x2", zh: "2x绝缘金质导线"});
Translation.addTranslation("HV Cable", {ru: "Высоковольтный провод", es: "Cable de Alta Tensión", zh: "高压导线"});
Translation.addTranslation("HV Cable (insulated x3)", {ru: "Высоковольтный провод с тройной изоляцией", es: "Cable de Alta Tensión Aislado x3", zh: "3x绝缘高压导线"});
Translation.addTranslation("Glass Fibre Cable", {ru: "Стекловолоконный провод", es: "Cable de Alta Tensión", zh: "玻璃纤维导线"});

// Armor
Translation.addTranslation("Bronze Helmet", {ru: "Бронзовый шлем", es: "Casco de Bronce", zh: "青铜头盔"});
Translation.addTranslation("Bronze Chestplate", {ru: "Бронзовый нагрудник", es: "Chaleco de Bronce", zh: "青铜胸甲"});
Translation.addTranslation("Bronze Leggings", {ru: "Бронзовые поножи", es: "Pantalones de Bronce", zh: "青铜护腿"});
Translation.addTranslation("Bronze Boots", {ru: "Бронзовые ботинки", es: "Botas de Bronce", zh: "青铜靴子"});
Translation.addTranslation("Composite Helmet", {ru: "Композитный шлем", es: "Casco de Compuesto", zh: "复合头盔"});
Translation.addTranslation("Composite Chestplate", {ru: "Композитный нагрудник", es: "Chaleco de Compuesto", zh: "复合胸甲"});
Translation.addTranslation("Composite Leggings", {ru: "Композитные поножи", es: "Pantalones de Compuesto", zh: "复合护腿"});
Translation.addTranslation("Composite Boots", {ru: "Композитные ботинки", es: "Botas de Compuesto", zh: "复合靴子"});
Translation.addTranslation("Nightvision Goggles", {ru: "Прибор ночного зрения", es: "Gafas de Vision Nocturna", zh: "夜视镜"});
Translation.addTranslation("Nano Helmet", {ru: "Нано-шлем", es: "Casco de Nanotraje", zh: "纳米头盔"});
Translation.addTranslation("Nano Chestplate", {ru: "Нано-нагрудник", es: "Chaleco de Nanotraje", zh: "纳米胸甲"});
Translation.addTranslation("Nano Leggings", {ru: "Нано-штаны", es: "Pantalones de Nanotraje", zh: "纳米护腿"});
Translation.addTranslation("Nano Boots", {ru: "Нано-ботинки", es: "Botas de Nanotraje", zh: "纳米靴子"});
Translation.addTranslation("Quantum Helmet", {ru: "Квантовый шлем", es: "Casco de Traje Cuántico", zh: "量子头盔"});
Translation.addTranslation("Quantum Chestplate", {ru: "Квантовый нагрудник", es: "Chaleco de Traje Cuántico", zh: "量子护甲"});
Translation.addTranslation("Quantum Leggings", {ru: "Квантовые штаны", es: "Pantalones de Traje Cuántico", zh: "量子护腿"});
Translation.addTranslation("Quantum Boots", {ru: "Квантовые ботинки", es: "Botas de Traje Cuántico", zh: "量子靴子"});
Translation.addTranslation("Jetpack", {ru: "Реактивный ранец", es: "Jetpack Eléctrico", zh: "电力喷气背包"});
Translation.addTranslation("Batpack", {ru: "Аккумуляторный ранец", es: "Mochila de Baterías", zh: "电池背包"});
Translation.addTranslation("Lappack", {ru: "Лазуротроновый ранец", es: "Mochila de Baterías Avanzada", zh: "兰波顿储电背包"});

// Tools
Translation.addTranslation("Treetap", {ru: "Краник", es: "Grifo para Resina", zh: "木龙头"});
Translation.addTranslation("Forge Hammer", {ru: "Кузнечный молот", es: "Martillo para Forja", zh: "锻造锤"});
Translation.addTranslation("Cutter", {ru: "Кусачки", es: "Pelacables Universal", zh: "板材切割剪刀"});
Translation.addTranslation("Bronze Sword", {ru: "Бронзовый меч", es: "Espada de Bronce", zh: "青铜剑"});
Translation.addTranslation("Bronze Shovel", {ru: "Бронзовая лопата", es: "Pala de Bronce", zh: "青铜铲"});
Translation.addTranslation("Bronze Pickaxe", {ru: "Бронзовая кирка", es: "Pico de Bronce", zh: "青铜镐"});
Translation.addTranslation("Bronze Axe", {ru: "Бронзовый топор", es: "Hacha de Bronce", zh: "青铜斧"});
Translation.addTranslation("Bronze Hoe", {ru: "Бронзовая мотыга", es: "Azada de Bronce", zh: "青铜锄"});
Translation.addTranslation("Wrench", {ru: "Гаечный ключ", es: "Llave Inglesa", zh: "扳手"});
Translation.addTranslation("Electric Wrench", {ru: "Электроключ", es: "Llave Inglesa Eléctrica", zh: "电动扳手"});
Translation.addTranslation("Electric Hoe", {ru: "Электромотыга", es: "Azada Eléctrica", zh: "电动锄"});
Translation.addTranslation("Electric Treetap", {ru: "Электрокраник", es: "Grifo para Resina Eléctrico", zh: "电动树脂提取器"});
Translation.addTranslation("Drill", {ru: "Шахтёрский бур", es: "Taladro", zh: "采矿钻头"});
Translation.addTranslation("Diamond Drill", {ru: "Алмазный бур", es: "Taladro de Diamante", zh: "钻石钻头"});
Translation.addTranslation("Iridium Drill", {ru: "Иридиевый бур", es: "Taladro de Iridio", zh: "铱钻头"});
Translation.addTranslation("Chainsaw", {ru: "Электропила", es: "Motosierra", zh: "链锯"});
Translation.addTranslation("Nano Saber", {ru: "Нано-сабля", es: "Nano-Sable", zh: "纳米剑"});


var MachineRegistry = {
	machineIDs: {},
	
	isMachine: function(id){
		return this.machineIDs[id];
	},
	
	getMachineDrop(coords, blockID, standartDrop){
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrench){
			ToolAPI.breakCarriedTool(10);
			World.setBlock(coords.x, coords.y, coords.z, 0);
			if(Math.random() < 0.8){return [[blockID, 1, 0]];}
			return [[standartDrop, 1, 0]];
		}
		if(item.id==ItemID.electricWrench && item.data < 200){
			Player.setCarriedItem(item.id, 1, Math.min(item.data+10, 200));
			World.setBlock(coords.x, coords.y, coords.z, 0);
			return [[blockID, 1, 0]];
		}
		return [[standartDrop, 1, 0]];
	},
	
	registerPrototype: function(id, Prototype){
		// register render
		ICRenderLib.addConnectionBlock("ic-wire", id);
		// register ID
		this.machineIDs[id] = true;
		// setup energy value
		if (Prototype.defaultValues){
			Prototype.defaultValues.energy = 0;
		}
		else{
			Prototype.defaultValues = {
				energy: 0
			};
		}
		// copy functions
		if(!Prototype.getEnergyStorage){
			Prototype.getEnergyStorage = function(){
				return 0;
			};
		}
		/*
		Prototype.click = function(id, count, data, coords){
			if(id==ItemID.wrench || id==ItemID.electricWrench){
				return true;
			}
		}
		*/
		
		ToolAPI.registerBlockMaterial(id, "stone");
		TileEntity.registerPrototype(id, Prototype);
		EnergyTileRegistry.addEnergyTypeForId(id, EU);
	},
	
	// standart functions
	basicEnergyReceiveFunc: function(type, src){
		var energyNeed = this.getEnergyStorage() - this.data.energy;
		this.data.energy += src.getAll(energyNeed);
	}
}


var MachineRecipeRegistry = {
	recipeData: {},
	
	registerRecipesFor: function(name, data, validateKeys){
		if (validateKeys){
			var newData = {};
			for (var key in data){
				newData[eval(key)] = data[key];
			}
			data = newData;
		}
		this.recipeData[name] = data;
	},
	
	addRecipeFor: function(name, source, result){
		this.requireRecipesFor(name, true)[source] = result;
	},
	
	requireRecipesFor: function(name, createIfNotFound){
		if (!this.recipeData[name] && createIfNotFound){
			this.recipeData[name] = {};
		}
		return this.recipeData[name];
	},
	
	getRecipeResult: function(name, sourceKey){
		var data = this.requireRecipesFor(name);
		if (data){
			return data[sourceKey];
		}
	}
}


var UpgradeAPI = {
	_elements: {},

	registerUpgrade: function(id, upgrade){
		UpgradeAPI._elements[id] = upgrade;
	},

	executeUpgrade: function(item, machine, container, data, coords){
		if(UpgradeAPI._elements[item.id]){
			UpgradeAPI._elements[item.id](item.count, machine, container, data, coords);
		}
	},

	executeAll: function(machine){
		var container = machine.container;
		var data = machine.data;
		var coords = {x: machine.x, y: machine.y, z: machine.z};
		
		var upgrades = {};
		for(var slotName in container.slots){
			if(slotName.match(/Upgrade/)){
				var slot = container.getSlot(slotName);
				if(!upgrades[slot.id]){upgrades[slot.id] = slot.count;}
				else{upgrades[slot.id] += slot.count;}
			}
		}
		for(var upgrade in upgrades){
			UpgradeAPI.executeUpgrade({id: upgrade, count: upgrades[upgrade]}, machine, container, data, coords);
		}
		return upgrades;
	},
	
	findNearestContainers: function(coords, direction){
		var directions = {
			up: {x: 0, y: 1, z: 0},
			down: {x: 0, y: -1, z: 0},
			east: {x: 1, y: 0, z: 0},
			west: {x: -1, y: 0, z: 0},
			south: {x: 0, y: 0, z: 1},
			north: {x: 0, y: 0, z: -1},
		}
		var containers = [];
		if(direction){
			dir = directions[direction]
			var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
			if(container){containers.push(container);}
		}
		else{
			for(var i in directions){
				var dir = directions[i];
				var container = World.getContainer(coords.x + dir.x, coords.y + dir.y, coords.z + dir.z);
				if(container){containers.push(container);}
			}
		}
		return containers;
	}
}


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
	this.dynamic = [];

	this.formatBox = function(x1, y1, z1, x2, y2, z2, block){
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

		return box;
	}

	this.addBoxF = function(x1, y1, z1, x2, y2, z2, block){
		this.boxes.push(this.formatBox(x1, y1, z1, x2, y2, z2, block));
	}
 
	this.addBox = function(x, y, z, size, block){
		this.boxes.push(this.formatBox(
				x, y, z,
				(x + size.x),
				(y + size.y),
				(z + size.z), 
				block
			)
		);
	}

	this.createCondition = function(x, y, z, mode){
		var model = this;
		var condition = {
			x: x, y: y, z: z,
			mode: Math.max(0, mode || 0),

			boxes: [],
			
			addBoxF: function(x1, y1, z1, x2, y2, z2, block){
				this.boxes.push(model.formatBox(x1, y1, z1, x2, y2, z2, block));
			},

			addBox: function(x, y, z, size, block){
				this.boxes.push(model.formatBox(
						x, y, z,
						(x + size.x),
						(y + size.y),
						(z + size.z), 
						block
					)
				);
			},

			tiles: {},
			tileGroups: [],
			
			addBlock: function(id, data){
				var block = Unlimited.API.GetReal(id, data || 0);
				var convertedId = block.id * 16 + block.data;
				this.tiles[convertedId] = true;
			},
			
			addBlockGroup: function(name){
				this.tileGroups.push(name);
			},
			
			addBlockGroupFinal: function(name){
				var group = ICRenderLib.getConnectionGroup(name);
				for (var id in group){
					this.tiles[id] = true;
				}
			},
			
			writeCondition: function(){
				var output = parseInt(this.x) + " " + parseInt(this.y) + " " + parseInt(this.z) + " " + parseInt(this.mode) + "\n";
				
				for (var i in this.tileGroups){
					this.addBlockGroupFinal(this.tileGroups[i]);
				}
				
				var blocks = [];
				for(var id in this.tiles){
					blocks.push(id);
				}
				output += blocks.length + " " + blocks.join(" ") + "\n" + condition.boxes.length + "\n";
				
				for(var i in condition.boxes){
					output += condition.boxes[i].join(" ") + "\n";
				}
				
				return output;
			}
		};

		this.dynamic.push(condition);
		return condition;
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

		output += this.dynamic.length + "\n";
		for(var i in this.dynamic){
			var condition = this.dynamic[i];
			output += condition.writeCondition();
		}
		
		for (var i in this.connectionGroups){
			this.addConnectionGroupFinal(this.connectionGroups[i]);
		}
		
		var connections = [];
		for (var id in this.connections){
			connections.push(id);
		}
		
		output += connections.length + " " + this.connectionWidth + "\n" + connections.join(" ");
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
			model.addBox(0.5 - width / 2.0, 0.5 - width / 2.0, 0.5 - width / 2.0, {
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




/**

// exampe of block model

Block.setPrototype("pillar", {
	getVariations: function(){
		return [
			{name: "Pillar", texture: [["cobblestone", 0]], inCreative: true}
		]
	}
});
Block.setBlockShape(BlockID.pillar, {x: 0.25, y: 0, z: 0.25},  {x: 0.75, y: 1, z: 0.75})

var pillarRender = new TileRenderModel(BlockID.pillar);

var pillarCondition1 = pillarRender.createCondition(0, -1, 0, 1);
var pillarCondition2 = pillarRender.createCondition(0, 1, 0, 1);
pillarCondition1.addBlock(BlockID.pillar, 0);
pillarCondition2.addBlock(BlockID.pillar, 0);

for(var i = 0; i < 4; i++){
	pillarCondition1.addBoxF(i / 16, i / 16, i / 16, 1.0 - i / 16, (i + 1) / 16, 1.0 - i / 16);
	pillarCondition2.addBoxF(i / 16, 1.0 - (i + 1) / 16, i / 16, 1.0 - i / 16, 1.0 - i / 16, 1.0 - i / 16);
}

pillarRender.addBoxF(0.25, 0.0, 0.25, 0.75, 1.0, 0.75, {id: 5, data: 2});

*/



IDRegistry.genBlockID("cableTin");
Block.createBlock("cableTin", [
	{name: "tile.cableTin.name", texture: [["cable_block_tin", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableCopper");
Block.createBlock("cableCopper", [
	{name: "tile.cableCopper.name", texture: [["cable_block_copper", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableGold");
Block.createBlock("cableGold", [
	{name: "tile.cableGold.name", texture: [["cable_block_gold", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableIron");
Block.createBlock("cableIron", [
	{name: "tile.cableIron.name", texture: [["cable_block_iron", 0]], inCreative: false}
], EU.getWireSpecialType());

IDRegistry.genBlockID("cableOptic");
Block.createBlock("cableOptic", [
	{name: "tile.cableOptic.name", texture: [["cable_block_optic", 0]], inCreative: false}
], EU.getWireSpecialType());

var STANDART_CABLE_WIDTH = 1/2;
var GOLD_CABLE_WIDTH = 5/8;
var HV_CABLE_WIDTH = 3/4;
var OPTIC_CABLE_WIDTH = 1/4;

Block.setBlockShape(BlockID.cableTin, {x: 0.5 - STANDART_CABLE_WIDTH/2, y: 0.5 - STANDART_CABLE_WIDTH/2, z: 0.5 - STANDART_CABLE_WIDTH/2}, {x: 0.5 + STANDART_CABLE_WIDTH/2, y: 0.5 + STANDART_CABLE_WIDTH/2, z: 0.5 + STANDART_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableCopper, {x: 0.5 - STANDART_CABLE_WIDTH/2, y: 0.5 - STANDART_CABLE_WIDTH/2, z: 0.5 - STANDART_CABLE_WIDTH/2}, {x: 0.5 + STANDART_CABLE_WIDTH/2, y: 0.5 + STANDART_CABLE_WIDTH/2, z: 0.5 + STANDART_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableGold, {x: 0.5 - GOLD_CABLE_WIDTH/2, y: 0.5 - GOLD_CABLE_WIDTH/2, z: 0.5 - GOLD_CABLE_WIDTH/2}, {x: 0.5 + GOLD_CABLE_WIDTH/2, y: 0.5 + GOLD_CABLE_WIDTH/2, z: 0.5 + GOLD_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableIron, {x: 0.5 - HV_CABLE_WIDTH/2, y: 0.5 - HV_CABLE_WIDTH/2, z: 0.5 - HV_CABLE_WIDTH/2}, {x: 0.5 + HV_CABLE_WIDTH/2, y: 0.5 + HV_CABLE_WIDTH/2, z: 0.5 + HV_CABLE_WIDTH/2});
Block.setBlockShape(BlockID.cableOptic, {x: 0.5 - OPTIC_CABLE_WIDTH/2, y: 0.5 - OPTIC_CABLE_WIDTH/2, z: 0.5 - OPTIC_CABLE_WIDTH/2}, {x: 0.5 + OPTIC_CABLE_WIDTH/2, y: 0.5 + OPTIC_CABLE_WIDTH/2, z: 0.5 + OPTIC_CABLE_WIDTH/2});

ICRenderLib.registerAsWire(BlockID.cableTin, "ic-wire", STANDART_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableCopper, "ic-wire", STANDART_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableGold, "ic-wire", GOLD_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableIron, "ic-wire", HV_CABLE_WIDTH);
ICRenderLib.registerAsWire(BlockID.cableOptic, "ic-wire", OPTIC_CABLE_WIDTH);

// drop 
Block.registerDropFunction("cableTin", function(){
	return [[ItemID.cableTin1, 1, 0]];
});

Block.registerDropFunction("cableCopper", function(){
	return [[ItemID.cableCopper1, 1, 0]];
});

Block.registerDropFunction("cableGold", function(){
	return [[ItemID.cableGold2, 1, 0]];
});

Block.registerDropFunction("cableIron", function(){
	return [[ItemID.cableIron3, 1, 0]];
});

Block.registerDropFunction("cableOptic", function(){
	return [[ItemID.cableOptic, 1, 0]];;
});


var BLOCK_TYPE_ORE = Block.createSpecialType({
	base: 1,
	destroytime: 3
}, "ore");

IDRegistry.genBlockID("oreCopper");
Block.createBlock("oreCopper", [
	{name: "Copper Ore", texture: [["ore_copper", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreCopper, "stone", 2);
Block.registerDropFunction("oreCopper", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[ItemID.oreCrushedCopper, 1, 0]]
	}
	return [];
}, 2);


IDRegistry.genBlockID("oreTin");
Block.createBlock("oreTin", [
	{name: "Tin Ore", texture: [["ore_tin", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreTin, "stone", 2);
Block.registerDropFunction("oreTin", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[ItemID.oreCrushedTin, 1, 0]]
	}
	return [];
}, 2);


IDRegistry.genBlockID("oreLead");
Block.createBlock("oreLead", [
	{name: "Lead Ore", texture: [["ore_lead", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreLead, "stone", 2);
Block.registerDropFunction("oreLead", function(coords, blockID, blockData, level, enchant){
	if(level > 1){
		return [[ItemID.oreCrushedLead, 1, 0]];
	}
	return [];
}, 2);


IDRegistry.genBlockID("oreUranium");
Block.createBlock("oreUranium", [
	{name: "Uranium Ore", texture: [["ore_uranium", 0]], inCreative: true}
], BLOCK_TYPE_ORE);
ToolAPI.registerBlockMaterial(BlockID.oreUranium, "stone", 2);
Block.registerDropFunction("oreUranium", function(coords, blockID, blockData, level){
	if(level > 2){
		return [[ItemID.uraniumChunk, 1, 0]]
	}
	return [];
}, 3);


var OreGenerator = {
	"copper_ore": __config__.access("ore_gen.copper_ore"),
	"tin_ore": __config__.access("ore_gen.tin_ore"),
	"lead_ore": __config__.access("ore_gen.lead_ore"),
	"uranium_ore": __config__.access("ore_gen.uranium_ore"),
	
	genOreNormal: function(x, y, z, ore){
		for(var xx = -1; xx < 2; xx++){
			for(var yy = -1; yy < 2; yy++){
				for(var zz = -1; zz < 2; zz++){
					var d = Math.sqrt(xx*xx + yy*yy + zz*zz);
					var r = 1.5 - Math.random()/2;
					if(d < r){GenerationUtils.setLockedBlock(x+xx, y+yy, z+zz);}
				}
			}
		}
	},
	genOreSmall: function(x, y, z, ore){
		for(var xx = 0; xx < 2; xx++){
			for(var yy = 0; yy < 2; yy++){
				for(var zz = 0; zz < 2; zz++){
					var d = Math.sqrt(xx*xx + yy*yy + zz*zz);
					var r = 2 - Math.random()*2;
					if(d < r){GenerationUtils.setLockedBlock(x+xx, y+yy, z+zz);}
				}
			}
		}
	},
	genOreTiny: function(x, y, z, maxCount){
		GenerationUtils.setLockedBlock(x,y,z);
		for(var i = 1; i < random(1, maxCount); i++){
			GenerationUtils.setLockedBlock(x+random(-1,1), y+random(-1,1), z+random(-1,1));
		}
	}
}

Callback.addCallback("PostLoaded", function(){
	if(OreGenerator.copper_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			GenerationUtils.lockInBlock(BlockID.oreCopper, 0, 1, false);
			for(var i = 0; i < 10; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 10, 64);
				OreGenerator.genOreNormal(coords.x, coords.y, coords.z);
			}
		});
	}
	if(OreGenerator.tin_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			GenerationUtils.lockInBlock(BlockID.oreTin, 0, 1, false);
			for(var i = 0; i < 8; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 52);
				OreGenerator.genOreNormal(coords.x, coords.y, coords.z);
			}
		});
	}
	if(OreGenerator.lead_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			GenerationUtils.lockInBlock(BlockID.oreLead, 0, 1, false);
			for(var i = 0; i < 8; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				OreGenerator.genOreTiny(coords.x, coords.y, coords.z, 3);
			}
		});
	}
	if(OreGenerator.uranium_ore){
		Callback.addCallback("GenerateChunkUnderground", function(chunkX, chunkZ){
			GenerationUtils.lockInBlock(BlockID.oreUranium, 0, 1, false);
			for(var i = 0; i < 3; i++){
				var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 1, 48);
				OreGenerator.genOreTiny(coords.x, coords.y, coords.z, 3);
			}
		});
	}
});


var BLOCK_TYPE_METAL_BLOCK = Block.createSpecialType({
	base: 1,
	destroytime: 5,
}, "metal_block");

IDRegistry.genBlockID("blockCopper");
Block.createBlock("blockCopper", [
	{name: "Copper Block", texture: [["block_copper", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockCopper, "stone", 2);
Block.registerDropFunction("blockCopper", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockTin");
Block.createBlock("blockTin", [
	{name: "Tin Block", texture: [["block_tin", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockTin, "stone", 2);
Block.registerDropFunction("blockTin", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockBronze");
Block.createBlock("blockBronze", [
	{name: "Bronze Block", texture: [["block_bronze", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockBronze, "stone", 2);
Block.registerDropFunction("blockBronze", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockLead");
Block.createBlock("blockLead", [
	{name: "Lead Block", texture: [["block_lead", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockLead, "stone", 2);
Block.registerDropFunction("blockLead", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("blockSteel");
Block.createBlock("blockSteel", [
	{name: "Steel Block", texture: [["block_steel", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.blockSteel, "stone", 2);
Block.registerDropFunction("blockSteel", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 3);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.blockCopper, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotCopper, 0]);
	
	Recipes.addShaped({id: BlockID.blockTin, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotTin, 0]);
	
	Recipes.addShaped({id: BlockID.blockBronze, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotBronze, 0]);
	
	Recipes.addShaped({id: BlockID.blockLead, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotLead, 0]);
	
	Recipes.addShaped({id: BlockID.blockSteel, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.ingotSteel, 0]);
	
	Recipes.addShaped({id: ItemID.ingotCopper, count: 9, data: 0}, ["x"], ['x', BlockID.blockCopper, 0]);
	Recipes.addShaped({id: ItemID.ingotTin, count: 9, data: 0}, ["x"], ['x', BlockID.blockTin, 0]);
	Recipes.addShaped({id: ItemID.ingotBronze, count: 9, data: 0}, ["x"], ['x', BlockID.blockBronze, 0]);
	Recipes.addShaped({id: ItemID.ingotLead, count: 9, data: 0}, ["x"], ['x', BlockID.blockLead, 0]);
	Recipes.addShaped({id: ItemID.ingotSteel, count: 9, data: 0}, ["x"], ['x', BlockID.blockSteel, 0]);
});


IDRegistry.genBlockID("machineBlockBasic");
Block.createBlock("machineBlockBasic", [
	{name: "Machine Block", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.machineBlockBasic, "stone", 2);

Block.registerDropFunction("machineBlockBasic", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);

IDRegistry.genBlockID("machineBlockAdvanced");
Block.createBlock("machineBlockAdvanced", [
	{name: "Advanced Machine Block", texture: [["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0], ["machine_advanced", 0]], inCreative: true}
], BLOCK_TYPE_METAL_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.machineBlockAdvanced, "stone", 2);

Block.registerDropFunction("machineBlockAdvanced", function(coords, blockID, blockData, level){
	if(level > 1){
		return [[blockID, 1, 0]]
	}
	return [];
}, 2);


Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.machineBlockBasic, count: 1, data: 0}, [
		"xxx",
		"x x",
		"xxx"
	], ['x', ItemID.plateIron, 0]);
	
	Recipes.addShaped({id: BlockID.machineBlockAdvanced, count: 1, data: 0}, [
		" x ",
		"a#a",
		" x "
	], ['x', ItemID.carbonPlate, 0, 'a', ItemID.plateAlloy, 0, '#', BlockID.machineBlockBasic, 0]);
	
	Recipes.addShapeless({id: ItemID.plateIron, count: 8, data: 0}, [{id: BlockID.machineBlockBasic, data: 0}]);
});



var BLOCK_TYPE_REINFORCED_BLOCK = Block.createSpecialType({
	base: 1,
	destroytime: 5,
	explosionres: 150,
	opaque: false,
	lightopacity: 0
}, "reinfrorced_block");

IDRegistry.genBlockID("reinforcedStone");
Block.createBlock("reinforcedStone", [
	{name: "Reinforced Stone", texture: [["reinforced_block", 0]], inCreative: true}
], BLOCK_TYPE_REINFORCED_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.reinforcedStone, "stone", 2);
Block.registerDropFunction("reinforcedStone", function(coords, blockID, blockData, level){
	if(level > 2){
		return [[blockID, 1, 0]]
	}
	return [];
}, 3);

IDRegistry.genBlockID("reinforcedGlass");
Block.createBlock("reinforcedGlass", [
	{name: "Reinforced Glass", texture: [["reinforced_glass", 0]], inCreative: true}
], BLOCK_TYPE_REINFORCED_BLOCK);
ToolAPI.registerBlockMaterial(BlockID.reinforcedGlass, "stone", 2);
Block.setBlockShape(BlockID.reinforcedGlass, {x: 0.001, y: 0.001, z: 0.001}, {x: 0.999, y: 0.999, z: 0.999});
Block.registerDropFunction("reinforcedGlass", function(coords, blockID, blockData, level){
	if(level > 2){
		return [[blockID, 1, 0]]
	}
	return [];
}, 3);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.reinforcedStone, count: 8, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 1, 0]);
	
	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"axa",
		"aaa",
		"axa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
	Recipes.addShaped({id: BlockID.reinforcedGlass, count: 7, data: 0}, [
		"aaa",
		"xax",
		"aaa"
	], ['x', ItemID.plateAlloy, 0, 'a', 20, 0]);
});


var BLOCK_TYPE_LOG = Block.createSpecialType({
	base: 17
});

var BLOCK_TYPE_LEAVES = Block.createSpecialType({
	base: 18,
	destroytime: 0.2,
});


function destroyLeaves(x,y,z){
	var max = 0;
	if(World.getBlockID(x, y+1, z)==BlockID.rubberTreeLeaves){max = 4;}
	for(var yy = y; yy <= y+max; yy++){
		for(var xx = x-2; xx <= x+2; xx++){
			for(var zz = z-2; zz <= z+2; zz++){
				if(World.getBlockID(xx, yy, zz)==BlockID.rubberTreeLeaves){
					if(Math.random() < .075){
						World.drop(xx, yy, zz, ItemID.rubberSapling, 1, 0);
					}
					World.setBlock(xx, yy, zz, 0);
				}
			}
		}
	}
}

IDRegistry.genBlockID("rubberTreeLog");
Block.createBlock("rubberTreeLog", [
	{name: "Rubber Tree Log", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false}
], BLOCK_TYPE_LOG);
Block.registerDropFunction("rubberTreeLog", function(coords, blockID){
	destroyLeaves(coords.x, coords.y, coords.z);
	return [[blockID, 1, 0]];
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLog, "wood");

IDRegistry.genBlockID("rubberTreeLogLatex");
Block.createBlock("rubberTreeLogLatex", [
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2], ["rubber_tree_log", 0]], inCreative: false},
	{name: "tile.rubberTreeLogLatex.name", texture: [["rubber_tree_log", 1], ["rubber_tree_log", 1], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 0], ["rubber_tree_log", 2]], inCreative: false}
], BLOCK_TYPE_LOG);
Block.registerDropFunction("rubberTreeLogLatex", function(coords, blockID){
	destroyLeaves(coords.x, coords.y, coords.z);
	return [[BlockID.rubberTreeLog, 1, 0], [ItemID.latex, 1, 0]];
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLogLatex, "wood");

IDRegistry.genBlockID("rubberTreeLeaves");
Block.createBlock("rubberTreeLeaves", [
	{name: "Rubber Tree Leaves", texture: [["rubber_tree_leaves", 0]], inCreative: false}
], BLOCK_TYPE_LEAVES);
Block.setBlockShape(BlockID.rubberTreeLeaves, {x: 0.001, y: 0.001, z: 0.001}, {x: 0.999, y: 0.999, z: 0.999});
Block.registerDropFunction("rubberTreeLeaves", function(){
	if(Math.random() < .075){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	else {
		return [];
	}
});
ToolAPI.registerBlockMaterial(BlockID.rubberTreeLeaves, "plant");

Recipes.addShaped({id: 5, count: 3, data: 3}, ["x"], ['x', BlockID.rubberTreeLog, -1]);



var RubberTreeGenerationHelper = {
	/*
	 params: {
		 leaves: {
			 id: 
			 data: 
		 },
		 log: {
			 id: 
			 data:
			 resin: 
		 },
		 height: {
			 min:
			 max:
			 start: 
		 },
		 pike:
		 radius: 
	 }
	*/
	generateCustomTree: function(x, y, z, params){
		var leaves = params.leaves;
		var log = params.log;
		
		var height = parseInt(Math.random() * (0.5 + params.height.max - params.height.min) + params.height.min);
		var resinHeight = -1;
		if(log.resin){
			resinHeight = parseInt(Math.random() * (height - 2)) + 1;
		}
		for(var ys = 0; ys < height; ys++){
			if(ys == resinHeight){
				World.setBlock(x, y + ys, z, log.resin, parseInt(Math.random()*4));
			}
			else{
				World.setFullBlock(x, y + ys, z, log);
			}
		}
		
		GenerationUtils.lockInBlock(leaves.id, leaves.data);
		if(params.pike){
			for(var ys = 0; ys < params.pike; ys++){
				GenerationUtils.setLockedBlock(x, y + ys + height, z);
			}
		}
		
		var leavesStart = params.height.start;
		var leavesEnd = height;
		var leavesMiddle = (leavesEnd + leavesStart) / 2;
		var leavesLen = leavesEnd - leavesStart;
		for(var ys = leavesStart; ys < leavesEnd; ys++){
			for(var xs = -params.radius; xs <= params.radius; xs++){
				for(var zs = -params.radius; zs <= params.radius; zs++){
					var d = Math.sqrt(xs*xs + zs*zs) + (Math.random()*0.5 + 0.5) * Math.pow(Math.abs(leavesMiddle - ys) / leavesLen, 1.5) * 1.2;
					var blockID = nativeGetTile(x + xs, y + ys, z + zs)
					if(d <= params.radius + 0.5 && (blockID==0 || blockID==106)){
						GenerationUtils.setLockedBlock(x + xs, y + ys, z + zs);
					}
				}	
			}
		}
	},
	
	generateRubberTree: function(x, y, z, activateTileEntity){
		RubberTreeGenerationHelper.generateCustomTree(x, y, z, {
			log: {
				id: BlockID.rubberTreeLog,
				data: 0,
				resin: BlockID.rubberTreeLogLatex
			},
			leaves: {
				id: BlockID.rubberTreeLeaves,
				data: 0
			},
			height: {
				min: 5,
				max: 7,
				start: 2 + parseInt(Math.random() * 2)
			},
			pike: 2 + parseInt(Math.random() * 1.5),
			radius: 2
		});
		if(activateTileEntity){
			return World.addTileEntity(x, y, z);
		}
	}
}


var ForestBiomeIDs = [4, 18, 27, 28];
var JungleBiomeIDs = [21, 22, 23, 149, 151];
var SwampBiomeIDs = [6, 134];

var RUBBER_TREE_BIOME_DATA = { };
if(__config__.access("rubber_tree_gen.forest_and_plains")){
	RUBBER_TREE_BIOME_DATA[1] = 0.005;
	for(var id in ForestBiomeIDs){
	RUBBER_TREE_BIOME_DATA[ForestBiomeIDs[id]] = 0.025;}
}
if(__config__.access("rubber_tree_gen.jungle")){
	for(var id in JungleBiomeIDs){
	RUBBER_TREE_BIOME_DATA[JungleBiomeIDs[id]] = 0.06;}
}
if(__config__.access("rubber_tree_gen.swamp")){
	for(var id in SwampBiomeIDs){
	RUBBER_TREE_BIOME_DATA[SwampBiomeIDs[id]] = 0.05;}
}

Callback.addCallback("GenerateChunk", function(chunkX, chunkZ){
	if(Math.random() < RUBBER_TREE_BIOME_DATA[World.getBiome((chunkX + 0.5) * 16, (chunkZ + 0.5) * 16)]){
		for(var i = 0; i < 1 + Math.random() * 4; i++){
			var coords = GenerationUtils.randomCoords(chunkX, chunkZ, 64, 128);
			coords = GenerationUtils.findSurface(coords.x, coords.y, coords.z);
			if(World.getBlockID(coords.x, coords.y, coords.z) == 2){	
				coords.y++;	
				RubberTreeGenerationHelper.generateRubberTree(coords.x, coords.y, coords.z, false);
			}
		}
	}
});



IDRegistry.genBlockID("ironFurnace");
Block.createBlockWithRotation("ironFurnace", [
	{name: "Iron Furnace", texture: [["iron_furnace_bottom", 0], ["iron_furnace_top", 0], ["iron_furnace_side", 0], ["iron_furnace_front", 0], ["iron_furnace_side", 0], ["iron_furnace_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.ironFurnace);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.ironFurnace, count: 1, data: 0}, [
		" x ",
		"x x",
		"x#x"
	], ['#', 61, -1, 'x', ItemID.plateIron, 0]);
});


var guiIronFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Iron Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
	}
});


MachineRegistry.registerPrototype(BlockID.ironFurnace, {
	defaultValues: {
		progress: 0,
		burn: 0,
		burnMax: 0
	},
	
	getGuiScreen: function(){
		return guiIronFurnace;
	},
	
	addTransportedItem: function(self, item, direction){
		var fuelSlot = this.container.getSlot("slotFuel");
		if(FURNACE_FUEL_MAP[item.id] && (fuelSlot.id==0 || fuelSlot.id==item.id && fuelSlot.data==item.data && fuelSlot.count < 64)){
			var add = Math.min(item.count, 64 - slotFuel.count);
			item.count -= add;
			fuelSlot.id = item.id;
			fuelSlot.data = item.data;
			fuelSlot.count += add;
			if(!item.count){return;}
		}
		
		var sourceSlot = this.container.getSlot("slotSource");
		if(sourceSlot.id==0 || sourceSlot.id==item.id && sourceSlot.data==item.data && sourceSlot.count < 64){
			var add = Math.min(item.count, 64 - sourceSlot.count);
			item.count -= add;
			sourceSlot.id = item.id;
			sourceSlot.data = item.data;
			sourceSlot.count += add;
			if(!item.count){return;}
		}
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource", "slotFuel"], output: ["slotResult"]};
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if(result && this.data.burn > 0){
			var resultSlot = this.container.getSlot("slotResult");
			if((resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0) && this.data.progress++ >= 160){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				this.container.validateAll();
				this.data.progress = 0;
			}
		}
		else {
			this.data.progress = 0;
		}
		
		if(this.data.burn > 0){
			this.data.burn--;
		}
		else if(result){
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel");
		}
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("progressScale", this.data.progress / 160);
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if(fuelSlot.id > 0){
			var burn = FURNACE_FUEL_MAP[fuelSlot.id];
			if(burn){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				return burn;
			}
			if(LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
				var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
				fuelSlot.id = empty.id;
				fuelSlot.data = empty.data;
				return 20000;
			}
		}
		return 0;
	}
});


IDRegistry.genBlockID("electricFurnace");
Block.createBlockWithRotation("electricFurnace", [
	{name: "Electric Furnace", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["electric_furnace", 1], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.electricFurnace);

Block.registerDropFunction("electricFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.ironFurnace);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.electricFurnace, count: 1, data: 0}, [
		" a ",
		"x#x"
	], ['#', BlockID.ironFurnace, -1, 'x', 331, 0, 'a', ItemID.circuitBasic, 0]);
});

var guiElectricFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Electric Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 175},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});


MachineRegistry.registerPrototype(BlockID.electricFurnace, {
	defaultValues: {
		energy_storage: 2000,
		energy_consumption: 3,
		work_time: 130,
		progress: 0,
	},
	
	getGuiScreen: function(){
		return guiElectricFurnace;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = Recipes.getFurnaceRecipeResult(sourceSlot.id, "iron");
		if(result){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count++;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("inductionFurnace");
Block.createBlockWithRotation("inductionFurnace", [
	{name: "Induction Furnace", texture: [["machine_bottom", 0], ["machine_advanced", 0], ["machine_side", 0], ["induction_furnace_front", 1], ["induction_furnace_side", 1], ["induction_furnace_side", 1]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.inductionFurnace);

Block.registerDropFunction("inductionFurnace", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.inductionFurnace, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xax"
	], ['#', BlockID.electricFurnace, -1, 'x', ItemID.ingotCopper, 0, 'a', BlockID.machineBlockAdvanced, 0]);
});


var guiInductionFurnace = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Induction Furnace"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 630, y: 146, bitmap: "furnace_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 550, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 630, y: 146, direction: 0, value: 0.5, bitmap: "furnace_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 550, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource1": {type: "slot", x: 511, y: 75},
		"slotSource2": {type: "slot", x: 571, y: 75},
		"slotEnergy": {type: "slot", x: 541, y: 212},
		"slotResult1": {type: "slot", x: 725, y: 142},
		"slotResult2": {type: "slot", x: 785, y: 142},
		"slotUpgrade1": {type: "slot", x: 900, y: 80},
		"slotUpgrade2": {type: "slot", x: 900, y: 142},
		"slotUpgrade3": {type: "slot", x: 900, y: 207},
		"textInfo1": {type: "text", x: 402, y: 143, width: 100, height: 30, text: "Heat:"},
		"textInfo2": {type: "text", x: 402, y: 173, width: 100, height: 30, text: "0%"},
	}
});


MachineRegistry.registerPrototype(BlockID.inductionFurnace, {
	defaultValues: {
		energy_storage: 10000,
		isHeating: false,
		heat: 0,
		progress: 0,
		upgrades: {}
	},
	
	getGuiScreen: function(){
		return guiInductionFurnace;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource1", "slotSource2"], output: ["slotResult1", "slotResult2"]};
	},
	
	getResult: function(){
		var sourceSlot1 = this.container.getSlot("slotSource1");
		var sourceSlot2 = this.container.getSlot("slotSource2");
		var result1 = Recipes.getFurnaceRecipeResult(sourceSlot1.id, "iron");
		var result2 = Recipes.getFurnaceRecipeResult(sourceSlot2.id, "iron");
		if(result1 || result2){
			return {
				result1: result1,
				result2: result2
			};
		}
	},
	
	putResult: function(result, sourceSlot, resultSlot){
		if(result && sourceSlot && resultSlot){
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count < 64 || resultSlot.id == 0){
				sourceSlot.count--;
				resultSlot.id = result.id;
				resultSlot.data = result.data;
				resultSlot.count++;
				this.container.validateAll();
				return true;
			}
		}
	},
	
	tick: function(){
		this.data.energy_storage = 10000;
		this.data.upgrades = UpgradeAPI.executeAll(this);
		
		var result = this.getResult();
		if(result){
			if(this.data.energy > 15){
				this.data.energy -= 16;
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.progress += this.data.heat/60000;
			}
			if(this.data.progress >= 1){
				var put1 = this.putResult(result.result1, this.container.getSlot("slotSource1"), this.container.getSlot("slotResult1"));
				var put2 = this.putResult(result.result2, this.container.getSlot("slotSource2"), this.container.getSlot("slotResult2"));
				if(put1 || put2){
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
			if(this.data.isHeating && this.data.energy > 0){
				if(this.data.heat < 5000){this.data.heat++;}
				this.data.energy--;
			}
			else if(this.data.heat > 0){
				this.data.heat--;
			}
		}
		

		
		var energyStorage = this.getEnergyStorage();
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 1);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo2", parseInt(this.data.heat / 50) + "%");
	},
	
	redstone: function(signal){
		this.data.isHeating = signal.power > 0;
		if(this.data.upgrades[ItemID.upgradeRedstone]){
			this.data.isHeating = !this.data.isHeating;
		}
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


﻿IDRegistry.genBlockID("macerator");
Block.createBlockWithRotation("macerator", [
    {name: "Macerator", texture: [["machine_bottom", 0], ["macerator_top", 1], ["machine_side", 0], ["macerator_front", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.macerator);

Block.registerDropFunction("macerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
    Recipes.addShaped({id: BlockID.macerator, count: 1, data: 0}, [
        "xxx",
        "b#b",
        " a "
    ], ['#', BlockID.machineBlockBasic, 0, 'x', 318, 0, 'b', 4, -1, 'a', ItemID.circuitBasic, 0]);
});

var guiMacerator = new UI.StandartWindow({
    standart: {
        header: {text: {text: "Macerator"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 530, y: 146, bitmap: "macerator_bar_background", scale: GUI_BAR_STANDART_SCALE},
        {type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
    ],
    
    elements: {
        "progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "macerator_bar_scale", scale: GUI_BAR_STANDART_SCALE},
        "energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
        "slotSource": {type: "slot", x: 441, y: 75},
        "slotEnergy": {type: "slot", x: 441, y: 212},
        "slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 175},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
    }
});

Callback.addCallback("PreLoaded", function(){
    MachineRecipeRegistry.registerRecipesFor("macerator", {
        // ores
        14: {id: ItemID.dustGold, count: 2, data: 0},
        15: {id: ItemID.dustIron, count: 2, data: 0},
        "ItemID.oreCrushedCopper": {id: ItemID.dustCopper, count: 2, data: 0},
        "ItemID.oreCrushedTin": {id: ItemID.dustTin, count: 2, data: 0},
        "ItemID.oreCrushedLead": {id: ItemID.dustLead, count: 2, data: 0},
        // ingots
        265: {id: ItemID.dustIron, count: 1, data: 0},
        266: {id: ItemID.dustGold, count: 1, data: 0},
        "ItemID.ingotCopper": {id: ItemID.dustCopper, count: 1, data: 0},
        "ItemID.ingotTin": {id: ItemID.dustTin, count: 1, data: 0},
        "ItemID.ingotLead": {id: ItemID.dustLead, count: 1, data: 0},
        "ItemID.ingotSteel": {id: ItemID.dustIron, count: 1, data: 0},
        "ItemID.ingotBronze": {id: ItemID.dustBronze, count: 1, data: 0},
        // plates
        "ItemID.plateIron": {id: ItemID.dustIron, count: 1, data: 0},
        "ItemID.plateGold": {id: ItemID.dustGold, count: 1, data: 0},
        "ItemID.plateCopper": {id: ItemID.dustCopper, count: 1, data: 0},
        "ItemID.plateTin": {id: ItemID.dustTin, count: 1, data: 0},
        "ItemID.plateLead": {id: ItemID.dustLead, count: 1, data: 0},
        "ItemID.plateSteel": {id: ItemID.dustIron, count: 1, data: 0},
        "ItemID.plateBronze": {id: ItemID.dustBronze, count: 1, data: 0},
        // other resources
        22: {id: ItemID.dustLapis, count: 9, data: 0},
        173: {id: ItemID.dustCoal, count: 9, data: 0},
        263: {id: ItemID.dustCoal, count: 1, data: 0},
        264: {id: ItemID.dustDiamond, count: 1, data: 0},
        351: {id: ItemID.dustLapis, count: 1, data: 0, ingredientData: 4},
        // other materials
        1: {id: 4, count: 1, data: 0},
        4: {id: 12, count: 1, data: 0},
        13: {id: 318, count: 1, data: 0},
		35: {id: 287, count: 2, data: 0},
		89: {id: 348, count: 4, data: 0},
        152: {id: 406, count: 4, data: 0},
        156: {id: 406, count: 6, data: 0},
        352: {id: 351, count: 5, data: 15}, 
		369: {id: 377, count: 5, data: 0}
    }, true);
});

MachineRegistry.registerPrototype(BlockID.macerator, {
    defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 300,
		progress: 0,
    },
    
    getGuiScreen: function(){
        return guiMacerator;
    },
    
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
    tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
        var sourceSlot = this.container.getSlot("slotSource");
        var result = MachineRecipeRegistry.getRecipeResult("macerator", sourceSlot.id);
        if(result && (sourceSlot.data == result.ingredientData || !result.ingredientData)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
                    sourceSlot.count--;
                    resultSlot.id = result.id;
                    resultSlot.data = result.data;
                    resultSlot.count += result.count;
                    this.container.validateAll();
                    this.data.progress = 0;
                }
            }
        }
        else {
            this.data.progress = 0;
        }
        
        var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
        this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
        
        this.container.setScale("progressScale", this.data.progress);
        this.container.setScale("energyScale", this.data.energy / energyStorage);
    },
    
    getEnergyStorage: function(){
        return this.data.energy_storage;
    },
    
    energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("recycler");
Block.createBlockWithRotation("recycler", [
	{name: "Recycler", texture: [["machine_bottom", 0], ["recycler_top", 0], ["machine_side", 0], ["recycler_front", 1], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.recycler);

Block.registerDropFunction("recycler", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.recycler, count: 1, data: 0}, [
		" a ",
		"x#x",
		"bxb"
	], ['#', BlockID.compressor, -1, 'x', 3, -1, 'a', 348, 0, 'b', ItemID.ingotSteel, 0]);
});

var guiRecycler = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Recycler"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "recycler_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "recycler_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 175},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});


MachineRegistry.registerPrototype(BlockID.recycler, {
	defaultValues: {
		energy_storage: 500,
		energy_consumption: 1,
		work_time: 45,
		progress: 0,
	},
	
	getGuiScreen: function(){
		return guiRecycler;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		if(sourceSlot.id > 0){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == ItemID.scrap && resultSlot.count < 64 || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
					sourceSlot.count--;
					if(Math.random() < 0.125){
						resultSlot.id = ItemID.scrap;
						resultSlot.count++;
					}
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("compressor");
Block.createBlockWithRotation("compressor", [
	{name: "Compressor", texture: [["machine_bottom", 0], ["machine_top_hole", 0], ["machine_side", 0], ["compressor", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.compressor);

Block.registerDropFunction("compressor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.compressor, count: 1, data: 0}, [
		"x x",
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', 1, 0, 'a', ItemID.circuitBasic, -1]);
});


var guiCompressor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Compressor"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "compressor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "compressor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 175},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});


Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("compressor", {
		"ItemID.dustEnergium": {id: ItemID.storageCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageCrystal), ingredientCount: 9},
		87: {id: 112, count: 1, data: 0, ingredientCount: 3},
		80: {id: 79, count: 1, data: 0},
		12: {id: 24, count: 1, data: 0, ingredientCount: 4},
		"ItemID.dustLapis": {id: ItemID.plateLapis, count: 1, data: 0},
		"ItemID.ingotAlloy": {id: ItemID.plateAlloy, count: 1, data: 0},
		"ItemID.carbonMesh": {id: ItemID.carbonPlate, count: 1, data: 0},
		"ItemID.coalBall": {id: ItemID.coalBlock, count: 1, data: 0},
		"ItemID.coalChunk": {id: 264, count: 1, data: 0}
	}, true);
});

MachineRegistry.registerPrototype(BlockID.compressor, {
	defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 400,
		progress: 0,
	},
	
	getGuiScreen: function(){
		return guiCompressor;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("compressor", sourceSlot.id);
		if(result && (sourceSlot.count >= result.ingredientCount || !result.ingredientCount)){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= Item.getMaxStack(result.id) - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
					sourceSlot.count -= result.ingredientCount || 1;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("extractor");
Block.createBlockWithRotation("extractor", [
	{name: "Extractor", texture: [["machine_bottom", 0], ["machine_top_hole", 0], ["machine_side", 0], ["extractor_front", 0], ["extractor_side", 0], ["extractor_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.extractor);

Block.registerDropFunction("extractor", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.extractor, count: 1, data: 0}, [
		"x#x",
		"xax"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.treetap, 0, 'a', ItemID.circuitBasic, 0]);
});

var guiExtractor = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Extractor"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "extractor_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "extractor_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 625, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 175},
		"slotUpgrade4": {type: "slot", x: 820, y: 240}
	}
});

Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("extractor", {
		"ItemID.latex": {id: ItemID.rubber, count: 3, data: 0},
		"BlockID.rubberTreeLog": {id: ItemID.rubber, count: 1, data: 0}
	}, true);
});

MachineRegistry.registerPrototype(BlockID.extractor, {
	defaultValues: {
		energy_storage: 2000,
		energy_consumption: 2,
		work_time: 400,
		progress: 0,
	},
	
	getGuiScreen: function(){
		return guiExtractor;
	},
		
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("extractor", sourceSlot.id);
		if(result){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.data == result.data && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
					sourceSlot.count--;
					resultSlot.id = result.id;
					resultSlot.data = result.data;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("metalFormer");
Block.createBlockWithRotation("metalFormer", [
	{name: "Metal Former", texture: [["machine_bottom", 2], ["metal_former_top", 0], ["machine_side", 2], ["metal_former_front", 0], ["machine_side", 2], ["machine_side", 2]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.metalFormer);

Block.registerDropFunction("metalFormer", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.metalFormer, count: 1, data: 0}, [
		" x ",
		"b#b",
		"ccc"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.circuitBasic, 0, 'b', ItemID.toolbox, 0, 'c', ItemID.coil, 0]);
});


var guiMetalFormer = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Metal Former"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 146, bitmap: "metalformer_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"progressScale": {type: "scale", x: 530, y: 146, direction: 0, value: 0.5, bitmap: "metalformer_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"energyScale": {type: "scale", x: 450, y: 150, direction: 1, value: 1, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotSource": {type: "slot", x: 441, y: 75},
		"slotEnergy": {type: "slot", x: 441, y: 212},
		"slotResult": {type: "slot", x: 715, y: 142},
		"slotUpgrade1": {type: "slot", x: 820, y: 48},
		"slotUpgrade2": {type: "slot", x: 820, y: 112},
		"slotUpgrade3": {type: "slot", x: 820, y: 175},
		"slotUpgrade4": {type: "slot", x: 820, y: 240},
		"button": {type: "button", x: 575, y: 210, bitmap: "button_slot", scale: GUI_BAR_STANDART_SCALE, clicker: {
			onClick: function(container, tileEntity){
				tileEntity.data.mode = (tileEntity.data.mode + 1) % 3;
			}
		}}
	}
});


Callback.addCallback("PreLoaded", function(){
	MachineRecipeRegistry.registerRecipesFor("metalFormer0", {
		// ingots
		265: {id: ItemID.plateIron, count: 1},
		266: {id: ItemID.plateGold, count: 1},
		"ItemID.ingotCopper": {id: ItemID.plateCopper, count: 1},
		"ItemID.ingotTin": {id: ItemID.plateTin, count: 1},
		"ItemID.ingotBronze": {id: ItemID.plateBronze, count: 1},
		"ItemID.ingotSteel": {id: ItemID.plateSteel, count: 1},
		"ItemID.ingotLead": {id: ItemID.plateLead, count: 1},
		// plates
		"ItemID.plateIron": {id: ItemID.casingIron, count: 2},
		"ItemID.plateGold": {id: ItemID.casingGold, count: 2},
		"ItemID.plateTin": {id: ItemID.casingTin, count: 2},
		"ItemID.plateCopper": {id: ItemID.casingCopper, count: 2},
		"ItemID.plateBronze": {id: ItemID.casingBronze, count: 2},
		"ItemID.plateSteel": {id: ItemID.casingSteel, count: 2},
		"ItemID.plateLead": {id: ItemID.casingLead, count: 2}
	}, true);

	MachineRecipeRegistry.registerRecipesFor("metalFormer1", {
		"ItemID.plateTin": {id: ItemID.cableTin0, count: 4},
		"ItemID.plateCopper": {id: ItemID.cableCopper0, count: 4},
		"ItemID.plateGold": {id: ItemID.cableGold0, count: 4},
		"ItemID.plateIron": {id: ItemID.cableIron0, count: 4},
	}, true);
		
	MachineRecipeRegistry.registerRecipesFor("metalFormer2", {
		"ItemID.ingotTin": {id: ItemID.cableTin0, count: 3},
		"ItemID.ingotCopper": {id: ItemID.cableCopper0, count: 3},
		"ItemID.ingotGold": {id: ItemID.cableGold0, count: 4},
		265: {id: ItemID.cableIron0, count: 4},
	}, true);
});

MachineRegistry.registerPrototype(BlockID.metalFormer, {
	defaultValues: {
		energy_storage: 4000,
		energy_consumption: 10,
		work_time: 200,
		progress: 0,
		mode: 0
	},
	
	getGuiScreen: function(){
		return guiMetalFormer;
	},
	
	getTransportSlots: function(){
		return {input: ["slotSource"], output: ["slotResult"]};
	},
	
	setDefaultValues: function(){
		this.data.energy_storage = this.defaultValues.energy_storage;
		this.data.energy_consumption = this.defaultValues.energy_consumption;
		this.data.work_time = this.defaultValues.work_time;
	},
	
	tick: function(){
		var content = this.container.getGuiContent();
		if(content){
			content.elements.button.bitmap = "metal_former_button_" + this.data.mode;
		}
		this.setDefaultValues();
		UpgradeAPI.executeAll(this);
		
		var sourceSlot = this.container.getSlot("slotSource");
		var result = MachineRecipeRegistry.getRecipeResult("metalFormer" + this.data.mode, sourceSlot.id)
		if(result){
			var resultSlot = this.container.getSlot("slotResult");
			if(resultSlot.id == result.id && resultSlot.count <= 64 - result.count || resultSlot.id == 0){
				if(this.data.energy >= this.data.energy_consumption){
					this.data.energy -= this.data.energy_consumption;
					this.data.progress += 1/this.data.work_time;
				}
				if(this.data.progress >= 1){
					sourceSlot.count -= 1;
					resultSlot.id = result.id;
					resultSlot.count += result.count;
					this.container.validateAll();
					this.data.progress = 0;
				}
			}
		}
		else {
			this.data.progress = 0;
		}
		
		var energyStorage = this.getEnergyStorage();
		this.data.energy = Math.min(this.data.energy, energyStorage);
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slotEnergy"), Math.min(32, energyStorage - this.data.energy), 0);
		
		this.container.setScale("progressScale", this.data.progress);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
	},
	
	getEnergyStorage: function(){
		return this.data.energy_storage;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("massFabricator");
Block.createBlockWithRotation("massFabricator", [
	{name: "Mass Fabricator", texture: [["machine_bottom", 0], ["machine_advanced", 0], ["mass_fab_side", 1], ["mass_fab_front", 0], ["mass_fab_side", 0], ["mass_fab_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.massFabricator);

Block.registerDropFunction("massFabricator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.massFabricator, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['b', BlockID.machineBlockAdvanced, 0, 'x', 348, 0, 'a', ItemID.circuitAdvanced, 0, '#', ItemID.storageLapotronCrystal, -1]);
});

var guiMassFabricator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Mass Fabricator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 850, y: 190, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		"energyScale": {type: "scale", x: 850, y: 190, direction: 1, value: 0.5, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
		"matterSlot": {type: "slot", x: 821, y: 75, size: 100},
		"catalyserSlot": {type: "slot", x: 841, y: 252},
		"textInfo1": {type: "text", x: 542, y: 142, width: 200, height: 30, text: "Progress:"},
		"textInfo2": {type: "text", x: 542, y: 177, width: 200, height: 30, text: "0%"},
		"textInfo3": {type: "text", x: 542, y: 212, width: 200, height: 30, text: " "},
		"textInfo4": {type: "text", x: 542, y: 239, width: 200, height: 30, text: " "},
	}
});


MachineRegistry.registerPrototype(BlockID.massFabricator, {
	defaultValues: {
		progress: 0,
		catalyser: 0,
		catalyserRatio: 0
	},
	
	getGuiScreen: function(){
		return guiMassFabricator;
	},
		
	getTransportSlots: function(){
		return {input: ["catalyserSlot"], output: ["matterSlot"]};
	},
	
	tick: function(){
		var ENERGY_PER_MATTER = 1000000;
		this.container.setScale("energyScale", this.data.energy / this.getEnergyStorage());
		this.container.setText("textInfo2", parseInt(100 * this.data.progress / ENERGY_PER_MATTER) + "%");
		
		if (this.data.catalyser > 0){
			this.container.setText("textInfo3", "Catalyser:");
			this.container.setText("textInfo4", parseInt(this.data.catalyser));
			var transfer = Math.min(this.data.catalyser, this.data.energy);
			this.data.progress += transfer * (this.data.catalyserRatio || 0);
			this.data.energy -= transfer;
			this.data.catalyser -= transfer;
		}
		else{
			this.container.setText("textInfo3", "");
			this.container.setText("textInfo4", "");
			var transfer = Math.min(ENERGY_PER_MATTER - this.data.progress, this.data.energy);
			this.data.progress += transfer;
			this.data.energy -= transfer;
			
			var catalyserSlot = this.container.getSlot("catalyserSlot");
			var catalyserData = MachineRecipeRegistry.getRecipeResult("catalyser", catalyserSlot.id);
			if (catalyserData){
				this.data.catalyser = catalyserData.input;
				this.data.catalyserRatio = catalyserData.output / catalyserData.input;
				catalyserSlot.count--;
				this.container.validateAll();
			}
		}
		
		if (this.data.progress >= ENERGY_PER_MATTER){
			var matterSlot = this.container.getSlot("matterSlot");
			if (matterSlot.id == ItemID.matter && matterSlot.count < 64 || matterSlot.id == 0){
				matterSlot.id = ItemID.matter;
				matterSlot.count++;
				this.data.progress = 0;
			}
			else{
				this.data.progress = ENERGY_PER_MATTER;
			}
		}
	},
	
	getEnergyStorage: function(){
		return 8192;
	},
	
	energyTick: MachineRegistry.basicEnergyReceiveFunc
});


IDRegistry.genBlockID("primalGenerator");
Block.createBlockWithRotation("primalGenerator", [
	{name: "Generator", texture: [["machine_bottom", 1], ["machine_top", 1], ["machine_side", 1], ["generator", 1], ["machine_side", 1], ["machine_side", 1]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.primalGenerator);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		" # ",
		" a "
	], ['#', BlockID.machineBlockBasic, 0, 'a', 61, 0, 'x', ItemID.storageBattery, -1]);
	
	Recipes.addShaped({id: BlockID.primalGenerator, count: 1, data: 0}, [
		" x ",
		"###",
		" a "
	], ['#', ItemID.plateIron, 0, 'a', BlockID.ironFurnace, -1, 'x', ItemID.storageBattery, -1]);
});



var guiGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "fire_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"burningScale": {type: "scale", x: 450, y: 150, direction: 1, value: 0.5, bitmap: "fire_scale", scale: GUI_BAR_STANDART_SCALE},
		"slotnEnergy": {type: "slot", x: 441, y: 75},
		"slotFuel": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.primalGenerator, {
	defaultValues: {
		burn: 0,
		burnMax: 0
	},
	
	getGuiScreen: function(){
		return guiGenerator;
	},
	
	getTransportSlots: function(){
		return {input: ["slotFuel"]};
	},
	
	tick: function(){
		var sourceSlot = this.container.getSlot("slotSource");
		var energyStorage = this.getEnergyStorage();
		
		if(this.data.burn > 0){
			if(this.data.energy < energyStorage){
				this.data.energy = Math.min(this.data.energy + 10, energyStorage);
				this.data.burn--;
			}
		}
		else {
			this.data.burn = this.data.burnMax = this.getFuel("slotFuel") / 4;
		}
		
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slotnEnergy"), this.data.energy, 32, 0);
		
		this.container.setScale("burningScale", this.data.burn / this.data.burnMax || 0);
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", this.data.energy + "/");
		this.container.setText("textInfo2", energyStorage + "");
	},
	
	getFuel: function(slotName){
		var fuelSlot = this.container.getSlot(slotName);
		if (fuelSlot.id > 0){
			var burn = FURNACE_FUEL_MAP[fuelSlot.id];
			if (burn){
				fuelSlot.count--;
				this.container.validateSlot(slotName);
				return burn;
			}
			if (LiquidRegistry.getItemLiquid(fuelSlot.id, fuelSlot.data) == "lava"){
				var empty = LiquidRegistry.getEmptyItem(fuelSlot.id, fuelSlot.data);
				fuelSlot.id = empty.id;
				fuelSlot.data = empty.data;
				return 20000;
			}
		}
		return 0;
	},
	
	isGenerator: function() {
		return true;
	},
	
	getEnergyStorage: function(){
		return 10000;
	},
	
	energyTick: function(type, src){
		var output = Math.min(32, this.data.energy);
		this.data.energy += src.add(output) - output;
	}
});


IDRegistry.genBlockID("geothermalGenerator");
Block.createBlockWithRotation("geothermalGenerator", [
	{name: "Geothermal Generator", texture: [["machine_bottom", 0], ["machine_top", 0], ["machine_side", 0], ["geothermal_generator", 1], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);
ICRenderLib.addConnectionBlock("bc-container", BlockID.geothermalGenerator);
ICRenderLib.addConnectionBlock("bc-fluid", BlockID.geothermalGenerator);

Block.registerDropFunction("geothermalGenerator", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.geothermalGenerator, count: 1, data: 0}, [
		"xax",
		"xax",
		"b#b"
	], ['#', BlockID.primalGenerator, -1, 'a', 111, 1, 'b', ItemID.casingIron, 0, 'x', 20, 0]);
});

var guiGeothermalGenerator = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Geothermal Generator"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		//{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
		{type: "bitmap", x: 450, y: 150, bitmap: "geotermal_liquid_slot", scale: GUI_BAR_STANDART_SCALE}
	],
	
	elements: {
		//"energyScale": {type: "scale", x: 530, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"liquidScale": {type: "scale", x: 450 + GUI_BAR_STANDART_SCALE, y: 150 + GUI_BAR_STANDART_SCALE, direction: 1, value: 0.5, bitmap: "geotermal_empty_liquid_slot", overlay: "geotermal_liquid_slot_overlay", overlayOffset: {x: -GUI_BAR_STANDART_SCALE, y: -GUI_BAR_STANDART_SCALE}, scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 542, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 542, y: 172, width: 300, height: 30, text: "8000 mB"}
	}
});




MachineRegistry.registerPrototype(BlockID.geothermalGenerator, {
	getGuiScreen: function(){
		return guiGeothermalGenerator;
	},
	
	init: function(){
		this.liquidStorage.setLimit("lava", 8);
	},
	
	getTransportSlots: function(){
		return {input: ["slot1"], output: ["slot2"]};
	},
	
	tick: function(){
		this.liquidStorage.updateUiScale("liquidScale", "lava");
		
		var slot1 = this.container.getSlot("slot1");
		var slot2 = this.container.getSlot("slot2");
		var empty = LiquidRegistry.getEmptyItem(slot1.id, slot1.data);
		if(empty && empty.liquid == "lava"){
			if(this.liquidStorage.getAmount("lava") <= 7 && (slot2.id == empty.id && slot2.data == empty.data && slot2.count < Item.getMaxStack(empty.id) || slot2.id == 0)){
				this.liquidStorage.addLiquid("lava", 1);
				slot1.count--;
				slot2.id = empty.id;
				slot2.data = empty.data;
				slot2.count++;
				this.container.validateAll();
			}
		}
		
		this.container.setText("textInfo1", parseInt(this.liquidStorage.getAmount("lava") * 1000) + "/");
	},
	
	isGenerator: function() {
		return true;
	},
	
	energyTick: function(type, src){
		if(this.liquidStorage.getLiquid("lava", 0.001) > 0){
			if(src.add(20) > 0){
				this.liquidStorage.addLiquid("lava", 0.001);
			}
		}
	}
	
});


IDRegistry.genBlockID("solarPanel");
Block.createBlock("solarPanel", [
	{name: "Solar Panel", texture: [["machine_bottom", 0], ["solar_panel", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Block.registerDropFunction("solarPanel", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.solarPanel, count: 1, data: 0}, [
		"aaa",
		"xxx",
		"b#b"
	], ['#', BlockID.machineBlockBasic, 0, 'x', ItemID.dustCoal, 0, 'b', ItemID.circuitBasic, 0, 'a', 20, 0]);
});

MachineRegistry.registerPrototype(BlockID.solarPanel, {
	isGenerator: function() {
		return true;
	},
	
	energyTick: function(type, src){
		if(nativeGetLightLevel(this.x, this.y + 1, this.z) == 15){
			src.add(1);
		}
	}
});


IDRegistry.genBlockID("genWindmill");
Block.createBlockWithRotation("genWindmill", [
	{name: "Wind Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["windmill", 0], ["windmill", 0], ["machine_side", 0], ["machine_side", 0]], inCreative: true}
]);

Block.registerDropFunction("genWindmill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWindmill, count: 1, data: 0}, [
		"x x",
		" # ",
		"x x"
	], ['#', BlockID.primalGenerator, -1, 'x', ItemID.plateSteel, 0]);
});

MachineRegistry.registerPrototype(BlockID.genWindmill, {
	isGenerator: function() {
		return true;
	},
	
	energyTick: function(type, src){
		if(World.getThreadTime()%20 == 0){
			var height = Math.max(0, Math.min(this.y-64, 96)) / 64;
			var output = height * 140;
			var wether = World.getWeather();
			if(wether.thunder){output *= 5;}
			else if(wether.rain){output *= 1.5;}
			var radius = 4;
			if(nativeGetTile(
					this.x - random(-radius, radius),
					this.y - random(-radius, radius),
					this.z - random(-radius, radius)
				) == 0){
				src.addAll(Math.round(output));
			}
		}
	}
});


IDRegistry.genBlockID("genWatermill");
Block.createBlockWithRotation("genWatermill", [
	{name: "Water Mill", texture: [["machine_bottom", 0], ["machine_top", 0], ["watermill", 2], ["watermill", 0], ["watermill", 1], ["watermill", 1]], inCreative: true}
]);

Block.registerDropFunction("genWatermill", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.primalGenerator);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.genWatermill, count: 1, data: 0}, [
		"axa",
		"x#x",
		"axa"
	], ['#', BlockID.primalGenerator, -1, 'x', 5, -1, 'a', 280, 0]);
});


MachineRegistry.registerPrototype(BlockID.genWatermill, {
	isGenerator: function() {
		return true;
	},
	
	biomeCheck: function(x, z){
		var coords = [[x, z], [x-7, z], [x+7, z], [x, z-7], [x, z+7]];
		for(var c in coords){
			var biome = World.getBiome(c[0], c[1]);
			if(biome==0 || biome==24){return "ocean";}
			if(biome==7){return "river";}
		}
		return 0;
	},
	
	energyTick: function(type, src){
		if(World.getThreadTime()%20 == 0){
			var biome = this.biomeCheck(this.x, this.z);
			if(biome && this.y >= 32 && this.y < 64){
				var output = 50;
				var radius = 1;
				var wether = World.getWeather();
				if(wether.thunder && wether.rain){
					if(wether.thunder){output *= 2;}
					else{output *= 1.5;}
				}
				else if(biome=="ocean"){
					output *= 1.5*Math.sin(World.getWorldTime()%6000/(6000/Math.PI));
				}
				var tile = nativeGetTile(
					this.x - random(-radius, radius),
					this.y - random(-radius, radius),
					this.z - random(-radius, radius)
				);
				if(tile == 8 || tile == 9){
					src.addAll(Math.round(output));
				}
			}
		}
	}
});


var ChargeItemRegistry = {
	chargeData: {},
	
	registerItem: function(item, energy, level, preventUncharge, EPD, isTool){
		var power = Math.floor(Math.log10(energy));
		var energyPerDamage = EPD || Math.pow(2, power);
		var maxDamage = Math.floor(energy / energyPerDamage + .999) + 1;
		
		Item.setMaxDamage(item, maxDamage);
		this.chargeData[item] = {
			type: "normal",
			id: item,
			level: level || 0,
			maxDamage: maxDamage,
			maxCharge: energy,
			perDamage: energyPerDamage,
			preventUncharge: preventUncharge,
			isTool: isTool || false
		};
	},
	
	registerFlashItem: function(item, energy, level){
		this.chargeData[item] = {
			type: "flash",
			id: item,
			level: level || 0,
			energy: energy,
		};
	},
	
	getItemData: function(id){
		return this.chargeData[id];
	},
	
	isFlashStorage: function(id){
		var data = this.getItemData(id);
		return data && data.type == "flash";
	},
	
	getEnergyFrom: function(item, amount, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if(!data || data.level > level || data.preventUncharge){
			return 0;
		}
		if(data.type == "flash"){
			if(amount < 1){
				return 0;
			}
			item.count--;
			if(item.count < 1){
				item.id = item.data = 0;
			}
			return data.energy;
		}
		if(item.data < 1){
			item.data = 1;
		}
		
		var damageAdd = Math.min(data.maxDamage - item.data, Math.floor(amount / data.perDamage));
		var energyGot = damageAdd * data.perDamage;
		item.data += damageAdd;
		return energyGot;
	},
	
	addEnergyTo: function(item, energy, transf, level){
		level = level || 0;
		var data = this.getItemData(item.id);
		if(!data || data.type == "flash" || data.level > level){
			return 0;
		}
		
		var damageGot = Math.min(item.data - 1, Math.floor(transf / data.perDamage) || 1);
		var energyAdd = damageGot * data.perDamage;
		if(energy >= energyAdd){
			item.data -= damageGot;
			return energyAdd;
		}
		return 0;
	},
	
	getEnergyStored: function(item){
		var data = this.getItemData(item.id);
		if (!data){
			return 0;
		}
		return  (data.maxDamage - item.data) * data.perDamage;
	}
}

ChargeItemRegistry.registerFlashItem(331, 500, 0); // redstone


IDRegistry.genBlockID("storageBatBox");
Block.createBlockWithRotation("storageBatBox", [
	{name: "BatBox", texture: [["batbox_bottom", 0], ["batbox_top", 0], ["batbox_side", 1], ["batbox_front", 0], ["batbox_side", 0], ["batbox_side", 0]], inCreative: true}
]);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageBatBox, count: 1, data: 0}, [
		"xax",
		"bbb",
		"xxx"
	], ['a', ItemID.cableCopper1, -1, 'x', 5, -1, 'b', ItemID.storageBattery, -1]);
});


var guiBatBox = new UI.StandartWindow({
	standart: {
		header: {text: {text: "Bat-Box"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageBatBox, {
	getGuiScreen: function(){
		return guiBatBox;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage);
		
		var TRANSFER = 32;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 0);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 0);
	},
	
	getEnergyStorage: function(){
		return 40000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 32;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});

ToolAPI.registerBlockMaterial(BlockID.storageBatBox, "wood");


IDRegistry.genBlockID("storageMFE");
Block.createBlockWithRotation("storageMFE", [
	{name: "MFE", texture: [["machine_top", 0], ["machine_top", 0], ["mfe", 2], ["mfe", 0], ["mfe", 1], ["mfe", 1]], inCreative: true}
]);

Block.registerDropFunction("storageMFE", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockBasic);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFE, count: 1, data: 0}, [
		"bab",
		"axa",
		"bab"
	], ['x', BlockID.machineBlockBasic, 0, 'a', ItemID.storageCrystal, -1, 'b', ItemID.cableGold2, 0]);
});


var guiMFE = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFE"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 300, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 300, height: 30, text: "10000"}
	}
});






MachineRegistry.registerPrototype(BlockID.storageMFE, {
	getGuiScreen: function(){
		return guiMFE;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 128;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 1);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 1);
	},
	
	getEnergyStorage: function(){
		return 600000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 128;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});


IDRegistry.genBlockID("storageMFSU");
Block.createBlockWithRotation("storageMFSU", [
	{name: "MFSU", texture: [["mfsu", 0], ["mfsu", 1], ["mfsu", 1], ["mfsu", 2], ["mfsu", 1], ["mfsu", 1]], inCreative: true}
]);

Block.registerDropFunction("storageMFSU", function(coords, blockID, blockData, level){
	return MachineRegistry.getMachineDrop(coords, blockID, BlockID.machineBlockAdvanced);
});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: BlockID.storageMFSU, count: 1, data: 0}, [
		"aca",
		"axa",
		"aba"
	], ['b', BlockID.storageMFE, -1, 'a', ItemID.storageLapotronCrystal, -1, 'x', BlockID.machineBlockAdvanced, 0, 'c', ItemID.circuitAdvanced, 0]);
});


var guiMFSU = new UI.StandartWindow({
	standart: {
		header: {text: {text: "MFSU"}},
		inventory: {standart: true},
		background: {standart: true}
	},
	
	drawing: [
		{type: "bitmap", x: 530, y: 144, bitmap: "energy_bar_background", scale: GUI_BAR_STANDART_SCALE},
	],
	
	elements: {
		"energyScale": {type: "scale", x: 530 + GUI_BAR_STANDART_SCALE * 4, y: 144, direction: 0, value: 0.5, bitmap: "energy_bar_scale", scale: GUI_BAR_STANDART_SCALE},
		"slot1": {type: "slot", x: 441, y: 75},
		"slot2": {type: "slot", x: 441, y: 212},
		"textInfo1": {type: "text", x: 642, y: 142, width: 350, height: 30, text: "0/"},
		"textInfo2": {type: "text", x: 642, y: 172, width: 350, height: 30, text: "10000"}
	}
});




MachineRegistry.registerPrototype(BlockID.storageMFSU, {
	getGuiScreen: function(){
		return guiMFSU;
	},
	
	tick: function(){
		var energyStorage = this.getEnergyStorage();
		this.container.setScale("energyScale", this.data.energy / energyStorage);
		this.container.setText("textInfo1", parseInt(this.data.energy) + "/");
		this.container.setText("textInfo2", energyStorage + "");
		
		var TRANSFER = 512;
		this.data.energy += ChargeItemRegistry.getEnergyFrom(this.container.getSlot("slot2"), Math.min(TRANSFER, energyStorage - this.data.energy), 2);
		this.data.energy -= ChargeItemRegistry.addEnergyTo(this.container.getSlot("slot1"), this.data.energy, TRANSFER, 2);
	},
	
	getEnergyStorage: function(){
		return 10000000;
	},
	
	energyTick: function(type, src){
		var TRANSFER = 512;
		this.data.energy += src.storage(Math.min(TRANSFER*4, this.getEnergyStorage() - this.data.energy), Math.min(TRANSFER, this.data.energy));
	}
});


TileEntity.registerPrototype(BlockID.rubberTreeLog, {	
	addLatex: function(){
		var possibleYs = [];
		var checkY = this.y + 1;
		while (true){
			var block = World.getBlock(this.x, checkY, this.z);
			if (block.id == BlockID.rubberTreeLog){
				possibleYs.push(checkY);
			}
			else if (block.id != BlockID.rubberTreeLogLatex){
				break;
			}
			checkY++;
		}
		
		var randomY = possibleYs[parseInt(Math.random() * possibleYs.length)];
		World.setBlock(this.x, randomY, this.z, BlockID.rubberTreeLogLatex, parseInt(Math.random() * 4));
	},
	
	checkLog: function(){
		var block = World.getBlock(this.x, this.y - 1, this.z);
		if (block.id == BlockID.rubberTreeLog || block.id == BlockID.rubberTreeLogLatex){
			this.selfDestroy();
		}
	},
	
	tick: function(){
		if (World.getThreadTime() % 100 == 0){
			if (Math.random() < .125){
				this.addLatex();
			}
			this.checkLog();
		}
	}
});


var RUBBER_SAPLING_GROUND_TILES = {
	2: true,
	3: true,
	60: true
};

IDRegistry.genItemID("rubberSapling");
Item.createItem("rubberSapling", "Rubber Tree Sapling", {name: "rubber_sapling", data: 0});

Item.registerUseFunction("rubberSapling", function(coords, item, tile){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (GenerationUtils.isTransparentBlock(tile1.id) && RUBBER_SAPLING_GROUND_TILES[tile2.id]){
		World.setBlock(place.x, place.y, place.z, BlockID.rubberTreeSapling);
		World.addTileEntity(place.x, place.y, place.z);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("rubberTreeSapling");
Block.createBlock("rubberTreeSapling", [
	{name: "Rubber Tree Sapling", texture: [["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0], ["empty", 0]], inCreative: false}
], BLOCK_TYPE_LEAVES);

Block.setBlockShape(BlockID.rubberTreeSapling, {x: 0.001, y: 0.001, z: 0.001}, {x: 0.999, y: 0.1, z: 0.999});
Block.registerDropFunction("rubberTreeSapling", function(){
	return [[ItemID.rubberSapling, 1, 0]];
});

TileEntity.registerPrototype(BlockID.rubberTreeSapling, {
	defaultValues: {
		size: 0,
		growth: 0,
		lastGrowth: 0
	},
	
	created: function(){
		this.data.size = .85 + Math.random() * .25;
	},
	
	initAnimation: function(){
		this.animation1 = new Animation.Item(this.x + .5, this.y + this.data.size / 2 - .02, this.z + .5);
		this.animation2 = new Animation.Item(this.x + .5, this.y + this.data.size / 2 - .02, this.z + .5);
		this.animation1.describeItem({
			id: ItemID.rubberSapling,
			count: 1,
			data: 0,
			rotation: "x",
			size: this.data.size
		});
		this.animation1.load();
		
		this.animation2.describeItem({
			id: ItemID.rubberSapling,
			count: 1,
			data: 0,
			rotation: "z",
			size: this.data.size
		});
		this.animation2.load();
	},
	
	destroyAnimation: function(){
		if (this.animation1){
			this.animation1.destroy();
		}
		if (this.animation2){
			this.animation2.destroy();
		}
	},
	
	updateAnimation: function(){
		this.destroyAnimation();
		this.initAnimation();
	},
	
	init: function(){
		this.initAnimation();
	},
	
	destroy: function(){
		this.destroyAnimation();
	},
	
	tick: function(){
		if (World.getThreadTime() % 20 == 0){
			this.data.growth += Math.random() * 2;
			this.checkGrowth();
			if (!RUBBER_SAPLING_GROUND_TILES[World.getBlockID(this.x, this.y - 1, this.z)]){
				World.destroyBlock(this.x, this.y, this.z, true);
				this.selfDestroy();
			}
		}
	},
	
	click: function(id, count, data){
		if (id == 351 && data == 15){
			this.data.growth += 256 + Math.random() * 128;
			this.checkGrowth();
			Player.setCarriedItem(id, count - 1, data);
		}
	},
	
	checkGrowth: function(){
		if (this.data.growth - 56 > this.data.lastGrowth){
			this.data.size += (this.data.growth - this.data.lastGrowth) / 480;
			this.data.lastGrowth = this.data.growth;
			this.updateAnimation();
		}
		if (this.data.growth > 512){
			this.selfDestroy();
			RubberTreeGenerationHelper.generateRubberTree(this.x, this.y, this.z, true);
		}
	}
});


IDRegistry.genItemID("oreCrushedCopper");
Item.createItem("oreCrushedCopper", "Copper Ore", {name: "crushed_ore_copper"});

IDRegistry.genItemID("oreCrushedTin");
Item.createItem("oreCrushedTin", "Tin Ore", {name: "crushed_ore_tin"});

IDRegistry.genItemID("oreCrushedLead");
Item.createItem("oreCrushedLead", "Lead Ore", {name: "crushed_ore_lead"});

IDRegistry.genItemID("uraniumChunk");
Item.createItem("uraniumChunk", "Uranium", {name: "uranium"})


IDRegistry.genItemID("dustCoal");
Item.createItem("dustCoal", "Coal Dust", {name: "dust_coal"});

IDRegistry.genItemID("dustCopper");
Item.createItem("dustCopper", "Copper Dust", {name: "dust_copper"});

IDRegistry.genItemID("dustTin");
Item.createItem("dustTin", "Tin Dust", {name: "dust_tin"});

IDRegistry.genItemID("dustBronze");
Item.createItem("dustBronze", "Bronze Dust", {name: "dust_bronze"});

IDRegistry.genItemID("dustIron");
Item.createItem("dustIron", "Iron Dust", {name: "dust_iron"});

IDRegistry.genItemID("dustGold");
Item.createItem("dustGold", "Gold Dust", {name: "dust_gold"});

IDRegistry.genItemID("dustLead");
Item.createItem("dustLead", "Lead Dust", {name: "dust_lead"});

IDRegistry.genItemID("dustLapis");
Item.createItem("dustLapis", "Lapis Dust", {name: "dust_lapis"});

IDRegistry.genItemID("dustDiamond");
Item.createItem("dustDiamond", "Diamond Dust", {name: "dust_diamond"});

IDRegistry.genItemID("dustEnergium");
Item.createItem("dustEnergium", "Energium Dust", {name: "dust_energium"});

addShapelessRecipe({id: ItemID.dustBronze, count: 4, data: 0}, [{id: ItemID.dustCopper, count: 3, data: 0}, {id: ItemID.dustTin, count: 1, data: 0}]);

Recipes.addShaped({id: ItemID.dustEnergium, count: 9, data: 0}, [
	"xax",
	"axa",
	"xax",
], ['x', 331, 0, 'a', ItemID.dustDiamond, 0]);


IDRegistry.genItemID("ingotCopper");
Item.createItem("ingotCopper", "Copper Ingot", {name: "ingot_copper"});

IDRegistry.genItemID("ingotTin");
Item.createItem("ingotTin", "Tin Ingot", {name: "ingot_tin"});

IDRegistry.genItemID("ingotBronze");
Item.createItem("ingotBronze", "Bronze Ingot", {name: "ingot_bronze"});

IDRegistry.genItemID("ingotSteel");
Item.createItem("ingotSteel", "Steel Ingot", {name: "ingot_steel"});

IDRegistry.genItemID("ingotLead");
Item.createItem("ingotLead", "Lead Ingot", {name: "ingot_lead"});


Callback.addCallback("PreLoaded", function(){
	// steel
	Recipes.addFurnace(265, ItemID.ingotSteel, 0);
	// from dust
	Recipes.addFurnace(ItemID.dustCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.dustTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.dustLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.dustBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.dustIron, 265, 0);
	Recipes.addFurnace(ItemID.dustGold, 266, 0);
	// from plates
	Recipes.addFurnace(ItemID.plateCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.plateTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.plateLead, ItemID.ingotLead, 0);
	Recipes.addFurnace(ItemID.plateBronze, ItemID.ingotBronze, 0);
	Recipes.addFurnace(ItemID.plateIron, 265, 0);
	Recipes.addFurnace(ItemID.plateGold, 266, 0);
	// from ore
	Recipes.addFurnace(ItemID.oreCrushedCopper, ItemID.ingotCopper, 0);
	Recipes.addFurnace(ItemID.oreCrushedTin, ItemID.ingotTin, 0);
	Recipes.addFurnace(ItemID.oreCrushedLead, ItemID.ingotLead, 0);
});


IDRegistry.genItemID("plateCopper");
Item.createItem("plateCopper", "Copper Plate", {name: "plate_copper"});

IDRegistry.genItemID("plateTin");
Item.createItem("plateTin", "Tin Plate", {name: "plate_tin"});

IDRegistry.genItemID("plateBronze");
Item.createItem("plateBronze", "Bronze Plate", {name: "plate_bronze"});

IDRegistry.genItemID("plateIron");
Item.createItem("plateIron", "Iron Plate", {name: "plate_iron"});

IDRegistry.genItemID("plateSteel");
Item.createItem("plateSteel", "Steel Plate", {name: "plate_steel"});

IDRegistry.genItemID("plateGold");
Item.createItem("plateGold", "Gold Plate", {name: "plate_gold"});

IDRegistry.genItemID("plateLead");
Item.createItem("plateLead", "Lead Plate", {name: "plate_lead"});

IDRegistry.genItemID("plateLapis");
Item.createItem("plateLapis", "Lapis Plate", {name: "plate_lapis"});

// recipes
Callback.addCallback("PostLoaded", function(){
	addRecipeWithCraftingTool({id: ItemID.plateCopper, count: 1, data: 0}, [{id: ItemID.ingotCopper, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateTin, count: 1, data: 0}, [{id: ItemID.ingotTin, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateBronze, count: 1, data: 0}, [{id: ItemID.ingotBronze, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateIron, count: 1, data: 0}, [{id: 265, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateSteel, count: 1, data: 0}, [{id: ItemID.ingotSteel, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateGold, count: 1, data: 0}, [{id: 266, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.plateLead, count: 1, data: 0}, [{id: ItemID.ingotLead, data: 0}], ItemID.craftingHammer);
});



IDRegistry.genItemID("casingCopper");
Item.createItem("casingCopper", "Copper Casing", {name: "casing_copper"});

IDRegistry.genItemID("casingTin");
Item.createItem("casingTin", "Tin Casing", {name: "casing_tin"});

IDRegistry.genItemID("casingBronze");
Item.createItem("casingBronze", "Bronze Casing", {name: "casing_bronze"});

IDRegistry.genItemID("casingIron");
Item.createItem("casingIron", "Iron Casing", {name: "casing_iron"});

IDRegistry.genItemID("casingSteel");
Item.createItem("casingSteel", "Steel Casing", {name: "casing_steel"});

IDRegistry.genItemID("casingGold");
Item.createItem("casingGold", "Gold Casing", {name: "casing_gold"});

IDRegistry.genItemID("casingLead");
Item.createItem("casingLead", "Lead Casing", {name: "casing_lead"});

// recipes
Callback.addCallback("PostLoaded", function(){
	addRecipeWithCraftingTool({id: ItemID.casingCopper, count: 2, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingTin, count: 2, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingBronze, count: 2, data: 0}, [{id: ItemID.plateBronze, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingIron, count: 2, data: 0}, [{id: ItemID.plateIron, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingSteel, count: 2, data: 0}, [{id: ItemID.plateSteel, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingGold, count: 2, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingHammer);
	addRecipeWithCraftingTool({id: ItemID.casingLead, count: 2, data: 0}, [{id: ItemID.plateLead, data: 0}], ItemID.craftingHammer);
});


IDRegistry.genItemID("latex");
Item.createItem("latex", "Latex", {name: "latex", data: 0});

IDRegistry.genItemID("rubber");
Item.createItem("rubber", "Rubber", {name: "rubber", data: 0});

Recipes.addFurnace(ItemID.latex, ItemID.rubber, 0);


IDRegistry.genItemID("scrap");
Item.createItem("scrap", "Scrap", {name: "scrap"});

IDRegistry.genItemID("scrapBox");
Item.createItem("scrapBox", "Scrap Box", {name: "scrap_box"});

Recipes.addShaped({id: ItemID.scrapBox, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.scrap, -1]);
	
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrap, {input: 5000, output: 30000});
MachineRecipeRegistry.addRecipeFor("catalyser", ItemID.scrapBox, {input: 45000, output: 270000});

Item.registerUseFunction("scrapBox", function(coords, item, block){
	var drop = getScrapDropItem();
	World.drop(coords.relative.x + 0.5, coords.relative.y + 0.1, coords.relative.z + 0.5, drop.id, 1, drop.data);
	item.count--;
	if(!item.count){item.id = 0;}
	Player.setCarriedItem(item.id, item.count, 0);
});











	
var SCRAP_BOX_RANDOM_DROP = [
	{chance: .1, id: 264, data: 0},
	{chance: 1.8, id: 15, data: 0},
	{chance: 1.0, id: 14, data: 0},
	{chance: 3, id: 331, data: 0},
	{chance: 0.5, id: 348, data: 0},
	{chance: 5, id: 351, data: 15},
	{chance: 2, id: 17, data: 0},
	{chance: 2, id: 6, data: 0},
	{chance: 2, id: 263, data: 0},
	{chance: 3, id: 260, data: 0},
	{chance: 2.1, id: 262, data: 0},
	{chance: 1, id: 354, data: 0},
	{chance: 3, id: 296, data: 0},
	{chance: 5, id: 280, data: 0},
	{chance: 3.5, id: 287, data: 0},
	{chance: 10, id: 3, data: 0},
	{chance: 3, id: 12, data: 0},
	{chance: 3, id: 13, data: 0},
	{chance: 4, id: 2, data: 0},
	{chance: 1.0, id: ItemID.dustIron, data: 0},
	{chance: 0.8, id: ItemID.dustGold, data: 0},
	{chance: 1.2, id: ItemID.dustCopper, data: 0},
	{chance: 1.2, id: ItemID.dustLead, data: 0},
	{chance: 1.2, id: ItemID.dustTin, data: 0},
	{chance: 1.2, id: ItemID.dustCoal, data: 0},
	{chance: 0.4, id: ItemID.dustDiamond, data: 0},
	{chance: 1.0, id: ItemID.casingIron, data: 0},
	{chance: 0.8, id: ItemID.casingGold, data: 0},
	{chance: 1.2, id: ItemID.casingCopper, data: 0},
	{chance: 1.2, id: ItemID.casingLead, data: 0},
	{chance: 1.2, id: ItemID.casingTin, data: 0},
	{chance: 1.2, id: ItemID.casingCoal, data: 0},
	{chance: 0.4, id: ItemID.casingDiamond, data: 0},
	{chance: 2, id: ItemID.rubber, data: 0},
	{chance: 2, id: ItemID.latex, data: 0},
	{chance: 0.4, id: ItemID.uraniumChunk, data: 0},
	{chance: 2.5, id: ItemID.oreCrushedCopper, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedTin, data: 0},
	{chance: 1.5, id: ItemID.oreCrushedLead, data: 0},
];

function getScrapDropItem(){
	var total = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		total += SCRAP_BOX_RANDOM_DROP[i].chance;
	}
	var random = Math.random() * total * 1.4;
	var current = 0;
	for (var i in SCRAP_BOX_RANDOM_DROP){
		var drop = SCRAP_BOX_RANDOM_DROP[i];
		if (current < random && current + drop.chance > random){
			return drop;
		}
		current += drop.chance;
	}
	
	return {id: ItemID.scrap, data: 0};
}


IDRegistry.genItemID("matter");
Item.createItem("matter", "UU-Matter", {name: "uu_matter"});

IDRegistry.genItemID("iridiumChunk");
Item.createItem("iridiumChunk", "Iridium", {name: "iridium"});

IDRegistry.genItemID("plateReinforcedIridium");
Item.createItem("plateReinforcedIridium", "Iridium Reinforced Plate", {name: "plate_reinforced_iridium"});

IDRegistry.genItemID("ingotAlloy");
Item.createItem("ingotAlloy", "Alloy Ingot", {name: "ingot_alloy"});

IDRegistry.genItemID("plateAlloy");
Item.createItem("plateAlloy", "Alloy Plate", {name: "plate_alloy"});

IDRegistry.genItemID("carbonFibre");
Item.createItem("carbonFibre", "Carbon Fibre", {name: "carbon_fibre"});

IDRegistry.genItemID("carbonMesh");
Item.createItem("carbonMesh", "Carbon Mesh", {name: "carbon_mesh"});

IDRegistry.genItemID("carbonPlate");
Item.createItem("carbonPlate", "Carbon Plate", {name: "carbon_plate"});

IDRegistry.genItemID("coalBall");
Item.createItem("coalBall", "Coal Ball", {name: "coal_ball"});

IDRegistry.genItemID("coalBlock");
Item.createItem("coalBlock", "Coal Block", {name: "coal_block"});

IDRegistry.genItemID("coalChunk");
Item.createItem("coalChunk", "Coal Chunk", {name: "coal_chunk"});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.ingotAlloy, count: 2, data: 0}, [
		"aaa",
		"bbb",
		"ccc"
	], ['a', ItemID.plateSteel, 0, 'b', ItemID.plateBronze, 0, 'c', ItemID.plateTin, 0]);
	
	Recipes.addShaped({id: ItemID.carbonFibre, count: 1, data: 0}, [
		"xx",
		"xx"
	], ['x', ItemID.dustCoal, 0]);
	
	Recipes.addShaped({id: ItemID.carbonMesh, count: 1, data: 0}, [
		"x",
		"x"
	], ['x', ItemID.carbonFibre, 0]);
	
	Recipes.addShaped({id: ItemID.coalBall, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.dustCoal, 0, '#', 318, 0]);
	
	Recipes.addShaped({id: ItemID.coalChunk, count: 1, data: 0}, [
		"xxx",
		"x#x",
		"xxx"
	], ['x', ItemID.coalBlock, -1, '#', 49, -1]);
	
	Recipes.addShaped({id: ItemID.plateReinforcedIridium, count: 1, data: 0}, [
		"xax",
		"a#a",
		"xax"
	], ['x', ItemID.iridiumChunk, 0, '#', 264, 0, 'a', ItemID.plateAlloy, 0]);
	
	
	// uu-matter
	Recipes.addShaped({id: ItemID.iridiumChunk, count: 1, data: 0}, [
		"xxx",
		" x ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 17, count: 8, data: 0}, [
		" x ",
		"   ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 1, count: 16, data: 0}, [
		"   ",
		" x ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 80, count: 16, data: 0}, [
		"x x",
		"   ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 2, count: 16, data: 0}, [
		"   ",
		"x  ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 49, count: 12, data: 0}, [
		"x x",
		"x x",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 20, count: 32, data: 0}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 32, data: 3}, [
		"xx ",
		"  x",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 348, count: 32, data: 0}, [
		" x ",
		"x x",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 81, count: 48, data: 0}, [
		" x ",
		"xxx",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 338, count: 48, data: 0}, [
		"x x",
		"x x",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 106, count: 24, data: 0}, [
		"x  ",
		"x  ",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 332, count: 48, data: 0}, [
		"   ",
		"   ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 337, count: 48, data: 0}, [
		"xx ",
		"x  ",
		"xx "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 111, count: 64, data: 0}, [
		"x x",
		" x ",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 289, count: 16, data: 0}, [
		"xxx",
		"x  ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 288, count: 32, data: 0}, [
		" x ",
		" x ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 48, data: 0}, [
		" xx",
		" xx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 263, count: 5, data: 0}, [
		"x  ",
		"  x",
		"x  "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 15, count: 2, data: 0}, [
		"x x",
		" x ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 14, count: 2, data: 0}, [
		" x ",
		"xxx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 331, count: 24, data: 0}, [
		"   ",
		" x ",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 351, count: 9, data: 4}, [
		" x ",
		" x ",
		" xx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 1, count: 16, data: 0}, [
		"   ",
		" x ",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 388, count: 2, data: 0}, [
		"xxx",
		"xxx",
		" x "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: 264, count: 1, data: 0}, [
		"xxx",
		"xxx",
		"xxx"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.latex, count: 21, data: 0}, [
		"x x",
		"   ",
		"x x"
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.dustCopper, count: 10, data: 0}, [
		"  x",
		"x x",
		"   "
	], ['x', ItemID.matter, -1]);
	
	Recipes.addShaped({id: ItemID.dustTin, count: 10, data: 0}, [
		"   ",
		"x x",
		"  x"
	], ['x', ItemID.matter, -1]);
});


IDRegistry.genItemID("cableTin0");
IDRegistry.genItemID("cableTin1");
Item.createItem("cableTin0", "Tin Cable", {name: "cable_tin", meta: 0});
Item.createItem("cableTin1", "Tin Cable (insulated)", {name: "cable_tin", meta: 1});

IDRegistry.genItemID("cableCopper0");
IDRegistry.genItemID("cableCopper1");
Item.createItem("cableCopper0", "Copper Cable", {name: "cable_copper", meta: 0});
Item.createItem("cableCopper1", "Copper Cable (insulated)", {name: "cable_copper", meta: 1});

IDRegistry.genItemID("cableGold0");
IDRegistry.genItemID("cableGold2");
Item.createItem("cableGold0", "Gold Cable", {name: "cable_gold", meta: 0});
Item.createItem("cableGold2", "Gold Cable (insulated x2)", {name: "cable_gold", meta: 2});

IDRegistry.genItemID("cableIron0");
IDRegistry.genItemID("cableIron3");
Item.createItem("cableIron0", "HV Cable", {name: "cable_iron", meta: 0});
Item.createItem("cableIron3", "HV Cable (insulated x3)", {name: "cable_iron", meta: 3});

IDRegistry.genItemID("cableOptic");
Item.createItem("cableOptic", "Glass Fibre Cable", {name: "cable_optic", meta: 0});

Recipes.addShaped({id: ItemID.cableOptic, count: 4, data: 0}, [
	"aaa",
	"xxx",
	"aaa"
], ['x', ItemID.dustEnergium, 0, 'a', 20, 0]);

// cutting recipes
Callback.addCallback("PostLoaded", function(){
	addRecipeWithCraftingTool({id: ItemID.cableTin0, count: 3, data: 0}, [{id: ItemID.plateTin, data: 0}], ItemID.craftingCutter);
	addRecipeWithCraftingTool({id: ItemID.cableCopper0, count: 3, data: 0}, [{id: ItemID.plateCopper, data: 0}], ItemID.craftingCutter);
	addRecipeWithCraftingTool({id: ItemID.cableGold0, count: 4, data: 0}, [{id: ItemID.plateGold, data: 0}], ItemID.craftingCutter);
});

// isolation recipes
addShapelessRecipe({id: ItemID.cableTin1, count: 1, data: 0}, [{id: ItemID.cableTin0, count: 1, data: 0}, {id: ItemID.rubber, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.cableCopper1, count: 1, data: 0}, [{id: ItemID.cableCopper0, count: 1, data: 0}, {id: ItemID.rubber, count: 1, data: 0}]);
addShapelessRecipe({id: ItemID.cableGold2, count: 1, data: 0}, [{id: ItemID.cableGold0, count: 1, data: 0}, {id: ItemID.rubber, count: 2, data: 0}]);
addShapelessRecipe({id: ItemID.cableIron3, count: 1, data: 0}, [{id: ItemID.cableIron0, count: 1, data: 0}, {id: ItemID.rubber, count: 3, data: 0}]);


// place funcs 
Item.registerUseFunction("cableTin1", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableTin);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableCopper1", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableCopper);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableGold2", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableGold);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableIron3", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableIron);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});

Item.registerUseFunction("cableOptic", function(coords, item, block){
	var place = coords.relative;
	if(GenerationUtils.isTransparentBlock(World.getBlockID(place.x, place.y, place.z))){
		World.setBlock(place.x, place.y, place.z, BlockID.cableOptic);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		EnergyTypeRegistry.onWirePlaced();
	}
});


Item.setStackedByData(111, true),
ModAPI.requireGlobal("ModPE.langEdit('tile.waterlily.name', ' ')");
Translation.addTranslation("Waterlily", {ru: "Кувшинка"});

IDRegistry.genItemID("cellEmpty");
IDRegistry.genItemID("cellWater");
IDRegistry.genItemID("cellLava");
Item.createItem("cellEmpty", "Cell", {name: "cell_empty"});
Item.createItem("cellWater", "Water Cell", {name: "cell_water"});
Item.createItem("cellLava", "Lava Cell", {name: "cell_lava"});
LiquidRegistry.registerItem("water", {id: 111, data: 1}, {id: ItemID.cellWater, data: 0});
LiquidRegistry.registerItem("lava", {id: 111, data: 1}, {id: ItemID.cellLava, data: 0});

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: 111, count: 2, data: 1}, [
		" x ",
		"x x",
		" x "
	], ['x', ItemID.casingTin, 0]);
});

Item.registerUseFunctionForID(111, function(coords, item, block){
	if(item.data==1){
		Game.prevent();
		if(block.id==9 || block.id==11){
			World.setBlock(coords.x, coords.y, coords.z, 0);
			var item = Player.getCarriedItem();
			item.count--;
			if(!item.count) item.id = 0;
			Player.setCarriedItem(item.id, item.count, 1);
			if(block.id==9){Player.addItemToInventory(ItemID.cellWater, 1);}
			else{Player.addItemToInventory(ItemID.cellLava, 1);}
		}
	}
});
/*
Callback.addCallback("ItemUse", function(coords, item, block){
	if(item.id==ItemID.cellWater || item.id==ItemID.cellLava){
		var x = coords.relative.x
		var y = coords.relative.y
		var z = coords.relative.z
		var block = nativeGetTile(x,y,z)
		if(block==0){
			if(item.id==ItemID.cellWater){World.setBlock(x, y, z, 9);}
			else{World.setBlock(x, y, z, 11);}
			var item = Player.getCarriedItem();
			item.count--;
			if(!item.count) item.id = 0;
			Player.setCarriedItem(item.id, item.count, item.data);
			Player.addItemToInventory(111, 1, 1);
		}
	}
});
*/

Callback.addCallback("tick", function(){
	var item = Player.getCarriedItem();
	if(item.id==111){
		if(item.data==1){Game.tipMessage("\n\n\n\n"+Translation.translate("Cell"));}
		else{Game.tipMessage("\n\n\n\n"+Translation.translate("Waterlily"));}
	}
	if(item.id==ItemID.cellEmpty){
		Player.setCarriedItem(111, item.count, 1);
	}
});


IDRegistry.genItemID("storageBattery");
Item.setElectricItem("storageBattery", "Battery", {name: "re_battery", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageBattery, 10000, 0);

IDRegistry.genItemID("storageCrystal");
Item.setElectricItem("storageCrystal", "Energy Crystal", {name: "energy_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageCrystal, 100000, 1);

IDRegistry.genItemID("storageLapotronCrystal");
Item.setElectricItem("storageLapotronCrystal", "Lapotron Crystal", {name: "lapotron_crystal", meta: 0}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.storageLapotronCrystal, 1000000, 2);

IDRegistry.genItemID("debugItem");
Item.createItem("debugItem", "debug.item", {name: "debug_item", meta: 0});
//ChargeItemRegistry.registerItem(ItemID.debugItem, Infinity, Infinity, true, Infinity);

IDRegistry.genItemID("circuitBasic");
IDRegistry.genItemID("circuitAdvanced");
Item.createItem("circuitBasic", "Circuit", {name: "circuit", meta: 0});
Item.createItem("circuitAdvanced", "Advanced Circuit", {name: "circuit", meta: 1});

IDRegistry.genItemID("coil");
IDRegistry.genItemID("electricMotor");
IDRegistry.genItemID("powerUnit");
IDRegistry.genItemID("powerUnitSmall");
Item.createItem("coil", "Coil", {name: "coil", meta: 0});
Item.createItem("electricMotor", "Electric Motor", {name: "motor", meta: 0});
Item.createItem("powerUnit", "Power Unit", {name: "power_unit", meta: 0});
Item.createItem("powerUnitSmall", "Small Power Unit", {name: "power_unit_small", meta: 0});

IDRegistry.genItemID("toolbox");
Item.createItem("toolbox", "Tool Box", {name: "toolbox", meta: 0});


var RECIPE_FUNC_TRANSPORT_ENERGY = function(api, field, result){
	var energy = 0;
	for(var i in field){
		if(!ChargeItemRegistry.isFlashStorage(field[i].id)){
			energy += ChargeItemRegistry.getEnergyFrom(field[i], 10000000, 3);
		}
		api.decreaseFieldSlot(i);
	}
	ChargeItemRegistry.addEnergyTo(result, energy, energy, 3);
}

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.storageBattery, count: 1, data: Item.getMaxDamage(ItemID.storageBattery)}, [
		" x ",
		"a#a",
		"a#a"
	], ['x', ItemID.cableCopper1, 0, 'a', ItemID.casingTin, 0, '#', 331, 0]);
	
	Recipes.addShaped({id: ItemID.storageLapotronCrystal, count: 1, data: Item.getMaxDamage(ItemID.storageLapotronCrystal)}, [
		"x#x",
		"xax",
		"x#x"
	], ['a', ItemID.storageCrystal, -1, 'x', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
	
	
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xxx",
		"a#a",
		"xxx"
	], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
	Recipes.addShaped({id: ItemID.circuitBasic, count: 1, data: 0}, [
		"xax",
		"x#x",
		"xax"
	], ['x', ItemID.cableCopper1, 0, 'a', 331, 0, '#', ItemID.plateIron, 0]);
	
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xbx",
		"a#a",
		"xbx"
	], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
	Recipes.addShaped({id: ItemID.circuitAdvanced, count: 1, data: 0}, [
		"xax",
		"b#b",
		"xax"
	], ['x', 331, 0, 'a', 348, 0, 'b', ItemID.dustLapis, 0, '#', ItemID.circuitBasic, 0]);
	
	
	Recipes.addShaped({id: ItemID.coil, count: 1, data: 0}, [
		"aaa",
		"axa",
		"aaa"
	], ['x', 265, 0, 'a', ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.electricMotor, count: 1, data: 0}, [
		" b ",
		"axa",
		" b "
	], ['x', 265, 0, 'a', ItemID.coil, 0, 'b', ItemID.casingTin, 0]);
	
	Recipes.addShaped({id: ItemID.powerUnit, count: 1, data: 0}, [
		"acs",
		"axe",
		"acs"
	], ["x", ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  "a", ItemID.storageBattery, -1, "s", ItemID.casingIron, 0, "c", ItemID.cableCopper0, 0]);
	Recipes.addShaped({id: ItemID.powerUnitSmall, count: 1, data: 0}, [
		" cs",
		"axe",
		" cs"
	], ["x", ItemID.circuitBasic, 0, 'e', ItemID.electricMotor, 0,  "a", ItemID.storageBattery, -1, "s", ItemID.casingIron, 0, "c", ItemID.cableCopper0, 0]);

	Recipes.addShaped({id: ItemID.toolbox, count: 1, data: 0}, [
		"axa",
		"aaa",
	], ['x', 54, 0, 'a', ItemID.casingBronze, 0]);
});

Item.registerUseFunction("debugItem", function(coords, item, block){
	var machine = EnergyTileRegistry.accessMachineAtCoords(coords.x, coords.y, coords.z);
	if(machine){
		for(var i in machine.data){
			if(i != "energy_storage"){
				if(i == "energy"){
				Game.message(i + ": " + machine.data[i] + "/" + machine.getEnergyStorage() + "\n");}
				else{
				Game.message(i + ": " + machine.data[i] + "\n");}
			}
		}
	}
});


IDRegistry.genItemID("upgradeOverclocker");
Item.createItem("upgradeOverclocker", "Overclocker Upgrade", {name: "upgrade_overclocker", meta: 0}, {stack: 16});

IDRegistry.genItemID("upgradeEnergyStorage");
Item.createItem("upgradeEnergyStorage", "Energy Storage Upgrade", {name: "upgrade_energy_storage", meta: 0});

//IDRegistry.genItemID("upgradeTransformer");
//Item.createItem("upgradeTransformer", "Transformer Upgrade", {name: "upgrade_transformer", meta: 0});

IDRegistry.genItemID("upgradeRedstone");
Item.createItem("upgradeRedstone", "Redstone Signal Inverter Upgrade", {name: "upgrade_redstone_inv", meta: 0});

IDRegistry.genItemID("upgradePulling");
IDRegistry.genItemID("upgradePulling1");
IDRegistry.genItemID("upgradePulling2");
IDRegistry.genItemID("upgradePulling3");
IDRegistry.genItemID("upgradePulling4");
IDRegistry.genItemID("upgradePulling5");
IDRegistry.genItemID("upgradePulling6");
Item.createItem("upgradePulling", "Pulling Upgrade", {name: "upgrade_pulling", meta: 0});
Item.createItem("upgradePulling1", "Pulling Upgrade", {name: "upgrade_pulling", meta: 1}, {isTech: true});
Item.createItem("upgradePulling2", "Pulling Upgrade", {name: "upgrade_pulling", meta: 2}, {isTech: true});
Item.createItem("upgradePulling3", "Pulling Upgrade", {name: "upgrade_pulling", meta: 3}, {isTech: true});
Item.createItem("upgradePulling4", "Pulling Upgrade", {name: "upgrade_pulling", meta: 4}, {isTech: true});
Item.createItem("upgradePulling5", "Pulling Upgrade", {name: "upgrade_pulling", meta: 5}, {isTech: true});
Item.createItem("upgradePulling6", "Pulling Upgrade", {name: "upgrade_pulling", meta: 6}, {isTech: true});

IDRegistry.genItemID("upgradeEjector");
IDRegistry.genItemID("upgradeEjector1");
IDRegistry.genItemID("upgradeEjector2");
IDRegistry.genItemID("upgradeEjector3");
IDRegistry.genItemID("upgradeEjector4");
IDRegistry.genItemID("upgradeEjector5");
IDRegistry.genItemID("upgradeEjector6");
Item.createItem("upgradeEjector", "Ejector Upgrade", {name: "upgrade_ejector", meta: 0});
Item.createItem("upgradeEjector1", "Ejector Upgrade", {name: "upgrade_ejector", meta: 1}, {isTech: true});
Item.createItem("upgradeEjector2", "Ejector Upgrade", {name: "upgrade_ejector", meta: 2}, {isTech: true});
Item.createItem("upgradeEjector3", "Ejector Upgrade", {name: "upgrade_ejector", meta: 3}, {isTech: true});
Item.createItem("upgradeEjector4", "Ejector Upgrade", {name: "upgrade_ejector", meta: 4}, {isTech: true});
Item.createItem("upgradeEjector5", "Ejector Upgrade", {name: "upgrade_ejector", meta: 5}, {isTech: true});
Item.createItem("upgradeEjector6", "Ejector Upgrade", {name: "upgrade_ejector", meta: 6}, {isTech: true});

IDRegistry.genItemID("upgradeFluidEjector");
IDRegistry.genItemID("upgradeFluidEjector1");
IDRegistry.genItemID("upgradeFluidEjector2");
IDRegistry.genItemID("upgradeFluidEjector3");
IDRegistry.genItemID("upgradeFluidEjector4");
IDRegistry.genItemID("upgradeFluidEjector5");
IDRegistry.genItemID("upgradeFluidEjector6");
Item.createItem("upgradeFluidEjector", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 0});
Item.createItem("upgradeFluidEjector1", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 1}, {isTech: true});
Item.createItem("upgradeFluidEjector2", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 2}, {isTech: true});
Item.createItem("upgradeFluidEjector3", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 3}, {isTech: true});
Item.createItem("upgradeFluidEjector4", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 4}, {isTech: true});
Item.createItem("upgradeFluidEjector5", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 5}, {isTech: true});
Item.createItem("upgradeFluidEjector6", "Fluid Ejector Upgrade", {name: "upgrade_fluid_ejector", meta: 6}, {isTech: true});


Recipes.addShaped({id: ItemID.upgradeOverclocker, count: 1, data: 0}, [
	"aaa",
	"x#x",
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', ItemID.cellWater, 0]);

Recipes.addShaped({id: ItemID.upgradeEnergyStorage, count: 1, data: 0}, [
	"aaa",
	"x#x",
	"aca"
], ['#', ItemID.storageBattery, -1, 'x', ItemID.cableCopper1, 0, 'a', 5, -1, 'c', ItemID.circuitBasic, 0]);

Recipes.addShaped({id: ItemID.upgradeRedstone, count: 1, data: 0}, [
	"x x",
	" # ",
	"x x",
], ['x', ItemID.plateTin, 0, '#', 69, -1]);

Recipes.addShaped({id: ItemID.upgradePulling, count: 1, data: 0}, [
	"aba",
	"x#x",
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 29, -1, 'b', 410, 0]);

Recipes.addShaped({id: ItemID.upgradeEjector, count: 1, data: 0}, [
	"aba",
	"x#x",
], ['#', ItemID.circuitBasic, 0, 'x', ItemID.cableCopper1, 0, 'a', 33, -1, 'b', 410, 0]);

Recipes.addShaped({id: ItemID.upgradeFluidEjector, count: 1, data: 0}, [
	"x x",
	" # ",
	"x x",
], ['x', ItemID.plateTin, 0, '#', ItemID.electricMotor, 0]);


function PULLING_UPGRADE_FUNC(machine, container, data, coords, direction){
	if(World.getThreadTime()%20 == 0){
		var items = [];
		for(var slotName in container.slots){
			if(slotName.match(/Source/)){
				var item = container.getSlot(slotName);
				if(item.count < 64){items.push(item);}
			}
		}
		if(items.length){
			var containers = UpgradeAPI.findNearestContainers(coords, direction);
			getItemsFrom(items, containers);
		}
	}
}

function EJECTOR_UPGRADE_FUNC(machine, container, data, coords, direction){
	var items = [];
	for(var slotName in container.slots){
		if(slotName.match(/Result/)){
			var item = container.getSlot(slotName);
			if(item.id){items.push(item);}
		}
	}
	if(items.length){
		var containers = UpgradeAPI.findNearestContainers(coords, direction);
		addItemsToContainers(items, containers);
	}
}

function addItemsToContainers(items, containers){
	for(var i in items){
		for(var c in containers){
			var container = containers[c];
			var item = items[i];
			container.refreshSlots();
			var tileEntity = container.tileEntity;
			var slots = [];
			var slotsInitialized = false;
			
			if(tileEntity){
				if(tileEntity.addTransportedItem){
					tileEntity.addTransportedItem({}, item, {});
					continue;
				}
				if(tileEntity.getTransportSlots){
					slots = tileEntity.getTransportSlots().input || [];
					slotsInitialized = true;
				}
			}
			if(!slotsInitialized){
				for(var name in container.slots){
					slots.push(name);
				}
			}
			for(var i in slots){
				var slot = container.getSlot(slots[i]);
				if(item.count <= 0){
					break;
				}
				if(slot.id == 0 || slot.id == item.id && slot.data == item.data){
					var maxstack = slot.id > 0 ? Item.getMaxStack(slot.id) : 64;
					var add = Math.min(maxstack - slot.count, item.count);
					item.count -= add;
					slot.count += add;
					slot.id = item.id;
					slot.data = item.data;
				}
			}
			container.applyChanges();
			
			if(item.count==0){
				item.id = 0;
				item.data = 0;
				break;
			}
		}
	}
}

function getItemsFrom(items, containers){
	for(var i in items){
		var item = items[i];
		for(var c in containers){
			var container = containers[c];
			container.refreshSlots();
			var tileEntity = container.tileEntity;
			var slots = [];
			var slotsInitialized = false;
			
			if(tileEntity && tileEntity.getTransportSlots){
				slots = tileEntity.getTransportSlots().output || [];
				slotsInitialized = true;
			}
			if(!slotsInitialized){
				for(var name in container.slots){
					slots.push(name);
				}
			}
			for(var i in slots){
				var slot = container.getSlot(slots[i]);
				if(slot.id > 0 && (item.id == 0 || item.id == slot.id && item.data == slot.data)){
					var add = Math.min(64 - item.count, slot.count);
					slot.count -= add;
					item.count += add;
					item.id = slot.id;
					item.data = slot.data;
				}
			}
			container.validateAll();
			container.applyChanges();
			if(item.count==64){break;}
		}
	}
}

UpgradeAPI.registerUpgrade(ItemID.upgradeOverclocker, function(count, machine, container, data, coords){
	if(data.work_time){
		data.energy_consumption = Math.round(data.energy_consumption * Math.pow(1.6, count));
		data.work_time = Math.round(data.work_time * Math.pow(0.7, count));
	}
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEnergyStorage, function(count, machine, container, data, coords){
	data.energy_storage += 10000 * count;
});

UpgradeAPI.registerUpgrade(ItemID.upgradePulling, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords);
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling1, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords, "down");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling2, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords, "up");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling3, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords, "north");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling4, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords, "south");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling5, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords, "west");
});
UpgradeAPI.registerUpgrade(ItemID.upgradePulling6, function(count, machine, container, data, coords){
	PULLING_UPGRADE_FUNC(machine, container, data, coords, "east");
});

UpgradeAPI.registerUpgrade(ItemID.upgradeEjector, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords);
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector1, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords, "down");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector2, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords, "up");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector3, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords, "north");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector4, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords, "south");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector5, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords, "west");
});
UpgradeAPI.registerUpgrade(ItemID.upgradeEjector6, function(count, machine, container, data, coords){
	EJECTOR_UPGRADE_FUNC(machine, container, data, coords, "east");
});

Item.registerUseFunction("upgradeEjector", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradeEjector" + (coords.side+1)], item.count);
});
Item.registerUseFunction("upgradeEjector1", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
Item.registerUseFunction("upgradeEjector2", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
Item.registerUseFunction("upgradeEjector3", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
Item.registerUseFunction("upgradeEjector4", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
Item.registerUseFunction("upgradeEjector5", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});
Item.registerUseFunction("upgradeEjector6", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeEjector, item.count);
});

Item.registerUseFunction("upgradePulling", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradePulling" + (coords.side+1)], item.count);
});
Item.registerUseFunction("upgradePulling1", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
Item.registerUseFunction("upgradePulling2", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
Item.registerUseFunction("upgradePulling3", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
Item.registerUseFunction("upgradePulling4", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
Item.registerUseFunction("upgradePulling5", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});
Item.registerUseFunction("upgradePulling6", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradePulling, item.count);
});

Item.registerUseFunction("upgradeFluidEjector", function(coords, item, block){
	Player.setCarriedItem(ItemID["upgradeFluidEjector" + (coords.side+1)], item.count);
});
Item.registerUseFunction("upgradeFluidEjector1", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
Item.registerUseFunction("upgradeFluidEjector2", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
Item.registerUseFunction("upgradeFluidEjector3", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
Item.registerUseFunction("upgradeFluidEjector4", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
Item.registerUseFunction("upgradeFluidEjector5", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});
Item.registerUseFunction("upgradeFluidEjector6", function(coords, item, block){
	Player.setCarriedItem(ItemID.upgradeFluidEjector, item.count);
});


IDRegistry.genItemID("bronzeHelmet");
IDRegistry.genItemID("bronzeChestplate");
IDRegistry.genItemID("bronzeLeggings");
IDRegistry.genItemID("bronzeBoots");

Item.createArmorItem("bronzeHelmet", "Bronze Helmet", {name: "armor_bronze_helmet"}, {type: "helmet", armor: 2, durability: 149, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeChestplate", "Bronze Chestplate", {name: "armor_bronze_chestplate"}, {type: "chestplate", armor: 6, durability: 216, texture: "armor/bronze_1.png"});
Item.createArmorItem("bronzeLeggings", "Bronze Leggings", {name: "armor_bronze_leggings"}, {type: "leggings", armor: 5, durability: 203, texture: "armor/bronze_2.png"});
Item.createArmorItem("bronzeBoots", "Bronze Boots", {name: "armor_bronze_boots"}, {type: "boots", armor: 2, durability: 176, texture: "armor/bronze_1.png"});

Recipes.addShaped({id: ItemID.bronzeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);

Recipes.addShaped({id: ItemID.bronzeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.ingotBronze, 0]);


IDRegistry.genItemID("compositeHelmet");
IDRegistry.genItemID("compositeChestplate");
IDRegistry.genItemID("compositeLeggings");
IDRegistry.genItemID("compositeBoots");

Item.createArmorItem("compositeHelmet", "Composite Helmet", {name: "armor_composite_helmet"}, {type: "helmet", armor: 3, durability: 330, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeChestplate", "Composite Chestplate", {name: "armor_composite_chestplate"}, {type: "chestplate", armor: 8, durability: 480, texture: "armor/composite_1.png"});
Item.createArmorItem("compositeLeggings", "Composite Leggings", {name: "armor_composite_leggings"}, {type: "leggings", armor: 6, durability: 450, texture: "armor/composite_2.png"});
Item.createArmorItem("compositeBoots", "Composite Boots", {name: "armor_composite_boots"}, {type: "boots", armor: 3, durability: 390, texture: "armor/composite_1.png"});

Recipes.addShaped({id: ItemID.compositeHelmet, count: 1, data: 0}, [
	"xxx",
	"x x"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeChestplate, count: 1, data: 0}, [
	"x x",
	"xxx",
	"xxx"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeLeggings, count: 1, data: 0}, [
	"xxx",
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0]);

Recipes.addShaped({id: ItemID.compositeBoots, count: 1, data: 0}, [
	"x x",
	"x x"
], ['x', ItemID.plateAlloy, 0]);


var currentUIscreen;
Callback.addCallback("NativeGuiChanged", function(screenName){
	currentUIscreen = screenName;
});

var UIbuttons = {
	isEnabled: false,
	nightvision: false,
	container: null,
	Window: new UI.Window({
		location: {
			x: 940,
			y: UI.getScreenHeight()/2-75,
			width: 60,
			height: 180
		},
		drawing: [{type: "background", color: 0}],
		elements: {}
	}),
	
	enableButton: function(name){
		this.isEnabled = true;
		buttonMap[name] = true;
	},
	registerButton: function(name, properties){
		buttonContent[name] = properties;
	}
}

var buttonMap = {
	button_nightvision: false,
	button_fly: false,
	button_jump: false,
}

function updateUIbuttons(){
	var buttonContent = {
		button_nightvision: {
			y: 0,
			type: "button",
			bitmap: "button_nightvision_on",
			bitmap2: "button_nightvision_off",
			scale: 50,
			clicker: {
				onClick: function(){
					if(UIbuttons.nightvision){
						UIbuttons.nightvision = false;
						Game.message("§4Nightvision mode disabled");
					}
					else{
						UIbuttons.nightvision = true;
						Game.message("§2Nightvision mode enabled");
					}
				}
			}
		},
		button_fly: {
			y: 1000,
			type: "button",
			bitmap: "button_fly_on",
			bitmap2: "button_fly_off",
			scale: 50
		},
		button_jump: {
			y: 2000,
			type: "button",
			bitmap: "button_jump_on",
			bitmap2: "button_jump_off",
			scale: 50,
			clicker: {
				onClick: function(){
					var armor = Player.getArmorSlot(3);
					if(Item.getMaxDamage(armor.id) - armor.data >= 8 && Math.abs(Player.getVelocity().y + 0.078) < 0.01){
						Player.addVelocity(0, 1.4, 0);
						Player.setArmorSlot(3, armor.id, armor.data+8);
					}
				}
			}
		}
	}
	var elements = UIbuttons.Window.content.elements;
	for(var name in buttonMap){
		if(buttonMap[name]){
			if(!elements[name]){
				elements[name] = buttonContent[name];
				elements[name].x = 0;
			}
		}
		else{
			elements[name] = null;
		}
	}
}

Callback.addCallback("tick", function(){
	updateUIbuttons();
	if(UIbuttons.isEnabled){
		if(!UIbuttons.container){
			UIbuttons.container = new UI.Container();
			UIbuttons.container.openAs(UIbuttons.Window);
		}
		if(UIbuttons.container.isElementTouched("button_fly")){
			var armor = Player.getArmorSlot(1);
			var perDamage = ChargeItemRegistry.chargeData[armor.id].perDamage
			var y = Player.getPosition().y
			if(armor.data < Item.getMaxDamage(armor.id)-4 && y < 256){ 
				if(World.getThreadTime() % (perDamage/5) == 0){
				Player.setArmorSlot(1, armor.id, armor.data+1);}
				var vel = Player.getVelocity();
				var vy = Math.min(32, 264-y) / 160;
				if(vel.y < 0.67){
					Player.addVelocity(0, Math.min(vy, 0.67-vel.y), 0);
				}
			}
		}
	}
	for(var name in buttonMap){
		buttonMap[name] = false;
	}
	UIbuttons.isEnabled = false;
});

Callback.addCallback("LevelLeft", function(){
	if(UIbuttons.container){
		var elements = UIbuttons.Window.content.elements;
		for(var i in elements){
			elements[i] = null;
		}
	}
});


IDRegistry.genItemID("nightvisionGoggles");
Item.createArmorItem("nightvisionGoggles", "Nightvision Goggles", {name: "armor_nightvision"}, {type: "helmet", armor: 1, durability: 30000, texture: "armor/nightvision_1.png", isTech: true});
Player.addItemCreativeInv(ItemID.nightvisionGoggles, 1, 1);
ChargeItemRegistry.registerItem(ItemID.nightvisionGoggles, 30000, 0, true, 1);

Callback.addCallback("PostLoaded", function(){
	Recipes.addShaped({id: ItemID.nightvisionGoggles, count: 1, data: 30000}, [
		"bbb",
		"aca",
		"i i"
	], ['a', 102, 0, 'b', ItemID.storageBattery, -1, 'c', ItemID.circuitAdvanced, 0, "i", ItemID.casingIron, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
});

var nightVisionEnabled = false;

Armor.registerFuncs("nightvisionGoggles", {
	maxDamage: 30000,
	tick: function(slot, inventory){
		UIbuttons.enableButton("button_nightvision");
		if(slot.data > this.maxDamage - 5){
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			if(UIbuttons.nightvision){
				if(World.getThreadTime()%4==0){slot.data++;Game.message(slot.data);}
				var coords = Player.getPosition();
				if(nativeGetLightLevel(coords.x, coords.y, coords.z)==15){
					Entity.addEffect(player, MobEffect.blindness, 25, 1);
				}
				Entity.addEffect(player, MobEffect.nightVision, 225, 1);
				return true;
			}
			return false;
		}
	}
});


IDRegistry.genItemID("nanoHelmet");
IDRegistry.genItemID("nanoChestplate");
IDRegistry.genItemID("nanoLeggings");
IDRegistry.genItemID("nanoBoots");

Item.createArmorItem("nanoHelmet", "Nano Helmet", {name: "armor_nano_helmet"}, {type: "helmet", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplate", "Nano Chestplate", {name: "armor_nano_chestplate"}, {type: "chestplate", armor: 8, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggings", "Nano Leggings", {name: "armor_nano_leggings"}, {type: "leggings", armor: 6, durability: 625, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBoots", "Nano Boots", {name: "armor_nano_boots"}, {type: "boots", armor: 4, durability: 625, texture: "armor/nano_1.png", isTech: true});

Player.addItemCreativeInv(ItemID.nanoHelmet, 1, 1);
Player.addItemCreativeInv(ItemID.nanoChestplate, 1, 1);
Player.addItemCreativeInv(ItemID.nanoLeggings, 1, 1);
Player.addItemCreativeInv(ItemID.nanoBoots, 1, 1);

ChargeItemRegistry.registerItem(ItemID.nanoHelmet, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoChestplate, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoLeggings, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoBoots, 100000, 1, true, 160);

IDRegistry.genItemID("nanoHelmetUncharged");
IDRegistry.genItemID("nanoChestplateUncharged");
IDRegistry.genItemID("nanoLeggingsUncharged");
IDRegistry.genItemID("nanoBootsUncharged");

Item.createArmorItem("nanoHelmetUncharged", "Nano Helmet", {name: "armor_nano_helmet"}, {type: "helmet", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoChestplateUncharged", "Nano Chestplate", {name: "armor_nano_chestplate"}, {type: "chestplate", armor: 6, durability: 625, texture: "armor/nano_1.png", isTech: true});
Item.createArmorItem("nanoLeggingsUncharged", "Nano Leggings", {name: "armor_nano_leggings"}, {type: "leggings", armor: 3, durability: 625, texture: "armor/nano_2.png", isTech: true});
Item.createArmorItem("nanoBootsUncharged", "Nano Boots", {name: "armor_nano_boots"}, {type: "boots", armor: 2, durability: 625, texture: "armor/nano_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.nanoHelmetUncharged, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoChestplateUncharged, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoLeggingsUncharged, 100000, 1, true, 160);
ChargeItemRegistry.registerItem(ItemID.nanoBootsUncharged, 100000, 1, true, 160);


MachineRecipeRegistry.registerRecipesFor("nano-armor-charge", {
	"ItemID.nanoHelmet": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoHelmetUncharged": {charged: ItemID.nanoHelmet, uncharged: ItemID.nanoHelmetUncharged},
	"ItemID.nanoChestplate": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoChestplateUncharged": {charged: ItemID.nanoChestplate, uncharged: ItemID.nanoChestplateUncharged},
	"ItemID.nanoLeggings": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoLeggingsUncharged": {charged: ItemID.nanoLeggings, uncharged: ItemID.nanoLeggingsUncharged},
	"ItemID.nanoBoots": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
	"ItemID.nanoBootsUncharged": {charged: ItemID.nanoBoots, uncharged: ItemID.nanoBootsUncharged},
}, true);


var NANO_ARMOR_FUNCS_CHARGED = {
	maxDamage: Item.getMaxDamage(ItemID.nanoHelmet),
	tick: function(slot, inventory, index){
		if(index == 0) UIbuttons.enableButton("button_nightvision");
		var armor = MachineRecipeRegistry.getRecipeResult("nano-armor-charge", slot.id);
		if(slot.data > this.maxDamage - 5){
			slot.id = armor.uncharged;
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			if(index==0 && UIbuttons.nightvision){
				if(World.getThreadTime()%640==0){slot.data++;}
				var coords = Player.getPosition();
				if(nativeGetLightLevel(coords.x, coords.y, coords.z)==15){
					Entity.addEffect(player, MobEffect.blindness, 25, 1);
				}
				Entity.addEffect(player, MobEffect.nightVision, 225, 1);
			}
			if(index == 3){
				var vel = Player.getVelocity();
				if(vel.y < -0.226 && slot.data < this.maxDamage - 4){
					Entity.addEffect(player, MobEffect.jump, 2, 12);
				}
			}
			if(slot.id != armor.charged){
				slot.id = armor.charged;
			}
			return true;
		}
	}
};

Armor.registerFuncs("nanoHelmet", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoHelmetUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplate", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoChestplateUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggings", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoLeggingsUncharged", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBoots", NANO_ARMOR_FUNCS_CHARGED);
Armor.registerFuncs("nanoBootsUncharged", NANO_ARMOR_FUNCS_CHARGED);


Recipes.addShaped({id: ItemID.nanoHelmet, count: 1, data: Item.getMaxDamage(ItemID.nanoHelmet)}, [
	"x#x",
	"xax"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0, 'a', ItemID.nightvisionGoggles, -1], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoChestplate, count: 1, data: Item.getMaxDamage(ItemID.nanoChestplate)}, [
	"x x",
	"x#x",
	"xxx"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoLeggings, count: 1, data: Item.getMaxDamage(ItemID.nanoLeggings)}, [
	"x#x",
	"x x",
	"x x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.nanoBoots, count: 1, data: Item.getMaxDamage(ItemID.nanoBoots)}, [
	"x x",
	"x#x"
], ['#', ItemID.storageCrystal, -1, 'x', ItemID.carbonPlate, 0], RECIPE_FUNC_TRANSPORT_ENERGY);


IDRegistry.genItemID("quantumHelmet");
IDRegistry.genItemID("quantumChestplate");
IDRegistry.genItemID("quantumLeggings");
IDRegistry.genItemID("quantumBoots");

Item.createArmorItem("quantumHelmet", "Quantum Helmet", {name: "armor_quantum_helmet"}, {type: "helmet", armor: 5, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplate", "Quantum Chestplate", {name: "armor_quantum_chestplate"}, {type: "chestplate", armor: 9, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggings", "Quantum Leggings", {name: "armor_quantum_leggings"}, {type: "leggings", armor: 7, durability: 8333, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBoots", "Quantum Boots", {name: "armor_quantum_boots"}, {type: "boots", armor: 4, durability: 8333, texture: "armor/quantum_1.png", isTech: true});

Player.addItemCreativeInv(ItemID.quantumHelmet, 1, 1);
Player.addItemCreativeInv(ItemID.quantumChestplate, 1, 1);
Player.addItemCreativeInv(ItemID.quantumLeggings, 1, 1);
Player.addItemCreativeInv(ItemID.quantumBoots, 1, 1);

ChargeItemRegistry.registerItem(ItemID.quantumHelmet, 1000000, 2, true, 120);
ChargeItemRegistry.registerItem(ItemID.quantumChestplate, 1000000, 2, true, 120);
ChargeItemRegistry.registerItem(ItemID.quantumLeggings, 1000000, 2, true, 120);
ChargeItemRegistry.registerItem(ItemID.quantumBoots, 1000000, 2, true, 120);

IDRegistry.genItemID("quantumHelmetUncharged");
IDRegistry.genItemID("quantumChestplateUncharged");
IDRegistry.genItemID("quantumLeggingsUncharged");
IDRegistry.genItemID("quantumBootsUncharged");

Item.createArmorItem("quantumHelmetUncharged", "Quantum Helmet", {name: "armor_quantum_helmet"}, {type: "helmet", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumChestplateUncharged", "Quantum Chestplate", {name: "armor_quantum_chestplate"}, {type: "chestplate", armor: 6, durability: 8333, texture: "armor/quantum_1.png", isTech: true});
Item.createArmorItem("quantumLeggingsUncharged", "Quantum Leggings", {name: "armor_quantum_leggings"}, {type: "leggings", armor: 3, durability: 8333, texture: "armor/quantum_2.png", isTech: true});
Item.createArmorItem("quantumBootsUncharged", "Quantum Boots", {name: "armor_quantum_boots"}, {type: "boots", armor: 2, durability: 8333, texture: "armor/quantum_1.png", isTech: true});

ChargeItemRegistry.registerItem(ItemID.quantumHelmetUncharged, 1000000, 2, true, 120);
ChargeItemRegistry.registerItem(ItemID.quantumChestplateUncharged, 1000000, 2, true, 120);
ChargeItemRegistry.registerItem(ItemID.quantumLeggingsUncharged, 1000000, 2, true, 120);
ChargeItemRegistry.registerItem(ItemID.quantumBootsUncharged, 1000000, 2, true, 120);


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


var QUANTUM_ARMOR_FUNCS_CHARGED = {
	maxDamage: Item.getMaxDamage(ItemID.quantumHelmet),
	runTime: 0,
	tick: function(slot, inventory, index){
		if(index==0) UIbuttons.enableButton("button_nightvision");
		var armor = MachineRecipeRegistry.getRecipeResult("quantum-armor-charge", slot.id);
		if(slot.data > this.maxDamage - 5){
			slot.id = armor.uncharged;
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			if(slot.id != armor.charged){
				slot.id = armor.charged;
			}
			switch (index){
			case 0:
				Entity.clearEffect(player, MobEffect.poison);
				Entity.clearEffect(player, MobEffect.wither);
				if(UIbuttons.nightvision){
					if(World.getThreadTime()%480==0){slot.data++;}
					var coords = Player.getPosition();
					if(nativeGetLightLevel(coords.x, coords.y, coords.z)==15){
						Entity.addEffect(player, MobEffect.blindness, 25, 1);
					}
					Entity.addEffect(player, MobEffect.nightVision, 225, 1);
				}
			break;
			case 1:
				UIbuttons.enableButton("button_fly");
				Entity.addEffect(player, MobEffect.fireResistance, 2, 1);
			break;
			case 2:
				var vel = Player.getVelocity();
				var horizontalVel = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
				if(horizontalVel > 0.15){
					if(Math.abs(vel.y+0.078) < 0.001){this.runTime++;}
				}
				else{this.runTime = 0;}
				if(this.runTime > 2 && !Player.getFlying()){
					if(World.getThreadTime()%20==0){
						slot.data = Math.min(slot.data + Math.floor(horizontalVel*10), this.maxDamage - 4);
					}
					Entity.addEffect(player, MobEffect.movementSpeed, 3, 5);
				}
			break;
			case 3:
				UIbuttons.enableButton("button_jump");
				var vel = Player.getVelocity();
				if(vel.y < -0.2){
					Entity.addEffect(player, MobEffect.jump, 2, 255);
				}
			break;
			}
			return true;
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


Recipes.addShaped({id: ItemID.quantumHelmet, count: 1, data: Item.getMaxDamage(ItemID.quantumHelmet)}, [
	"a#a",
	"bxb"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoHelmet, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', BlockID.reinforcedGlass, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.quantumChestplate, count: 1, data: Item.getMaxDamage(ItemID.quantumChestplate)}, [
	"bxb",
	"a#a",
	"aca"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoChestplate, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0, 'c', ItemID.jetpack, -1], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.quantumLeggings, count: 1, data: Item.getMaxDamage(ItemID.quantumLeggings)}, [
	"m#m",
	"axa",
	"c c"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoLeggings, -1, 'a', ItemID.plateReinforcedIridium, 0, 'm', BlockID.machineBlockBasic, 0, 'c', 348, 0], RECIPE_FUNC_TRANSPORT_ENERGY);

Recipes.addShaped({id: ItemID.quantumBoots, count: 1, data: Item.getMaxDamage(ItemID.quantumBoots)}, [
	"axa",
	"b#b"
], ['#', ItemID.storageLapotronCrystal, -1, 'x', ItemID.nanoBoots, -1, 'a', ItemID.plateReinforcedIridium, 0, 'b', ItemID.plateAlloy, 0], RECIPE_FUNC_TRANSPORT_ENERGY);


IDRegistry.genItemID("jetpack");
Item.createArmorItem("jetpack", "Jetpack", {name: "armor_jetpack"}, {type: "chestplate", armor: 3, durability: 6000, texture: "armor/jetpack_1.png", isTech: true});
Player.addItemCreativeInv(ItemID.jetpack, 1, 1) ;
ChargeItemRegistry.registerItem(ItemID.jetpack, 6000, 0, true, 5);

Recipes.addShaped({id: ItemID.jetpack, count: 1, data: 6000}, [
	"bcb",
	"bab",
	"d d"
], ['a', BlockID.storageBatBox, -1, 'b', ItemID.casingIron, 0, 'c', ItemID.circuitAdvanced, 0, "d", 348, 0]);
	

Armor.registerFuncs("jetpack", {
	maxDamage: Item.getMaxDamage(ItemID.jetpack),
	tick: function(slot, inventory, index){
		if(slot.data > this.maxDamage - 5){
			slot.data = this.maxDamage - 4;
			return true;
		}
		else{
			UIbuttons.enableButton("button_fly");
			var vel = Player.getVelocity();
			if(vel.y < -0.226 && vel.y > -0.9){
				Entity.addEffect(player, MobEffect.jump, 2, 255);
			}
			return true;
		}
	}
});


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


IDRegistry.genItemID("treetap");
Item.createItem("treetap", "Treetap", {name: "treetap", data: 0}, {stack: 1});
Item.setMaxDamage(ItemID.treetap, 17);

Item.registerUseFunction("treetap", function(coords, item, block){
	if(block.id == BlockID.rubberTreeLogLatex && block.data == coords.side - 2){
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLog);
		Player.setCarriedItem(item.id, ++item.data < 17 ? item.count : 0, item.data);
		Entity.setVelocity(
			World.drop(
				coords.relative.x + 0.5,
				coords.relative.y + 0.5,
				coords.relative.z + 0.5,
				ItemID.latex, 1 + parseInt(Math.random() * 3), 0
			),
			(coords.relative.x - coords.x) * 0.25,
			(coords.relative.y - coords.y) * 0.25,
			(coords.relative.z - coords.z) * 0.25
		);
	}
});

Recipes.addShaped({id: ItemID.treetap, count: 1, data: 0}, [
	" x ",
	"xxx",
	"x  "
], ['x', 5, -1]);


var CRAFTING_TOOL_ITEM_MAX_DAMAGE = 96;

IDRegistry.genItemID("craftingHammer");
Item.createItem("craftingHammer", "Forge Hammer", {name: "crafting_hammer"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingHammer, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

IDRegistry.genItemID("craftingCutter");
Item.createItem("craftingCutter", "Cutter", {name: "crafting_cutter"}, {stack: 1});
Item.setMaxDamage(ItemID.craftingCutter, CRAFTING_TOOL_ITEM_MAX_DAMAGE);

function addRecipeWithCraftingTool(result, data, tool){
	data.push({id: tool, data: -1});
	Recipes.addShapeless(result, data, function(api, field, result){
		for (var i in field){
			if (field[i].id == tool){
				field[i].data++;
				if (field[i].data >= CRAFTING_TOOL_ITEM_MAX_DAMAGE){
					field[i].id = field[i].count = field[i].data = 0;
				}
			}
			else {
				api.decreaseFieldSlot(i);
			}
		}
	});
}

Recipes.addShaped({id: ItemID.craftingHammer, count: 1, data: 0}, [
	"xxx",
	"x#x",
	" # "
], ['x', 265, 0, '#', 280, 0]);

Recipes.addShaped({id: ItemID.craftingCutter, count: 1, data: 0}, [
	"x x",
	" x ",
	"a a"
], ['a', 265, 0, 'x', ItemID.plateIron, 0]);


IDRegistry.genItemID("bronzeSword");
IDRegistry.genItemID("bronzeShovel");
IDRegistry.genItemID("bronzePickaxe");
IDRegistry.genItemID("bronzeAxe");
IDRegistry.genItemID("bronzeHoe");
Item.createItem("bronzeSword", "Bronze Sword", {name: "bronze_sword", meta: 0}, {stack: 1});
Item.createItem("bronzeShovel", "Bronze Shovel", {name: "bronze_shovel", meta: 0}, {stack: 1});
Item.createItem("bronzePickaxe", "Bronze Pickaxe", {name: "bronze_pickaxe", meta: 0}, {stack: 1});
Item.createItem("bronzeAxe", "Bronze Axe", {name: "bronze_axe", meta: 0}, {stack: 1});
Item.createItem("bronzeHoe", "Bronze Hoe", {name: "bronze_hoe", meta: 0}, {stack: 1});

ToolAPI.addToolMaterial("bronze", {durability: 225, level: 3, efficiency: 6, damage: 2, enchantability: 14});
ToolAPI.setTool(ItemID.bronzeSword, "bronze", ToolType.sword);
ToolAPI.setTool(ItemID.bronzeShovel, "bronze", ToolType.shovel);
ToolAPI.setTool(ItemID.bronzePickaxe, "bronze", ToolType.pickaxe);
ToolAPI.setTool(ItemID.bronzeAxe, "bronze", ToolType.axe);
ToolAPI.setTool(ItemID.bronzeHoe, "bronze", ToolType.hoe);


Recipes.addShaped({id: ItemID.bronzeSword, count: 1, data: 0}, [
	"a",
	"a",
	"b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzeShovel, count: 1, data: 0}, [
	"a",
	"b",
	"b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzePickaxe, count: 1, data: 0}, [
	"aaa",
	" b ",
	" b "
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzeAxe, count: 1, data: 0}, [
	"aa",
	"ab",
	" b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);

Recipes.addShaped({id: ItemID.bronzeHoe, count: 1, data: 0}, [
	"aa",
	" b",
	" b"
], ['a', ItemID.ingotBronze, 0, 'b', 280, 0]);


IDRegistry.genItemID("wrench");
Item.createItem("wrench", "Wrench", {name: "wrench", meta: 0}, {stack: 1});
Item.setMaxDamage(ItemID.wrench, 161);

IDRegistry.genItemID("electricWrench");
Item.setElectricItem("electricWrench", "Electric Wrench", {name: "electric_wrench", meta: 0}, {stack: 1});
Item.setMaxDamage(ItemID.electricWrench, 200);
ChargeItemRegistry.registerItem(ItemID.electricWrench, 10000, 0, true, 50, true);

Recipes.addShaped({id: ItemID.wrench, count: 1, data: 0}, [
	"a a",
	"aaa",
	" a "
], ['a', ItemID.ingotBronze, 0]);

Recipes.addShapeless({id: ItemID.electricWrench, count: 1, data: 200}, [{id: ItemID.wrench, data: 0}, {id: ItemID.powerUnitSmall, data: 0}]);


Callback.addCallback("DestroyBlockStart", function(coords, block){
	if(MachineRegistry.machineIDs[block.id]){
		var item = Player.getCarriedItem();
		if(item.id==ItemID.wrench || item.id==ItemID.electricWrench && item.data < 200){
			var tile = nativeGetTile(coords.x, coords.y, coords.z);
			nativeSetDestroyTime(tile, 0);
		}
	}
});


IDRegistry.genItemID("electricHoe");
IDRegistry.genItemID("electricTreetap");
Item.setElectricItem("electricHoe", "Electric Hoe", {name: "electric_hoe", meta: 0});
Item.setElectricItem("electricTreetap", "Electric Treetap", {name: "electric_treetap", meta: 0});
Item.setMaxDamage(ItemID.electricHoe, 200);
Item.setMaxDamage(ItemID.electricTreetap, 200);
ChargeItemRegistry.registerItem(ItemID.electricHoe, 10000, 0, true, 50, true);
ChargeItemRegistry.registerItem(ItemID.electricTreetap, 10000, 0, true, 50, true);
Item.setToolRender(ItemID.electricHoe, true);

Recipes.addShaped({id: ItemID.electricHoe, count: 1, data: 200}, [
	"pp",
	" p",
	" x"
], ['x', ItemID.powerUnitSmall, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShapeless({id: ItemID.electricTreetap, count: 1, data: 200}, [{id: ItemID.powerUnitSmall, data: 0}, {id: ItemID.treetap, data: 0}]);


Item.registerUseFunction("electricHoe", function(coords, item, block){
	if(item.data < 200 && (block.id==2 || block.id==3 || block.id==110) && coords.side==1){ 
		World.setBlock(coords.x, coords.y, coords.z, 60);
		World.playSoundAtEntity(Player.get(), "step.grass", 0.5, 0.75);
		Player.setCarriedItem(item.id, 1, item.data + 1);
	}
});
Item.registerUseFunction("electricTreetap", function(coords, item, block){
	if(item.data < 200 && block.id == BlockID.rubberTreeLogLatex && block.data == coords.side - 2){
		World.setBlock(coords.x, coords.y, coords.z, BlockID.rubberTreeLog);
		Player.setCarriedItem(item.id, 1, item.data + 1);
		Entity.setVelocity(
			World.drop(
				coords.relative.x + 0.5,
				coords.relative.y + 0.5,
				coords.relative.z + 0.5,
				ItemID.latex, 1 + parseInt(Math.random() * 3), 0
			),
			(coords.relative.x - coords.x) * 0.25,
			(coords.relative.y - coords.y) * 0.25,
			(coords.relative.z - coords.z) * 0.25
		);
	}
});


IDRegistry.genItemID("drill");
IDRegistry.genItemID("diamondDrill");
IDRegistry.genItemID("iridiumDrill");
Item.setElectricItem("drill", "Drill", {name: "drill", meta: 0});
Item.setElectricItem("diamondDrill", "Diamond Drill", {name: "drill", meta: 1});
//Item.setElectricItem("iridiumDrill", "Iridium Drill", {name: "drill", meta: 2}, {stack: 1});
ChargeItemRegistry.registerItem(ItemID.drill, 30000, 0, true, 50, true);
ChargeItemRegistry.registerItem(ItemID.diamondDrill, 30000, 0, true, 80, true);
//ChargeItemRegistry.registerItem(ItemID.iridiumDrill, 100000, 1, true, 200, true);

ToolType.drill = {
	damage: 0,
	blockTypes: ["stone", "dirt"],
	onBroke: function(item){
		item.data = Math.min(item.data, Item.getMaxDamage(item.id));
		return true;
	},
	onAttack: function(item, mob){
		if(item.data < Item.getMaxDamage(item.id)){
			item.data--;
		}
		else{item.data -= 2;}
	},
	calcDestroyTime: function(item, block, params, destroyTime, enchant){
		if(item.data < Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		else{
			return params.base;
		}
	}
}

ToolAPI.setTool(ItemID.drill, {durability: 600, level: 3, efficiency: 8, damage: 3},  ToolType.drill);
ToolAPI.setTool(ItemID.diamondDrill, {durability: 375, level: 4, efficiency: 16, damage: 4}, ToolType.drill);
//ToolAPI.setTool(ItemID.iridiumDrill, {durability: 500, level: 4, efficiency: 24, damage: 5}, ToolType.drill);


Recipes.addShaped({id: ItemID.drill, count: 1, data: 600}, [
	" p ",
	"ppp",
	"pxp"
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

Recipes.addShaped({id: ItemID.diamondDrill, count: 1, data: 375}, [
	" a ",
	"ada"
], ['d', ItemID.drill, -1, 'a', 264, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
/*
Recipes.addShaped({id: ItemID.iridiumDrill, count: 1, data: Item.getMaxDamage(ItemID.iridiumDrill)}, [
	" a ",
	"ada",
	" e "
], ['d', ItemID.diamondDrill, -1, 'e', ItemID.storageCrystal, -1, 'a', ItemID.plateReinforcedIridium, 0], RECIPE_FUNC_TRANSPORT_ENERGY);
*/


IDRegistry.genItemID("chainsaw");
Item.setElectricItem("chainsaw", "Chainsaw", {name: "chainsaw", meta: 0});
ChargeItemRegistry.registerItem(ItemID.chainsaw, 30000, 0, true, 50, true);

Recipes.addShaped({id: ItemID.chainsaw, count: 1, data: 600}, [
	" pp",
	"ppp",
	"xp "
], ['x', ItemID.powerUnit, 0, 'p', ItemID.plateIron, 0]);

ToolAPI.addBlockMaterial("wool", 1.5);
ToolAPI.registerBlockMaterial(35, "wool");

ToolType.chainsaw = {
	damage: 0,
	blockTypes: ["wood", "wool", "fibre", "plant"],
	onBroke: function(item){
		item.data = Math.min(item.data, Item.getMaxDamage(item.id));
		return true;
	},
	onAttack: function(item, mob){
		if(item.data < Item.getMaxDamage(item.id)){
			item.data--;
			this.damage = 6;
		}
		else{
			this.damage = 0;
			item.data -= 2;
		}
		
	},
	calcDestroyTime: function(item, block, params, destroyTime, enchant){
		if(item.data < Item.getMaxDamage(item.id)){
			return destroyTime;
		}
		else{
			return params.base;
		}
	}
}

ToolAPI.setTool(ItemID.chainsaw, {durability: 600, level: 3, efficiency: 16, damage: 3},  ToolType.chainsaw);


IDRegistry.genItemID("nanoSaber");
Item.setElectricItem("nanoSaber", "Nano Saber", {name: "nano_saber", meta: 0});
ChargeItemRegistry.registerItem(ItemID.nanoSaber, 100000, 1, true, 10, true);
Item.setToolRender(ItemID.nanoSaber, true);

Recipes.addShaped({id: ItemID.nanoSaber, count: 1, data: NANO_SABER_DURABILITY}, [
	"ca ",
	"ca ",
	"bxb"
], ['x', ItemID.storageCrystal, -1, 'a', ItemID.plateAlloy, 0, 'b', ItemID.carbonPlate, 0, "c", 348, 0], RECIPE_FUNC_TRANSPORT_ENERGY);


var NANO_SABER_DURABILITY = 10000;

ToolAPI.registerSword(ItemID.nanoSaber, {level: 0, durability: NANO_SABER_DURABILITY, damage: 4}, {
	damage: 0,
	onBroke: function(item){
		item.data = Math.min(item.data, NANO_SABER_DURABILITY);
		return true;
	},
	onAttack: function(item, mob){
		item.data -= 2;
		this.damage = item.data < NANO_SABER_DURABILITY ? 16 : 0;
	}
});

Callback.addCallback("tick", function(){
	if(World.getThreadTime() % 10 == 0){
		var item = Player.getCarriedItem()
		if(item.id == ItemID.nanoSaber){
			item.data = Math.min(item.data+1, NANO_SABER_DURABILITY);
			Player.setCarriedItem(item.id, 1, item.data);
		} 
	}
});


ModAPI.registerAPI("ICore", {
	Machine: MachineRegistry,
	Recipe: MachineRecipeRegistry,
	ChargeRegistry: ChargeItemRegistry,
	UpgradeAPI: UpgradeAPI,
	UI: UIbuttons,
	
	requireGlobal: function(command){
		return eval(command);
	}
});

Logger.Log("Industrial Core API shared with name ICore.", "API");


