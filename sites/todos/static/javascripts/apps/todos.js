"use strict";
gereji.apps.register('todos', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on([".add-item:click", ".edit-item:dblclick"], app.form);
			sandbox.on(['form:submit'], app.submit);
			sandbox.on(["todo:drop"], app.moveStage);
			sandbox.on(["body:load"], function(){
				app.render(["ideas-list", "developing-list", "testing-list", "production-list"]);
			});
		},
		kill: function(){
			
		},
		render: function(stages){
			var collection = new gereji.collection();
			collection.init();
			collection.meta("name", "todo");
			collection.meta("about", "/api/todos");
			var template = new gereji.xslt();
			template.init({name:"todo" , type:"list"});
			var render = function(){
				if(!collection.ready() || !template.ready())
					return;
				for(var i = 0; i < stages.length; i++){
					var filter = {
						stage: stages[i].replace("-list", "")
					};
					var records = collection.filter(filter);
					var stage = document.getElementById(stages[i]);
					stage.innerHTML = "";
					stage.appendChild(template.transform(records).getHTML());
				}
			};
			collection.broker.on("update", render);
			template.broker.on("update", render);
			collection.fetch();
			template.fetch();
		},
		form: function(){
			var type = arguments[0].type;
			var target = arguments[0].data.target;
			var options = {
				sandbox: sandbox,
				name : target.getAttribute("name"),
				about: target.getAttribute("about"),
				stage: target.getAttribute("stage"),
				type: "form"
			};
			var view = new gereji.view.form();
			if(type == ".edit-item:dblclick")
				options.data = [{ _id: options.stage, todo : target.innerHTML}];
			view.init(options);
			view.render();
			if(type == ".add-item:click")
				return (target.style.display = "none");
			(new gereji.query())
			.setElement(target)
			.ancestor(".collapsible")
			.removeClass("collapsible-close")
			.addClass("collapsible-open");
		},
        submit: function(){
            var target = arguments[0].data.target;
            var event = arguments[0].data.event;
            var options = {};
            options.about = target.getAttribute('about');
            options.name = target.getAttribute("name");
            if(!options.about || !options.name)
                return this;
            options.type = "form";
            options.about = options.about.replace(/\/$/, "");
            event.preventDefault();
            var model = new gereji.model();
            model.init();
            model.meta("about", options.about);
            model.meta("name", options.name);
            if(!app.parse(["textarea"], target, model))
                return this;
			var hashtags = model.get("todo").match(/(#[\w]*)/g);
			if(hashtags)
				model.set("hashtags", hashtags.join(",").replace(/#/g, '').split(','));
			var handles = model.get("todo").match(/(@[\w]*)/g);
			if(handles)
				model.set("handles", handles.join(",").replace(/@/g, '').split(','));
			var stage = (new gereji.query()).setElement(target).ancestor(".droppable").elements[0].id.replace("-list", "").replace("-form", "");
			model.set("stage", stage);
            sandbox.emit({type: options.name + ":sync", data: model});
			model.broker.on("sync", function(){
				app.render([stage+"-list"]);
				target.remove();
			});
            model.sync();
			target.style.display = "none";
			if(options.about == "/api/todos")
				(new gereji.query()).init('a[stage="' + stage + '-list"]').css({display: "block"});
            return this;
        },
        parse: function(tags, target, model){
            for(var i in tags){
                var tagName = tags[i];
                var elements = target.getElementsByTagName(tagName);
                for(var i = 0; i < elements.length; i++){
                    var property = elements[i].getAttribute("property");
                    var type = elements[i].getAttribute("type");
                    if(!property)
                        continue;
                    if(["radio", "checkbox"].indexOf(type) != -1 && !elements[i].checked)
                        continue;
                    if(!app.validate({data: {target : elements[i]}}))
                        return false;
                    model.set(property, elements[i].value);
                }
            }
            return true;
        },
        validate: function(){
            var target = arguments[0].data.target;
            var element = (new gereji.query()).setElement(target);
            element.removeClass('invalid-input');
            var cls = target.className.split(' ');
            for(var i in cls){
                if(sandbox.validator.test(cls[i], target.value))
                    continue;
                target.focus();
                element.addClass(" invalid-input");
                if(target.tagName.toLowerCase() != 'select')
                    target.value = "";
                if(element.hasClass("required"))
                    return false;
            }
            return true;
        },
		moveStage: function(){
			var object = (new gereji.query()).setElement(arguments[0].data.object).children('span[property="todo"]');
			var form = document.createElement("form");
			var about = "/api/todos/" + object.attribute("stage");
			form.setAttribute("about", about);
			form.setAttribute("name", "todo");
			var textarea = document.createElement("textarea");
			textarea.setAttribute("property", "todo");
			textarea.innerHTML = object.html();
			form.appendChild(textarea);
			form.style.display = "none";
			arguments[0].data.area.appendChild(form);
			app.submit({data : {target : form, event: {preventDefault: function(){} }}});
			setTimeout(function(){
				form.remove();
			}, 900);
		}
	}
});
