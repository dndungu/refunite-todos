"use strict";
module.exports = {
	"get": function(sandbox){
		var code = sandbox.context.get("query").code;
		var next = sandbox.context.get('parameters').next;
		sandbox.network = sandbox.context.get('parameters').network;
		if(!code || !next || !sandbox.network)
			return sandbox.end();
        var protocol = sandbox.context.get("settings").secure ? "https://" : "http://";
        var host = sandbox.context.get("host");
        var callback = protocol + host + "/oauth/callback/" + sandbox.network + "/" + next;
		var endpoints = new (sandbox.context.require("apps/oauth/lib/endpoints.js"));
		var oauth = sandbox.context.get("site").settings.oauth;
		endpoints.set("code", code);
		endpoints.set("network", sandbox.network);
		endpoints.set("callback", callback);
        for(var i in oauth){
            endpoints.set(i, oauth[i].key);
            endpoints.set((i + "-secret"), oauth[i].secret);
        }
		sandbox.endpoints = endpoints;
		sandbox.url = endpoints.endpoint(sandbox.network, "token");
		var processor = sandbox.context.require("apps/oauth/lib/" + sandbox.network.split("-")[0] + ".js");
		processor.init(sandbox);
		processor.process(function(error){
			sandbox.context.statusCode(302);
			var url = this.sandbox.context.get("route").parameters.redirect;
			if(error)
				url = "/";
			if(error)
				console.log(error);
			sandbox.context.header("Location", url);
			sandbox.data("Found");
			sandbox.end();
		});
	}
};
