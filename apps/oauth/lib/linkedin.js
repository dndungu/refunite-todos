"use strict";
module.exports = {
	init: function(sandbox){
		this.sandbox = sandbox;
		this.browser = this.sandbox.context.require("utilities/browser.js");
		this.storage = this.sandbox.context.get("storage").get("global");
	},
	tab: function(){
		return new this.browser({
			hostname: "graph.linkedin.com",
			port: 443,
			secure: true,
			redirect: false
		});
	},
	process: function(then){
		this.then = then;
		var url = this.sandbox.url;
		var tab = new this.browser({hostname: "www.linkedin.com", port: 443, secure: true, redirect: false});
		var that = this;
		tab.get({
			url: url,
			end: function(){
				var response = JSON.parse(arguments[0]);
				if(response.access_token)
					return that.fetchMe(response);
				//TODO take user back to signin explanation page.
			},
			error: that.then
		});
	},
	fetchMe: function(response){
		var tab = new this.browser({hostname: "api.linkedin.com", port: 443, secure: true, redirect: false});
		var that = this;
		var endpoints = this.sandbox.endpoints;
		endpoints.set("token", response.access_token);
		var url = endpoints.endpoint(this.sandbox.network, "me");
		tab.get({
			url: url,
			end: function(data){
				var parseString = require('xml2js').parseString;
				parseString(data, function(error, me){
					if(error)
						return that.then(error);
					me.person.token = {token: response.access_token, expires: response.expires_in};
					that.find({"linkedin" : me.person});
				});
			},
			error: that.then
		});
	},
	find: function(user){
		var query = { $or: [{linkedin : {id: user.linkedin.id[0]}}, {email: user.linkedin["email-address"][0]}] };
		var that = this;
		this.storage.collection("user").find(query).toArray(function(error, items){
			if(error)
				return that.then(error);
			if(!items.length)
				return that.create(user);
			items[0].linkedin = user.linkedin;
			that.update(items[0]);
		});
	},
	create: function(user){
		var that = this;
        this.password = this.sandbox.context.get("encryption").password(4);
        user.password = this.sandbox.context.get("encryption").encrypt(this.password);
		user._id = this.sandbox.context.get("storage").uuid();
		user.site_id = this.sandbox.context.get("site")._id;
		user.email = user.linkedin["email-address"][0];
		user.creation_time = (new Date()).getTime();
		this.storage.collection("user").insert(user, function(error, items){
			if(error)
				return that.then(error);
			that.signin(user);
			that.welcome(items[0]);
		});
	},
	update: function(user){
		var that = this;
		var query = {_id: user._id};
		var data = {$set : {"linkedin": user.linkedin}};
		this.storage.collection("user").update(query, data, function(error, items){
			that.signin(user);
			that.then(error);
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
	},
	welcome: function(user){
		var that = this;
		var form = {first_name: user.facebook.first_name};
		form.email = user.facebook.email;
		form.password = this.password;
		this.storage.collection("welcome").insert(form, function(error, items){
			return that.then(error);
		});
},

};
