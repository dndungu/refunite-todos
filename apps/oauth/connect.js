"use strict";
module.exports = {
	"get": function(sandbox){
		var endpoints = new (sandbox.context.require("apps/oauth/lib/endpoints.js"));
		sandbox.network = sandbox.context.get('parameters').network;
		var next = sandbox.context.get('parameters').next;
		var protocol = sandbox.context.get("settings").secure ? "https://" : "http://";
		var host = sandbox.context.get("host");
		var callback = protocol + host + "/oauth/callback/" + sandbox.network + "/" + next;
		var state = sandbox.context.get("encryption").random(32);
		var oauth = sandbox.context.get("site").settings.oauth;
		for(var i in oauth){
			endpoints.set(i, oauth[i].key);
		}
		endpoints.set("callback", callback);
		endpoints.set("state", state);
		sandbox.context.statusCode(302);
		var endpoint = endpoints.endpoint(sandbox.network, "connect");
		sandbox.context.header("Location", endpoint);
		sandbox.data("Found");
		sandbox.end();
	}
};
