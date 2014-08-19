"use strict";
gereji.view.extend("form", {
    init: function(options){
		this.options = options;
        this.initStore();
        this.initBroker();
        this.initStage();
        this.initTemplate();
		this.initModel();
		this.attachEvents();
		this.activate();
		return this;
	},
	initModel: function(){
		this.store.source = new gereji.model();
		this.store.source.init();
		this.store.source.meta("about", this.options.about);
		this.store.source.meta("name", this.options.name);
		if(this.options.data)
			this.store.source.store.data = this.options.data;
		return this;
	},
	getModel: function(){
		return this.store.source;
	},
	attachEvents: function(){
		var that = this;
        this.store.template.broker.on(["ready", "update"], function(){
            that.render();
        });
	},
	activate: function(){
        var template = this.store.template;
        if(!template.ready())
            template.fetch();
	},
	render: function(){
		if(!this.store.template.ready())
			return this;
        var data = this.store.source.find();
        this.store.template.transform(data);
        this.store.stage.innerHTML = "";
		var html = this.store.template.getHTML();
        this.store.stage.appendChild(html);
		this.renderSelects();
		this.renderUploadBoxes();
		this.options.sandbox.emit({type: "body:change", data: this.store.stage});
		var type = this.options.name + "-form:render";
		this.options.sandbox.emit({type: type, data: this.options.data});
		this.initEditor();
        return this;		
	},
	renderSelects: function(){
		var data = this.options.data;
		var elements = (new gereji.query()).setElement(this.store.stage).children('select');
		elements.each(function(element){
			var collection = new gereji.collection();
			collection.init();
			var name = element.getAttribute("collection");
			var about = element.getAttribute("about");
			if(!name || !about)
				return;
			var property = element.getAttribute("property");
			collection.meta("name", name);
			collection.meta("about", about);
			var text = element.getAttribute("text");
			var value = element.getAttribute("value");
			var lastOption;
			var options = element.getElementsByTagName('option');
			if(options)
				lastOption = options[(options.length-1)]
			var render = function(){
				var records = arguments[0].data;
				for(var j in records){
					var option = document.createElement("option");
					option.innerHTML = records[j][text];
					option.value = records[j][value];
					if(data && data[0] && records[j][value] == data[0][property])
						option.selected = "selected"
					if(lastOption)
						lastOption.parentNode.insertBefore(option, lastOption);
					if(!lastOption)
						element.appendChild(option);
				}
			};
			collection.broker.on("update", render);
			if(collection.ready()) 
				render(collection.data());
			collection.fetch();
		});
	},
	renderUploadBoxes: function(){
		var elements = (new gereji.query()).setElement(this.store.stage).children('input.upload-box-values');
		elements.each(function(element){
			if(!element.value.length)
				return;
			var values = element.value.split(',');
			var box = (new gereji.query()).setElement(element).next().elements[0];
			for(var i in values){
				if(!values[i].length)
					continue;
				var clone = box.cloneNode(true);
				var animation = (new gereji.query()).setElement(clone).findChildrenTag('.animation');
				animation.css({display : "none"});
				var placeholder = (new gereji.query()).setElement(clone).children('.placeholder');
				var bg = "url('/images/" + values[i] + "')";
				placeholder.css({backgroundImage: bg, "border-width": 0, display: "block"});
				element.parentNode.appendChild(clone);
				(new gereji.query()).setElement(clone).children("i.upload-box-uncheck").css({display: "inline-block"});
				(new gereji.query()).setElement(clone).children("i.upload-box-add").css({display: "none"});
			}
			box.remove();
		});
	},
	initEditor: function(){
		if(typeof tinymce == "undefined")
			return this;
		setTimeout(function(){
			tinymce.init({
				menubar : false,
				plugins : 'imagestudio code paste',
				toolbar : 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link imagestudio | code',
				selector: "textarea.html-editor",
				document_base_url : "/",
				entity_encoding : "numeric",
				relative_urls : true
			});
		},100);
		return this;
	}
});
