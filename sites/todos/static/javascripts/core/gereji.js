"use strict";
var gereji = function(){};
gereji.extend =
function() {
	var name = arguments[0];
	var extension = arguments[1];
	var module = function(){};
	module.extend = gereji.extend;
	for(var i in this.prototype){
		module.prototype[i] = this.prototype[i];
	}
	for(var j in extension){
		module.prototype[j] = extension[j];
	}
	this[name] = module;
};
