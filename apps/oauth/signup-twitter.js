"use strict";
var querystring = require("querystring");
module.exports = {
	"get": function(sandbox){
		var query = sandbox.context.get("query");
		var cookie = sandbox.context.get("cookies").find("_t");
		var _t = cookie ? querystring.parse(sandbox.context.get("encryption").decrypt(cookie)) : {};
		var thatToken = _t.oauth_token;
		var thisToken = query.oauth_token;
		if(thatToken != thisToken)
			return sandbox.context.log("Twitter tokens not matching") && sandbox.context.statusCode(400) && sandbox.end("Bad request");
        var twitter = new (sandbox.context.require("apps/oauth/lib/twitter.js"));
        twitter.init(sandbox);
		var options = {};
		options.url = "https://api.twitter.com/oauth/access_token";
		options.oauth_token = thisToken;
        var auth = twitter.auth(options);
        var tab = twitter.tab();
        tab.setHeader("Authorization", "OAuth " + auth);
		var form = {oauth_verifier : query.oauth_verifier};
		tab.post({
			url: "/oauth/access_token",
			form: form,
			end: function(data){
				var user = querystring.parse(data);
				var self = this;
				twitter.process(user, function(error){
					if(error)
						return self.error(error);
					var next = "/" + twitter.next();
					sandbox.context.header("Location", next).statusCode(302);
					sandbox.data("Found").end();
				});
			},
			error: function(error){
				sandbox.context.log(3, error);
				sandbox.data({error:error}).end();
			}
		});
	}
};
