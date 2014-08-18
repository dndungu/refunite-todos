"use strict";
var router = require("../core/router.js");
var authenticator = require("../core/authenticator.js");
var cache = require("../core/cache.js");
var operator = require("../core/operator.js");
var publisher = require("../core/publisher.js");
var storage = require('../utilities/storage.js');
var fs = require("fs");
var url = require("url");
var settings = null;

var _private = {
	server: function(request, response){
        var context = _private.context();
		context.get("cookies").parseCookie(request.headers['cookie']);
        context.set("request", request);
        context.set("response", response);
		var host = request.headers.host ? request.headers.host.split(':')[0] : settings.server.host;
        context.set("host", host);
        context.set("method", request.method);
		var url_parts = url.parse(request.url.trim(), true, true);
        context.set("uri", url_parts.pathname);
		context.set("query", url_parts.query);
        context.set("storage", storage);
		router.init(context);
		authenticator.init(context);
		cache.init(context);
		operator.init(context);
		publisher.init(context);
		context.get('broker').emit({type : 'server.end', data : context});
	},
	cert: function(){
		return {
			key: fs.readFileSync(settings.server.key, 'utf8'),
			cert: fs.readFileSync(settings.server.cert, 'utf8')
		};
	},
	context: function(){
		var context = new (require('../utilities/context.js'));
		context.init();
		context.set("settings", settings);
		var cookies = new (require('../utilities/cookies.js'));
		context.set("cookies", cookies);
		var broker = new (require('../utilities/broker.js'));
		broker.set("context", context);
		context.set("user", (new (require('../utilities/user.js'))));
		var rest = new (require('../utilities/rest.js'));
		rest.init(context);
		var encryption = new (require('../utilities/encryption.js'));
		encryption.init(context);
		context.set("encryption", encryption);
		context.set("storage", storage); 
		context.set("broker", broker);
		return context;
	}
};

module.exports = {
	start: function(){
		settings = arguments[0];
		storage.db(settings.database).open(function(error, db){
			if(error)
				return console.log(error.toString());
		 	storage.set("global", db);
			if(settings.server.secure)
				return require('https').createServer(_private.cert(settings), _private.server).listen(settings.server.port, settings.server.host);
			require('http').createServer(_private.server).listen(settings.server.port, settings.server.host);
		});
	}
};
