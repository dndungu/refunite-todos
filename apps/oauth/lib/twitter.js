"use strict";
var crypto = require('crypto');
var querystring = require("querystring");
module.exports = function(){
	return {
		init: function(sandbox){
			this.sandbox = sandbox;
			this.nonce = this.sandbox.context.get("encryption").random(32);
			return this;
		},
		process: function(user, then){
			if(!user.oauth_token)
				return then(user);
			this.user = user;
			this.then = then;
			this.find();
		},
		find: function(){
			var that = this;
			this.storage = this.sandbox.context.get("storage").get("global");
			var query = {"twitter.user_id": this.user.user_id};
			this.storage.collection("user").find(query).toArray(function(error, items){
    	        if(error)
	                return that.then(error);
				if(!items.length)
					return that.create();
				items[0].twitter = that.user;
				that.update(items[0]);
			});
		},
		create: function(){
	        var that = this;
			var user = {twitter: this.user};
	        user._id = this.sandbox.context.get("storage").uuid();
			user.site_id = this.sandbox.context.get("site")._id;
			user.creation_time = (new Date()).getTime();
        	this.storage.collection("user").insert(user, function(error, items){
            	if(error)
                	return that.then(error);
	            that.signin(user);
        	});
		},
		update: function(user){
	        var that = this;
			user.twitter = this.user;
			var query = {_id: user._id};
			this.storage.collection("user").update(query, user, function(error, items){
				if(error)
					return that.then(error);
				that.signin(user);
			});
		},
		signin: function(user){
	        var _g = this.sandbox.context.get("encryption").encrypt(user._id);
    	    var name = this.sandbox.context.get("settings").cookie.name;
        	var age = this.sandbox.context.get("settings").cookie.age;
	        var expires = (new Date((new Date()).valueOf() + (age*1000))).toUTCString();
    	    var secure = this.sandbox.context.get("settings").server.secure;
        	var cookie = {name: name, value: _g, path: "/", expires: expires, secure: secure, httpOnly: true};
	        this.sandbox.context.get("cookies").push(cookie);
			this.then();
		},
		tab: function(){
			var browser = this.sandbox.context.require("utilities/browser.js");
			return new browser({
        	    hostname: "api.twitter.com",
				port: 443,
				secure: true,
				redirect: false
			});
		},
		auth: function(options){
			var oauth = this.sandbox.context.get("site").settings.oauth;
			var parameters = {};
			if(options.callback)
				parameters.oauth_callback = options.callback;
			parameters.oauth_consumer_key = oauth.twitter.key;
			parameters.oauth_nonce = this.nonce;
			parameters.oauth_signature_method = "HMAC-SHA1";
			parameters.oauth_timestamp = Math.round(new Date() / 1000);
			if(options.oauth_token)
				parameters.oauth_token = options.oauth_token;
			parameters.oauth_version = "1.0";
			var arr = [];
			for(var i in parameters){
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(parameters[i]));
			}
			var text = 'POST&' + encodeURIComponent(options.url) + '&' + encodeURIComponent(arr.join('&'));
			var key = encodeURIComponent(oauth.twitter.secret) + '&';
			if(options.oauth_token)
				key += encodeURIComponent(options.oauth_token);
			parameters.oauth_signature = crypto.createHmac('sha1', key).update(text).digest('base64');
			var auth = [];
			for(var j in parameters){
				auth.push(j + '="' + encodeURIComponent(parameters[j]) + '"');
			}
			return auth.join(",");
		},
		callback: function(){
			this.secure = this.sandbox.context.get("settings").secure;
			var protocol = this.secure ? "https://" : "http://";
			this.host = this.sandbox.context.get("host");
			return protocol + this.host + "/oauth/callback-twitter/" + this.next();
		},
		next: function(){
			return this.sandbox.context.get('parameters').next;
		}
	}
};
