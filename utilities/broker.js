"use strict";
var fs = require("fs");
module.exports = function(){
	var _private = {
		events: [],
		store: {}
	};
	return {
		init: function(){
			_private.events = [];
		},
        set : function(name, value) {
            _private.store[name] = value;
            return this;
        },
		on : function() {
			var types = typeof arguments[0] == "string" ? [ arguments[0] ] : arguments[0];
			for ( var i in types) {
				var type = types[i];
				_private.events[type] = typeof _private.events[type] == 'undefined' ? [] : _private.events[type];
				_private.events[type].push(arguments[1]);
			}
		},
		emit : function(_event) {
			_event = typeof _event == "string" ? {type : _event, data : {}} : _event;
			_event.data = typeof _event.data == "undefined" ? {} : _event.data;
			try{
				this.log(5, _event);
				var listeners = _private.events[_event.type];
				if(!listeners) throw new Error('There  are no event listeners for ' + _event.type);
				for(var i in listeners){
					typeof listeners[i] === 'function' && listeners[i](_event);
				}
			}catch(error){
				console.log(error.stack);
				this.log(2, error.toString());
			}
		},
        log: function(severity, message){
			var settings = _private.store.context.get("settings");
            var logfile = settings.debug.file;
            var uri = _private.store.context.get("uri");
            var method = _private.store.context.get("method");
            if(severity > settings.debug.level) return;
            var line = (new Date()) + ' (' + severity + ') : [' + uri + '] ' + ' {' + method + '} ' + (JSON.stringify(message));
            fs.appendFile(logfile, line, function(){
                console.log(line);
            });
            return this;
        }
	}
};
