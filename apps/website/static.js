"use strict";
module.exports = {
    get: function(sandbox){
		var home = sandbox.context.get("site").home;
		var path = "favicon.ico";
		if(sandbox.context.get("parameters").path)
			path = sandbox.context.get("parameters").path;
		path = sandbox.context.get("settings").path + "sites/" + home + "/static/" + path;
		path = path.indexOf("?") == -1 ? path : path.slice(0, path.indexOf("?"))
		var response = sandbox.context.get("response");
		try{
			var sf = new (sandbox.context.require("apps/generic/lib/static-file.js"));
			sf.path(path);
            response.writeHead(200, {
                "Content-Length": sf.size(),
                "Content-Type": sf.type(),
                "Expires": sf.expires()
            });
			sf.pipe(response);
		}catch(error){
			console.log(error.stack);
			sandbox.context.log(3, error.toString());
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.end();
		}
    }
};
