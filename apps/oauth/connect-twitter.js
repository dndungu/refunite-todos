"use strict";
var querystring = require("querystring");
module.exports = {
	"get": function(sandbox){
		var twitter = new (sandbox.context.require("apps/oauth/lib/twitter.js"));
		twitter.init(sandbox);
		var tab = twitter.tab();
		var options = {};
		options.callback = twitter.callback();
		options.url = "https://api.twitter.com/oauth/request_token";
		var auth = twitter.auth(options);
		tab.setHeader("Authorization", "OAuth " + auth);
		tab.post({
			url: "/oauth/request_token",
			form: {},
			end: function(data){
				var value = sandbox.context.get("encryption").encrypt(data);
				var expires = (new Date((new Date()).valueOf() + (300*1000))).toUTCString();
		        var cookie = {name: "_t", value: value, path: "/", expires: expires, secure: twitter.secure, httpOnly: true};
        		sandbox.context.get("cookies").push(cookie);
				var response = querystring.parse(data);
				var url = "https://api.twitter.com/oauth/authenticate?oauth_token=" + response.oauth_token;
				sandbox.context.header("Location", url).statusCode(302);
				sandbox.data("Found").end();
			},
			error: function(){
				sandbox.context.header("Location", "/503").statusCode(302);
				sandbox.data("Service Unavailable").end()
			}
		});
	}
};
