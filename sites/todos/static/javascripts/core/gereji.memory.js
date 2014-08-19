"use strict";
gereji.extend('memory', {
	store: {},
	getItem: function(key){
		return this.store[key] ? this.store[key] : null;
	},
	setItem: function(key, value){
		this.store[key] = value;
		return this;
	},
	hasOwnProperty: function(key){
		return this.store.hasOwnProperty(key);
	}
});
