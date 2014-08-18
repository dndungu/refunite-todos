"use strict";
module.exports = function(){
	var _private = {
		store: {}
	};
	return {
		init: function(){
			for(var i in arguments[0]){
				_private.store[i] = arguments[0][i];
			}
		},
		set: function(key, value){
			_private.store[key] = value
		},
		get: function(key){
			return _private.store[key] ? _private.store[key] : null;
		},
		hasPermission: function(){
			var permission = arguments[0];
			return (_private.store.permissions.indexOf(arguments[0]) != -1);
		},
		authoredItems: function(items){
			var user_id = this.get("_id");
			user_id = user_id == "guest" ? null : user_id;
			for(var i in items){
				if(items[i].author != user_id)
					items.splice(i);
			}
			return items;
		}
	}
};
