"use strict";
var fs = require('fs');
module.exports = function(){

	var _private = {};

	return {
		init: function(){
			_private = {
				statusCode: 200,
				headers: {},
				store: {buffer : {}}
			};
			return this;
		},
		set : function(name, value) {
			_private.store[name] = value;
			return this;
		},
		get : function(name) {
			return _private.store[name] ? _private.store[name] : null;
		},
		statusCode: function(){
			var statusCode =  arguments[0];
			if(statusCode)
				_private.statusCode = statusCode;
			return _private.statusCode;
		},
		header: function(){
			var key = arguments[0] ? arguments[0].toLowerCase() : arguments[0];
			var value = arguments[1];
			if(value)
				_private.headers[key] = value;
			if(key && !value)
				return _private.headers[key];
			return this;
		},
		headers: function(){
			return _private.headers;
		},
		buffer: function(){
			if(!arguments[0])
				return _private.store.buffer;
			var app = arguments[0].app.app;
			var handler = arguments[0].app.handler;
			_private.store.buffer = _private.store.buffer ? _private.store.buffer : {};
			_private.store.buffer[app] = _private.store.buffer[app] ? _private.store.buffer[app] : {};
			_private.store.buffer[app][handler] = _private.store.buffer[app][handler] ? _private.store.buffer[app][handler] : [];
			_private.store.buffer[app][handler].push(arguments[0].content);
			return this;
		},
		log: function(severity, message){
			var logfile = _private.store.settings.path + _private.store.settings.debug.file;
			var uri = _private.store.uri;
			var method = _private.store.method;
			if(severity > _private.store.settings.debug.level)
				return;
			var line = (new Date()) + ' (' + severity + ') : [' + uri + '] ' + ' {' + method + '} ' + (JSON.stringify(message));
			fs.appendFile(logfile, line, function(){
				console.log(line);
			});
			return this;
		},
		require: function(){
			return require(_private.store["settings"].path + arguments[0]);
		}
	}
};
