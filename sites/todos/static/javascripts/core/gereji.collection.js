"use strict";
gereji.extend("collection", {
	init: function(){
		this.store = { data: null, meta: {}, ready: false };
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
        this.storage = new gereji.storage();
        this.storage.init();
		return this;
	},
    ready: function(){
		var collections = this.storage.get("collections");
		var name = this.store.meta.name;
		this.store.ready = collections.hasOwnProperty(name);
		if(this.store.ready)
			this.store.data = collections[name];
        return this.store.ready;
    },
	data: function(){
		if(arguments[0])
			this.store.data = arguments[0];
		return this.store.data;
	},
	filter: function(filter){
		var match;
		var records = this.store.data;
		var results = [];
		for(var i in records){
			match = true;
			for(var j in filter){
				match = (records[i][j] == filter[j]);
				if(!match)
					break;
			}
			if(match)
				results.push(records[i]);
		}
		return results;
	},
	fetch: function(){
		var name = this.store.meta.name;
		var that = this;
		this.ajax.get(this.store.meta.about, function(response){
			var response = JSON.parse(response);
			var collections = that.storage.get("collections");
			collections[name] = response;
			that.store.data = collections[name];
			that.storage.set("collections", collections);
			that.broker.emit({type: "update", data: response});
		});
		return this;
	},
    meta: function(){
        var key = arguments[0];
        var value = arguments[1];
        if(value != undefined)
            this.store.meta[key] = value;
        if(key != undefined && value == undefined)
            return this.store.meta[key] ? this.store.meta[key] : undefined;
        return this;
    }
});
