"use strict";
var fs = require("fs");
module.exports = function(){
	return {
		path: function(){
			this.store = { path: arguments[0] };
		},
		pipe: function(response){
			this.stream = fs.createReadStream(this.store.path);
            this.stream.on("end", function(){
                response.end();
            });
			this.stream.pipe(response);
		},
		expires: function(){
            var d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            return d.toUTCString();
		},
		size: function(){
			var stats = fs.statSync(this.store.path);
			return stats["size"];
		},
		type: function(){
			var ext = this.store.path.split(".").reverse().shift().toLowerCase();
			return this.types[ext];
		},
		types: {
                "xsl": "application/xml",
                "js": "application/javascript",
                "jpg": "image/jpeg",
                "png": "image/png",
                "gif": "image/gif",
                "jpeg": "image/jpeg",
                "css": "text/css",
                "ico": "image/x-icon"
		}
	};
};
