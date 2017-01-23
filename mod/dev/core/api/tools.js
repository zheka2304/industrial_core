var ToolsModule = {

	CoreAPIMembers: [],
	
	pushMethodsOf: function(parent, object){
		for (let member in object){
			if (typeof object[member] == "function"){
				let arg = object[member].toString().match(/\([\w_,\s]{0,}\)/)[0]
				ToolsModule.CoreAPIMembers.push(parent + "." + member + arg + ";\n")
				 FileTools.WriteText("coreengine_dump",parent + "." + member + arg + ";\n");
			}
			else if (typeof object[member] != "object"){
				ToolsModule.CoreAPIMembers.push(parent + "." + member + ";\n")
				 FileTools.WriteText("coreengine_dump",parent + "." + member + ";\n");
			}
			else{
				if (parent.split(".").length <= 4){
				ToolsModule.pushMethodsOf(parent + "." + member,object[member])
				}
			}
		}
	},
	
	CEDumpCreate: function(){
		ToolsModule.pushMethodsOf("",CoreAPI)
		let dump;
		for (let members in ToolsModule.CoreAPIMembers){
			dump = dump + ToolsModule.CoreAPIMembers[members]
		}
		Game.dialogMessage(dump)
		FileTools.WriteText("coreengine_dump", dump);
	}
}