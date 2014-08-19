"use strict";
gereji.extend('xslt', {
	init: function(options){
		this.options = options;
		this.store = {ready: false};
		this.name = options.type + "-" + options.name;
		this.broker = new gereji.broker();
		this.broker.init();
		this.sync = new gereji.sync();
		this.sync.init();
		this.storage = new gereji.storage();
		this.storage.init();
		this.processor = new XSLTProcessor();
		return this;
	},
	ready: function(){
		var templates = this.storage.get("templates");
		this.store.ready = templates.hasOwnProperty(this.name);
		if(this.store.ready)
			this.xsl = templates[this.name];
		return this.store.ready;
	},
	fetch: function(){
		var url = "/static/" + this.options.type + "/" + this.options.name + ".xsl";
		var that = this;
		this.sync.get(url, function(xsl){
			that.xsl = xsl;
			var templates = that.storage.get("templates");
			templates[that.name] = xsl;
			that.storage.set("templates", templates);
			that.broker.emit({type: "update", data: null});
		});
		return this;
	},
	transform: function(data){
		this.style = this.parse(this.xsl);
		this.processor.importStylesheet(this.style);
		this.xml = this.json2xml({data : data});
		this.doc = this.parse(this.xml);
		this.html = this.processor.transformToFragment(this.doc, document);
		return this;
	},
	getHTML: function(){
		return this.html;
	},
	json2xml: function(){
		var data = arguments[0];
		if(typeof data == 'string')
			data = JSON.parse(data)
		var xml = this.createXML(data);
		xml.unshift('<?xml version="1.0"?>');
		return xml.join("\n");
	},
	createXML: function(){
        var content = arguments[0];
        var xml = [];
        for(var i in content){
            var name = isNaN(i) ? i : 'node-' + String(i);
			var nested = ['number', 'boolean', 'string'].indexOf(typeof content[i]) == -1;
            var value = nested ? this.createXML(content[i]) : this.encode(String(content[i]));
            xml.push('<' + name + '>' + value + '</' + name + '>');
        }
        return xml;
	},
	encode: function(html){
		return document.createElement( 'a' ).appendChild(document.createTextNode( html ) ).parentNode.innerHTML;
	},
	parse: function(){
		try{
			return ((new DOMParser).parseFromString(arguments[0], "application/xml"));
		}catch(e){
			console && console.log(e);
			var doc = document.implementation.createHTMLDocument("");
			doc.documentElement.innerHTML = arguments[0];
			return doc;
		}
	}
});
