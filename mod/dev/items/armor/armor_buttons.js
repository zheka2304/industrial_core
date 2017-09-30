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