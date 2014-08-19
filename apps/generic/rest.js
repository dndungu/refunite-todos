"use strict";
module.exports = {
	"get": function(sandbox){
		try{
			sandbox.operation = "find";
			var model = new (sandbox.context.require("apps/generic/lib/model.js"));
			model.init(sandbox);
            if(!model.allow)
                sandbox.context.statusCode(401);
			if(!model.allow)
				throw new Error("You are not allowed access to this resource.");
			if(sandbox._id)
				model.query._id = sandbox._id;
			model.collection.find(model.query).sort({creation_time: -1}).toArray(function(error, items){
				if(!error)
					return sandbox.data(items).end();
				sandbox.context.log(2, error.stack);
				throw new Error("Error while trying query collection.");
			})
		}catch(error){
			sandbox.context.log(2, error.stack);
			sandbox.data({error: error.stack});
			sandbox.end();
		}
	},
	"post": function(sandbox){
		try{
			var model = new (sandbox.context.require("apps/generic/lib/model.js"));
			model.init(sandbox);
            if(!model.allow)
                sandbox.context.statusCode(401);
            if(!model.allow)
                throw new Error("User is not allowed write access to this resource.");
            if(sandbox._id)
                model.query._id = sandbox._id;
			model[sandbox.operation](function(error, items){
				if(error)
					throw new Error(error);
				return sandbox.data(items).end();
			});
		}catch(error){
			sandbox.context.log(2, error.toString());
			sandbox.context.statusCode(503);
			sandbox.data({error: error.toString()});
			sandbox.end();
		}
	},
	"delete": function(sandbox){
		try{
			sandbox.operation = "remove";
			var model = new (sandbox.context.require("apps/generic/lib/model.js"));
			model.init(sandbox);
            if(!model.allow)
                sandbox.context.statusCode(401);
            if(!model.allow)
                throw new Error("You are not allowed to delete this resource.");
            if(sandbox._id)
                model.query._id = sandbox._id;
			model.collection.remove(query, function(error, items){
				if(!error)
					return sandbox.data(items).end();
				sandbox.context.statusCode(503);
				return sandbox.data({error: error.toString()}).end();
			});
		}catch(error){
			sandbox.context.log(2, error.toString());
			sandbox.data({error: error.toString()});
			sandbox.end();
		}
	},
	"put": function(sandbox){
		//TODO
	}
};
