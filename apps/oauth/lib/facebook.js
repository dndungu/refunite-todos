"use strict";
module.exports = {
	init: function(sandbox){
		this.sandbox = sandbox;
		this.browser = this.sandbox.context.require("utilities/browser.js");
		this.storage = this.sandbox.context.get("storage").get("global");
	},
	tab: function(){
		return new this.browser({
			hostname: "graph.facebook.com",
			port: 443,
			secure: true,
			redirect: false
		});
	},
	process: function(then){
		this.then = then;
		var url = this.sandbox.url;
		var tab = this.tab();
		var that = this;
		tab.get({
			url: url,
			end: function(){
				var response = arguments[0].split("&");
				if(response.length == 2)
					return that.fetchMe(response);
				that.then(arguments[0]);
			},
			error: that.then
		});
	},
	fetchMe: function(response){
		var token = response[0].split('=')[1];
		var expires = response[1].split('=')[1];
		var tab = this.tab();
		var that = this;
		var endpoints = this.sandbox.endpoints;
		endpoints.set("token", token);
		var url = endpoints.endpoint(this.sandbox.network, "me");
		tab.get({
			url: url,
			end: function(data){
				var response = JSON.parse(data);
				response.token = {token: token, expires: expires};
				that.find({"facebook" : response});
			},
			error: that.then
		});
	},
	find: function(user){
		var query = { $or: [ { facebook : {id: user.facebook.id} }, { email: user.facebook.email } ] };
		var that = this;
		this.storage.collection("user").find(query).toArray(function(error, items){
			if(error)
				return that.then(error);
			if(!items.length)
				return that.create(user);
			items[0].facebook = user.facebook;
			that.update(items[0]);
		});
	},
	create: function(user){
		var that = this;
        this.password = this.sandbox.context.get("encryption").password(4);
        user.password = this.sandbox.context.get("encryption").encrypt(this.password);
		user._id = this.sandbox.context.get("storage").uuid();
		user.site_id = this.sandbox.context.get("site")._id;
		user.email = user.facebook.email;
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
		var data = {$set : {"facebook": user.facebook}};
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
