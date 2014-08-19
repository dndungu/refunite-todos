"use strict";
gereji.view.extend("list", {
	init: function(options){
		this.options = options;
        this.initStore();
        this.initBroker();
		this.initStage();
        this.initTemplate();
		this.initCollection();
		this.attachEvents();
		return this;
	},
	initCollection: function(){
		this.store.source = new gereji.collection();
		this.store.source.init();
		this.store.source.meta("name", this.options.name);
		this.store.source.meta("about", this.options.about);
		this.store.source.fetch();
		return this;
	},
	attachEvents: function(){
		var that = this;
		this.store.template.broker.on(["update"], function(){
			if(that.store.source.ready())
				that.render();
		});
        this.store.source.broker.on(["update"], function(){
			if(that.store.template.ready())
				that.render();
        });
	},
    render: function(){
		if(!this.store.template.ready() || !this.store.source.ready())
			return this;
        var data = this.store.source.data();
        this.store.template.transform(data);
        this.store.stage.innerHTML = "";
        this.store.stage.appendChild(this.store.template.getHTML());
		this.options.sandbox.emit({type: "body:change", data: this.store.stage});
        return this;
    }
});
