"use strict";
gereji.extend("model", {
	init: function(){
		this.status = "ready";
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
		this.store = {data: {}, meta: {}};
		return this;
	},
    ready: function(){
		if(arguments[0])
			this.status = arguments[0];
        return (this.status == "ready");
    },
	meta: function(){
		var key = arguments[0] ? arguments[0] : undefined;
		var value = arguments[1] ? arguments[1] : undefined;
		if(value != undefined)
			this.store.meta[key] = value;
		if(key != undefined && value == undefined)
			return this.store.meta[key] ? this.store.meta[key] : undefined;
		return this;
	},
	set: function(property, value){
		var store = this.store.data;
		var pattern = /\[([\d])\]/g;
		var path = 'this.store.data';
		var keys = property.split(/\./g);
		for(var i = 0; i < keys.length; i++){
			var indices = keys[i].match(pattern);
			path += "." + keys[i].replace(pattern, "");
			eval(path + " = " + path + " ? " + path + " : " + (indices ? "[]" : "{}"));
			if(!indices)
				continue;
			for(var j = 0; j < indices.length;  j++){
				path += indices[j];
				eval(path + " = " + path + " ? " + path + " : {}");
			}
		}
		eval(path + " = value");
		return this;
	},
	get: function(key){
		var test = 'this.store.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		var value = undefined;
		for(var i in path){
			test += "." + path[i];
			value = eval(test) === undefined ?  undefined : (index ? eval(test + "[" + index + "]") : eval(test));
		}
		return value;
	},
	sync: function(){
		var self = this;
		var url = this.meta("about");
		var data = JSON.stringify(this.store.data);
		var broker = this.broker;
		this.ajax.post(url, data, function(){
			self.broker.emit({type: "sync", data: arguments[0]});
		});
	},
	destroy: function(){
		this.store = {};
	},
	serialize: function(){
		return JSON.stringify(this.store);
	},
	find: function(){
		return this.store.data;
	}
});
