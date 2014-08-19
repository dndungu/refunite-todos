"use strict";
module.exports = {
	"get": function(sandbox){
		var age = sandbox.context.get("settings").cookie.age;
		var expires = (new Date((new Date()).valueOf() - (age*1000))).toUTCString();
		var name = sandbox.context.get("settings").cookie.name;
		var _g = sandbox.context.get("encryption").password(16);
		var secure = sandbox.context.get("settings").server.secure;
		var cookie = {name: name, value: _g, path: "/", expires: expires, secure: secure, httpOnly: true};
		sandbox.context.get("cookies").push(cookie);
		sandbox.end();
	}
};
