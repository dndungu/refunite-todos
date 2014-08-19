"use strict";
gereji.apps.register("post", function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on([".post-add-category:keypress"], app.addCategory);
			sandbox.on([".post-category-item:change"], app.removeCategory);
			sandbox.on(["post-form:render"], app.renderForm);
		},
		kill: function(){
		},
		addCategory: function(){
			var event = arguments[0].data.event;
			if(event.keyCode != 44)
				return;
			var target = arguments[0].data.target;
			if(!target.value.length)
				return;
			var value = target.value.trim().toLowerCase();
			var label = value.charAt(0).toUpperCase() + value.slice(1);
			var position = (new gereji.dom()).findTag('input').findClass('post-category-item').getElements().length;
			var li = [];
			li.push('<li class="grid2 half-space-top">');
			li.push('<label>');
			li.push('<input class="post-category-item" name="tags" property="tags[' + position + ']" type="checkbox" value="' + value + '" checked="true"/>');
			li.push('&#160;' + label);
			li.push('</label>');
			li.push('</li>');
			(new gereji.dom()).findTag("ul").findClass("post-category-list").append(li.join(''));
			target.value = "";
			event.preventDefault();
			var sync = new gereji.sync();
			sync.init();
			sync.post("/api/tags", '{"tag" : "' + value + '"}', function(){console.log(arguments[0])});
		},
		removeCategory: function(){
			var target = arguments[0].data.target;
			if(!target.checked)
				(new gereji.dom()).setElement(target).findParentTag("li").remove();
		},
		renderForm: function(){
			app.data = arguments[0].data[0];
			app.renderCategories();
		},
		renderCategories: function(){
			var ul = (new gereji.dom()).findTag("*").findClass("post-category-list").getElements()[0];
			var tags = app.data && app.data.tags ? app.data.tags : [];
			var i = tags.length;
			var collection = new gereji.collection();
			collection.init();
			collection.meta("name", "tags");
			collection.meta("about", "/api/tags");
			var render = function(){
				var data = collection.data();
				for(var j in data){
					var tag = data[j].tag;
					if(tags.indexOf(tag) != -1)
						continue;
					var li = document.createElement("li");
					li.className = "grid2 half-space-top";
					var label = document.createElement("label");
					var input = document.createElement("input");
					input.name = "tags";
					input.type = "checkbox";
					input.className = "post-category-item";
					input.setAttribute("property", "tags[" + i++ + "]");
					input.value = tag;
					label.appendChild(input);
					label.innerHTML += "&nbsp;" + tag.charAt(0).toUpperCase() + tag.slice(1);
					li.appendChild(label);
					ul.appendChild(li);
				}
			};
			collection.broker.on("update", render);
			collection.fetch();
		}
	};
});
