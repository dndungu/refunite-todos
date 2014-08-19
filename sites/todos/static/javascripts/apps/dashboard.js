"use script";
gereji.apps.register("dashboard", function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			app.history_api = !!(window.history && history.pushState);
			if(app.history_api)
				sandbox.on([".list-items:click", ".add-item:click"], app.navigate);
			if(app.history_api)
				window.addEventListener("popstate", app.remember);
			sandbox.on([".add-item:click", ".list-items:click", ".list-body-row:click"], app.render);
			sandbox.on(["body:load", "window:resize"], app.resize);
			sandbox.on([".dashboard-nav:click"], app.reset);
			sandbox.on(".dashboard-dismiss:click", function(){
				history.back();
			});
			app.remember({});
		},
		kill: function(){
		},
        render: function(){
            var target = arguments[0].data.target;
			var data = app.path();
            data.sandbox = sandbox;
            data.stage = target.getAttribute("stage");
			data.mode = target.getAttribute("mode");
            data.about = target.getAttribute("about");
			if(!data.name)
	            data.name = target.getAttribute("name");
			if(!data.type)
	            data.type = target.getAttribute("type");
			if(!data._id)
				data._id = target.getAttribute("_id");
			if(data._id)
				data.data = app.record(data);
			if(!data.about)
				data.about = "/api/" + data.name + "s";
			if(!data.stage)
				data.stage = data.type == "list" ? "primary" : "secondary";
			if(!data.mode)
				data.mode = data.type == "list" && !data._id ? "primary-mode" : "secondary-mode";
			var type = data.type + ":stage";
			sandbox.emit({type: type, data: data});
			if(app.history_api)
				app.setLocation(data);
			app.mode(data.mode);
        },		
		record: function(data){
			data.type = "form";
			var collection = new gereji.collection();
			collection.init();
			collection.meta("name", data.name);
			collection.meta("about", data.about);
			if(collection.ready())
				return collection.filter({_id : data._id});
		},
		resize: function(){
			var height = (new gereji.dom()).findTag("main").getElements()[0].offsetHeight;
			height = height - (new gereji.dom()).findTag("section").findClass("topbar").getElements()[0].offsetHeight;
			(new gereji.dom()).findTag("section").findClass("stage").css({"height": (height + "px")});
		},
		reset: function(){
			arguments[0].data.event.preventDefault();
			(new gereji.dom()).findTag("header").findChildrenTag("a").removeClass("current");
			var target = (new gereji.dom()).setElement(arguments[0].data.target);
			if(!target.hasClass("openclose"))
				return target.addClass("current");
			var subject = target.findNextSibling().findChildrenTag("li").findChildrenTag("a");
			subject.addClass("current");
		},
		toggle: function(){
            var target = arguments[0].data.target;
			var mode = target.getAttribute("mode");
			app.mode(mode);
		},
		mode: function(mode){
			if(!mode)
				mode = "primary-mode";
			(new gereji.dom()).findTag("main").removeClass(["primary-mode", "split-mode", "secondary-mode"]).addClass(mode);
		},
		setLocation: function(data){
			var url = ["/dashboard"];
			var state = {};
			state.mode = data.mode;
			state.stage = data.stage;
			state.about = data.about;
			url.push(data.name);
			url.push(data.type);
			if(data._id)
				url.push(data._id);
			history.pushState(state, null, url.join("/"));
		},
		navigate: function(){
			var target = arguments[0].data.target;
			var data = {};
			data.stage = target.getAttribute('stage');
			data.about = target.getAttribute('about');
			data.mode = target.getAttribute('mode');
			data.name = target.getAttribute('name');
			data.type = target.getAttribute('type');
			app.setLocation(data);
		},
		path: function(){
			var address = location.pathname.split("/");
			if(address.length < 3)
				return {};
			address.splice(0, 2);
			var data = {};
			data.name = address.shift();
			data.type = address.shift();
			if(address.length)
				data._id = address.shift();
			return data;
		},
		remember: function(){
			var data = app.path();
			if(!data)
				return this;
			data.sandbox = sandbox;
			var state = arguments[0].state;
			if(state){
				for(var i in state){
					data[i] = state[i];
				}
			}else{
				data.stage = data.type == "list" ? "primary" : "secondary";
				data.mode = data.type == "list" && !data._id ? "primary-mode" : "secondary-mode";
				data.about = "/api/" + data.name + "s";
			}
			app.mode(data.mode);
			var type = data.type + ":stage";
			if(data._id)
				data.data = app.record(data);
			sandbox.emit({ type : type, data : data });
		}
	}
});
