"use strict";
gereji.apps.register("product", function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			sandbox.on([".product-add-category:keypress"], app.addCategory);
			sandbox.on([".product-category-item:change"], app.removeCategory);
			sandbox.on(["product-form:render"], app.renderForm);
			sandbox.on([".product-variant-value:keypress", ".product-variant-value:change"], app.updateVariants);
			sandbox.on([".product-variant-name:change"], app.renderVariantInput);
			sandbox.on(["product:sync"], app.complete);
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
			var position = (new gereji.dom()).findTag('input').findClass('product-category-item').getElements().length;
			var li = [];
			li.push('<li class="grid2 half-space-top">');
			li.push('<label>');
			li.push('<input class="product-category-item" name="tags" property="tags[' + position + ']" type="checkbox" value="' + value + '" checked="true"/>');
			li.push('&#160;' + label);
			li.push('</label>');
			li.push('</li>');
			(new gereji.dom()).findTag("ul").findClass("product-category-list").append(li.join(''));
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
			app.data = {};
			app.variants = {};
			app.data = arguments[0].data[0];
			app.renderCategories();
			if(!app.data)
				return (app.data = {variants : []});
			app.renderVariants();
			app.variants = app.formatVariants();
			var data = {};
			data.target = (new gereji.dom()).findTag("*").findClass("product-variant-name").getElements()[0];
			app.renderVariantInput({ data : data });
		},
		formatVariants: function(){
			var variants = app.data.variants ? app.data.variants : {};
			var results = {};
			for(var i in variants){
				for(var j in variants[i].variants){
					var variant = variants[i].variants[j];
					if(!results.hasOwnProperty(variant.name))
						results[variant.name] = [];
					results[variant.name].push(variant.content);
				}
			}
			return results;
		},
		renderVariants: function(){
			var div = (new gereji.dom()).findTag('div').findClass('product-variants');
			var xslt = new gereji.xslt();
			xslt.init({type: "list", name: "variant"});
			xslt.broker.on(["update", "ready"], function(){
				xslt.transform({variants : app.data.variants});	
				div.html(xslt.getHTML());
			});
			xslt.fetch();
		},
		renderVariantInput: function(){
			var target = arguments[0].data.target;
			var name = target.value;
			var value = [];
			if(app.variants.hasOwnProperty(name))
				value = app.variants[name];
			var text = [];
			for(var i in value){
				if(text.indexOf(value[i]) == -1)
					text.push(value[i]);
			}
			(new gereji.dom()).findTag("*").findClass("product-variant-value").value(text.join(", "));
		},
		updateVariants: function(){
            var event = arguments[0].data.event;
			if(arguments[0].type == ".product-variant-value:keypress")
				if([13,44].indexOf(event.keyCode) == -1)
					return;
            var target = arguments[0].data.target;
            var attributes = target.value.split(",");
            var name = (new gereji.dom()).findTag("*").findClass("product-variant-name").value();
			app.variants[name] = [];
            for(var i = 0; i < attributes.length; i++){
                var content = attributes[i].trim();
                if(!content.length)
                    continue;
                if(app.variants[name].indexOf(content) == -1)
                    app.variants[name].push(content);
            }
			if(!app.variants[name].length)
				delete app.variants[name];
			var keys = [];
			for(var name in app.variants){
				var key = [];
				for(var i in app.variants[name]){
					key.push(Number(i));
				}
				if(key.length)
					keys.push(key);
			}
			var rows = [];
			if(keys.length)
				rows = app.cartesian.apply(this, keys);
			if(!app.data.variants)
				app.data.variants = [];
			app.revert(rows);
			for(var i in rows){
				var row = rows[i].slice(0);
				var columns = [];
				for(var name in app.variants){
					columns.push({name: name, content: app.variants[name][row.shift()]});
				}
                var variant = app.variant();
                variant.variants = columns.slice(0);
                app.data.variants.push(variant);
			}
			app.data.variants.sort();
			app.renderVariants();
		},
		cartesian: function(){
			var r = [], arg = arguments, max = arg.length - 1;
			function combine(arr, i){
				var l = arg[i].length;
				for (var j=0; j<l; j++) {
					var a = arr.slice(0);
					a.push(arg[i][j]);
					if (i==max){
						r.push(a);
					}else{
						combine(a, i+1);
					}
				}
			}
			combine([], 0);
			return r;
		},
		revert: function(rows){
			for(var i in app.data.variants){
				for(var j in app.data.variants[i].variants){
					var variant = app.data.variants[i].variants[j];
                    if(!app.variants.hasOwnProperty(variant.name) || app.variants[variant.name].indexOf(variant.content) == -1){
                        delete app.data.variants[i];
						break;
					}
					if(!app.variants.hasOwnProperty(variant.name))
						delete app.data.variants[i].variants[j];
				}
			}
			for(var i in app.data.variants){
				var item = [];
				for(var j in app.data.variants[i].variants){
					var variant = app.data.variants[i].variants[j];
					item.push(app.variants[variant.name].indexOf(variant.content));
				}
				for(var k in rows){
					if(rows[k].length != app.data.variants[i].variants.length)
						return (app.data.variants = []);
					if(rows[k].join("") == item.join(""))
						rows.splice(k, 1);
				}
			}
		},
		variant: function(){
			return {
				_id: ((new gereji.storage()).uuid()),
				variants: [],
				price: {
					price:(new gereji.query()).init('input[name="price"]').value(),
					currency: "KES"
				},
				capacity: {
					capacity: 0,
					unit: "Kg"
				},
				pre_order: false,
				stock: 1,
				sku: ""
			};
		},
		renderCategories: function(){
			var ul = (new gereji.dom()).findTag("*").findClass("product-category-list").getElements()[0];
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
					input.className = "product-category-item";
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
		},
		complete: function(){
			var model = arguments[0].data;
			var name = model.get("name");
			if(!model.get("page_title"))
				model.set("page_title", name)
			if(!model.get("handle"))
				model.set("handle", app.url(name));
			if(model.get("handle").substring(0, 9) != "/product/")
				model.set("handle", "/product/" + model.get("handle"));
			if(!model.get("meta_description"))
				model.set("meta_description", app.description(model.get("notes")));
			return this;
		},
		url:function(text){
			return encodeURIComponent(text.replace(/\s/g, "-")).toLowerCase();
		},
		description: function(text){
			if(text.length < 150)
				return text;
			text = text.substring(0, 150);
			var stop = text.lastIndexOf(".");
			if(stop == -1)
				stop = text.length;
			return text.substring(0, stop);
		}
	};
});
