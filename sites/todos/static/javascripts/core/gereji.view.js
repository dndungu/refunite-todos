"use strict";
gereji.extend("view", {
	ready: function(){
		return (this.store.template.ready() && this.store.source.ready());
	},
    initStore: function(){
        this.store = {
            data: {},
            template: {},
            stage: {}
        };
        return this;
    },
    initBroker: function(){
        this.broker = new gereji.broker();
        this.broker.init();
		return this;
    },
    initStage: function(){
        this.store.stage = document.getElementById(this.options.stage);
        return this;
    },
    initTemplate: function(){
        this.store.template = new gereji.xslt();
        this.store.template.init(this.options);
		this.store.template.fetch();
        return this;
    }
});
