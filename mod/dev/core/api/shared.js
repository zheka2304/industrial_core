Callback.addCallback("PreLoaded", function(){
	ModAPI.registerAPI("ICore", {
		Machine: MachineRegistry,
		Recipe: MachineRecipeRegistry,
		ChargeRegistry: ChargeItemRegistry,
		
		requireGlobal: function(command){
			return eval(command);
		}
	});

	Logger.Log("Industrial Core API shared with name ICore.", "API");
});