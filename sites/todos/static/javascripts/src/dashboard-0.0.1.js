"use strict";
var gereji = function(){};
gereji.extend =
function() {
	var name = arguments[0];
	var extension = arguments[1];
	var module = function(){};
	module.extend = gereji.extend;
	for(var i in this.prototype){
		module.prototype[i] = this.prototype[i];
	}
	for(var j in extension){
		module.prototype[j] = extension[j];
	}
	this[name] = module;
};
"use strict"
gereji.extend('broker', {
	init: function(){
		this.events = [];
		return this;
	},
	on : function() {
		var types = typeof arguments[0] == "string" ? [ arguments[0] ] : arguments[0];
		for ( var i in types) {
			var type = types[i];
			this.events = this.events ? this.events : {};
			this.events[type] = typeof this.events[type] == 'undefined' ? [] : this.events[type];
			this.events[type].push(arguments[1]);
		}
		return this;
	},
	emit : function(_event) {
		_event = typeof _event == "string" ? {type : _event, data : {}} : _event;
		_event.data = typeof _event.data == "undefined" ? {} : _event.data;
		try{
			var listeners = this.events ? this.events[_event.type] : [];
			for(var i in listeners){
				typeof listeners[i] === 'function' && listeners[i](_event);
			}
			return this;
		}catch(e){
			console && console.error(e.stack);
		}
	}
});
"use strict";
gereji.extend('sync', {
	init: function(){
		this.headers = {};
		this.headers["x-powered-by"] = "gereji";
		this.headers["content-type"] = "application/json";
		this.headers["cache-control"] = "no-cache";
		this.broker = new gereji.broker();
		this.broker.init();
		this.options = {"async": true};
		this.transport = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	},
	header: function(key, value){
		this.headers[key] = value;
		return this;
	},
	get: function(uri, then){
		return this.request({uri: uri, method: 'GET', complete: then});
	},
	post: function(uri, payload, then){
		return this.request({method: 'POST', uri: uri, data: payload, complete: then});
	},
	put: function(uri, payload, then){
		var that = this;
		var events = ["abort", "error", "load", "loadstart", "loadend", "progress"];
		for(var i in events){
			this.transport.upload.addEventListener(events[i], function(ev){
				that.broker.emit({type: ev.type, data: ev});
			}, false);
		}
		return this.request({method: 'PUT', uri: uri, data: payload, complete: then});
	},
	"delete": function(uri, then){
		return this.request({method: 'DELETE', uri: uri, complete: then});
	},
	request: function(){
		var args = arguments[0];
        try{
            this.transport.onreadystatechange = function(){
				var xhr = arguments[0].target;
				xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400 && args.complete(xhr.responseText);
			};
            this.transport.open(args.method, args.uri, this.options);
			for(var i in this.headers){
				this.transport.setRequestHeader(i, this.headers[i]);
			}
            this.transport.send(args.data)
			return this;
        }catch(e){
            console && console.log(e);
        }
    },
	xget: function(uri, then){
		try{
			var script = document.createElement("script");
			script.src = uri;
			script.readyState
				? 
					script.onreadystatechange = function(){
						if(script.readyState != "loaded" && script.readyState != "complete") return;
						then();
						script.onreadystatechange = null;
					}
				:
					script.onload = then;
			script.type = 'text/javascript';
			script.async = true;
			document.getElementsByTagName('head')[0].appendChild(script);
		}catch(e){
			console && console.log(e);
		}
	}
});
"use strict";
gereji.extend('storage', {
	init: function(){
		this.scope = arguments[0] ? arguments[0] : 'gereji';
		this.store = localStorage ? localStorage : new gereji.memory();
		this.store.hasOwnProperty(this.scope) || this.store.setItem(this.scope, "{}");
	},
	set: function(key, value){
		var store = this.getStore();
		store[key] = value;
		this.store.setItem(this.scope, JSON.stringify(store));
	},
	get: function(key){
		var store = this.getStore();
		return store.hasOwnProperty(key) ? store[key] : {};
	},
	where: function(filters){
		var store = this.getStore();
		var matches = [];
		for(var i in store){
			
		}
	},
	getStore: function(){
		return this.store.hasOwnProperty(this.scope) ? JSON.parse(this.store.getItem(this.scope)) : {};
	},
	uuid: function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
	}
});
"use strict";
gereji.extend("validator", {
	test: function(type, input){
		switch(type){
			case "required":
				return String(input).length;
				break;
			case "string":
				return this.testString(input);
				break;
			case "integer":
				return this.testInteger(input);
				break;
			case "positiveinteger":
				return this.testPositiveInteger(input);
				break;
			case "negativeinteger":
				return this.testNegativeInteger(input);
				break;
			case "currency":
				return this.testCurrency(input);
				break;
			case "double":
				return this.testDouble(input);
				break;
			case "positivedouble":
				return this.testPositiveDouble(input);
				break;
			case "negativedouble":
				return this.testNegativeDouble(input);
				break;
			case "percent":
				return this.testPercent(input);
				break;
			case "phone":
				return this.testPhone(input);
				break;
			case "year":
				return this.testYear(input);
				break;
			case "date":
				return this.testDate(input);
				break;
			case "ip":
				return this.testIP(input);
				break;
			case "password":
				return this.testPassword(input);
				break;
			case "email":
				return this.testEmail(input);
				break;
			case "domain":
				return this.testDomain(input);
				break;
			case "subdomain":
				return this.testSubDomain(input);
				break;
			case "handle":
				return this.testHandle(input);
				break;
			case "url":
				return this.testURL(input);
				break;
			case "uuid":
				return this.testUUID(input);
				break;
			case "boolean":
				return (typeof input == "boolean");
				break;
			default:
				return true;
				break;
		}
	},
    testString: function(){
        var pattern = /^.+$/i;
        return pattern.test(arguments[0]);
    },
    testInteger: function(){
        var pattern = /^-{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPositiveInteger: function(){
        var pattern = /^\d+$/;
        return pattern.test(arguments[0]);
    },
    testNegativeInteger: function(){
        var pattern = /^-\d+$/;
        return pattern.test(arguments[0]);
    },
    testCurrency: function(){
        var pattern = /^-{0,1}\d*\.{0,2}\d+$/;
        return pattern.test(arguments[0]);
    },
    testDouble: function(){
        var pattern = /^-{0,1}\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPositiveDouble: function(){
        var pattern = /^\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testNegativeDouble: function(){
        var pattern = /^-\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPercent: function(value){
		var percent = value.match(/%/g);
		return percent && this.testPositiveDouble(value.replace("%", ""));
    },
    testPhone: function(){
        var pattern = /^\+?[0-9\s]{8,16}/;
        return pattern.test(arguments[0]);
    },
    testYear: function(){
        var pattern = /^(19|20)[\d]{2,2}$/;
        return pattern.test(arguments[0]);
    },
    testDate: function(){
        return !isNaN(Date.parse(arguments[0]));
    },
    testIP: function(){
        var pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return pattern.test(arguments[0]);
    },
    testPassword: function(){
        var pattern = /^[a-z0-9_-]{6,18}$/i;
        var pass = pattern.test(arguments[0]);
        return pass;
    },
    testEmail: function(){
        var pattern = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;
        return pattern.test(arguments[0]);
    },
    testDomain: function(){
        var pattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
        return pattern.test(arguments[0]);
    },
    testSubDomain: function(){
        var pattern = /^[a-z\d]+([-_][a-z\d]+)*$/i;
        return pattern.test(arguments[0]);
    },
	testHandle: function(){
		var pattern = /^[a-z\d\/\+\-\.]+$/i;
		return pattern.test(arguments[0]);
	},
    testURL: function(){
        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        return pattern.test(arguments[0]);
    },
	testUUID: function(){
		var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return pattern.test(arguments[0]);
	}
});
"use strict";
gereji.extend('transition', {
	options: {
		direction: "left",
		duration: 900,
		timingFunction: "ease"
	},
	duration: function(){
		this.options.duration = arguments[0] ? arguments[0] : this.options.duration;
		return this;
	},
	direction: function(){
		this.options.direction = arguments[0] ? arguments[0] : this.options.direction;
		return this;
	},
	slide: function(){
		var target = arguments[0];
		var then = arguments[1] ? arguments[1] : false;
		switch(this.options.direction){
			case "left":
				this.transition(target, this.next(target), "width", then);		
				break;
			case "right":
				this.transition(target, this.previous(target), "width", then);		
				break;
			case "up":
				this.transition(target, this.next(target), "height", then);		
				break;
			case "down":
				this.transition(target, this.previous(target), "height", then);		
				break;
		}
		return this;
	},
	transition: function(current, next, style, then){
		next.style.display = 'inline-block';
		var max = current[("client" + style.charAt(0).toUpperCase() + style.slice(1))];
		if(!this.modern()){
			return	this.animate(function(fraction){
						next.style[style] = String(Math.ceil(max * fraction)) + '%';
						current.style[style] = String(Math.floor(max - (max * fraction))) + '%';
					}, then);
		}
		var transition = style + " " + this.options.duration + "ms " + this.options.timingFunction;
		current.style.transition = transition;
		next.style.transition = transition;
		current.style[style] = "0";
		next.style[style] = String(max) + "px";
		then && setTimeout(then, this.options.duration);
		return this;
	},
	next: function(target){
		var subject = target.nextSibling ? target.nextSibling : target.parentNode.firstChild;
		while(subject.nodeType != 1){
			subject = subject.nextSibling ? subject.nextSibling : target.parentNode.firstChild;
		}
		return subject;
	},
    previous: function(target){
        var subject = target.previousSibling ? target.previousSibling : target.parentNode.lastChild;
        while(subject.nodeType != 1){
           subject = subject.previousSibling ? subject.previousSibling : target.parentNode.lastChild;
        }
        return subject;
    },
    modern: function(){
        var s = document.createElement('p').style;
        return ('transition' in s || 'webkitTransition' in s || 'MozTransition' in s || 'msTransition' in s || 'OTransition' in s);
    },
	animate: function(action, then){
		var n = 1;
		do {
			var y = Math.sin(0.5 * Math.PI * n / this.options.duration);
			(function() {
				var fraction = y;
				var t = n;
				setTimeout(function() {
					action(fraction);
					(t == duration) && then && then();
				}, n);
			})();
		} while (n++ < duration);
	}
});
"use strict";
gereji.extend("model", {
	init: function(){
		this.status = "ready";
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
		this.store = {data: {}, meta: {}};
		return this;
	},
    ready: function(){
		if(arguments[0])
			this.status = arguments[0];
        return (this.status == "ready");
    },
	meta: function(){
		var key = arguments[0] ? arguments[0] : undefined;
		var value = arguments[1] ? arguments[1] : undefined;
		if(value != undefined)
			this.store.meta[key] = value;
		if(key != undefined && value == undefined)
			return this.store.meta[key] ? this.store.meta[key] : undefined;
		return this;
	},
	set: function(property, value){
		var store = this.store.data;
		var pattern = /\[([\d])\]/g;
		var path = 'this.store.data';
		var keys = property.split(/\./g);
		for(var i = 0; i < keys.length; i++){
			var indices = keys[i].match(pattern);
			path += "." + keys[i].replace(pattern, "");
			eval(path + " = " + path + " ? " + path + " : " + (indices ? "[]" : "{}"));
			if(!indices)
				continue;
			for(var j = 0; j < indices.length;  j++){
				path += indices[j];
				eval(path + " = " + path + " ? " + path + " : {}");
			}
		}
		eval(path + " = value");
		return this;
	},
	get: function(key){
		var test = 'this.store.data';
		var path = key.replace(/\[(.*)\]/, '').split('.');
		var index = (key.indexOf('[') == -1) ? false : key.match(/\[(.*)\]/)[1];
		var value = undefined;
		for(var i in path){
			test += "." + path[i];
			value = eval(test) === undefined ?  undefined : (index ? eval(test + "[" + index + "]") : eval(test));
		}
		return value;
	},
	sync: function(){
		var self = this;
		var url = this.meta("about");
		var data = JSON.stringify(this.store.data);
		var broker = this.broker;
		this.ajax.post(url, data, function(){
			self.broker.emit({type: "sync", data: arguments[0]});
		});
	},
	destroy: function(){
		this.store = {};
	},
	serialize: function(){
		return JSON.stringify(this.store);
	},
	find: function(){
		return this.store.data;
	}
});
"use strict";
gereji.extend("collection", {
	init: function(){
		this.store = { data: null, meta: {}, ready: false };
		this.broker = new gereji.broker();
		this.broker.init();
		this.ajax = new gereji.sync();
		this.ajax.init();
        this.storage = new gereji.storage();
        this.storage.init();
		return this;
	},
    ready: function(){
		var collections = this.storage.get("collections");
		var name = this.store.meta.name;
		this.store.ready = collections.hasOwnProperty(name);
		if(this.store.ready)
			this.store.data = collections[name];
        return this.store.ready;
    },
	data: function(){
		if(arguments[0])
			this.store.data = arguments[0];
		return this.store.data;
	},
	filter: function(filter){
		var match;
		var records = this.store.data;
		var results = [];
		for(var i in records){
			match = true;
			for(var j in filter){
				match = (records[i][j] == filter[j]);
				if(!match)
					break;
			}
			if(match)
				results.push(records[i]);
		}
		return results;
	},
	fetch: function(){
		var name = this.store.meta.name;
		var that = this;
		this.ajax.get(this.store.meta.about, function(response){
			var response = JSON.parse(response);
			var collections = that.storage.get("collections");
			collections[name] = response;
			that.store.data = collections[name];
			that.storage.set("collections", collections);
			that.broker.emit({type: "update", data: response});
		});
		return this;
	},
    meta: function(){
        var key = arguments[0];
        var value = arguments[1];
        if(value != undefined)
            this.store.meta[key] = value;
        if(key != undefined && value == undefined)
            return this.store.meta[key] ? this.store.meta[key] : undefined;
        return this;
    }
});
"use strict";
gereji.extend("query", {
	init: function(){
		var query = arguments[0];
		var context = arguments[1] ? arguments[1] : document;
		this.elements = Sizzle(query, context);
		return this;
	},
    setElement: function(){
        this.elements = [arguments[0]];
        return this;
    },
    ancestor: function(query){
		if(!this.elements.length)
			return this;
		this.elements = [this.elements[0].parentNode];
		if(Sizzle((">" + query), this.elements[0].parentNode).length)
			return this;
		return this.ancestor(query);
    },
	children: function(){
		var query = arguments[0];
		if(!this.elements.length)
			throw new Error("There is no element to find children of.");
		this.elements = Sizzle(query, this.elements[0]);
		return this;
	},
    next: function(){
        var target = this.elements[0];
        var subject = target.nextSibling ? target.nextSibling : target.parentNode.firstChild;
        while(subject.nodeType != 1){
            subject = subject.nextSibling ? subject.nextSibling : target.parentNode.firstChild;
        }
        this.elements = [subject];
        return this;
    },
    previous: function(){
        var target = this.elements[0];
        var subject = target.previousSibling ? target.previousSibling : target.parentNode.lastChild;
        while(subject.nodeType != 1){
           subject = subject.previousSibling ? subject.previousSibling : target.parentNode.lastChild;
        }
        this.elements = [subject];
        return this;
    },
	each: function(then){
        for(var i = 0; i < this.elements.length; i++){
            then(this.elements[i]);
        }
		return this;
	},
    hasClass: function(){
		if(this.elements.length)
			return (this.elements[0].className.indexOf(arguments[0]) != -1);
		else
			return false;
    },
    addClass: function(){
        var classes = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];
		this.each(function(element){
			for(var i in classes){
				if(element.className.indexOf(classes[i]) == -1)
					element.className += " " + classes[i];
			}
		});
        return this;
    },
    removeClass: function(){
        var classes = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];
		this.each(function(element){
			for(var i in classes){
				element.className = element.className.replace(classes[i], "").replace(/\s\s/g, ' ');
			}
		});
        return this;
    },
    appendChild: function(node){
		this.each(function(element){
			element.appendChild(node);
		});
		return this;
    },
	html: function(html){
		if(!html)
			return this.elements.length ? this.elements[0].innerHTML : null;
		this.each(function(element){
			element.innerHTML = html;
		});
		return this;
	},
    innerHTML: function(html){
		this.each(function(element){
	        element.innerHTML = html;
		});
		return this;
    },
    value: function(value){
        if(!value)
            return this.elements.length ? this.elements[0].value : null;
		this.each(function(element){
            element.value = value;
		});
        return this;
    },
    attribute: function(name, value){
        if(arguments.length == 1)
            return this.elements[0].getAttribute(name);
		this.each(function(element){
			element.setAttribute(name, value);
		});
        return this;
    },
    css: function(css){
		this.each(function(element){
			for(var i in css){
				element.style[i] = css[i];
			}
		});
        return this;
    },
    remove: function(){
		this.each(function(element){
			element.remove();
		});
        return this;
    }
});
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
			var doc = document.implementation.createHTMLDocument("");
			doc.documentElement.innerHTML = arguments[0];
			return doc;
		}
	}
});
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
"use strict";
gereji.extend('os', {
	sandbox: {},
	apps: {},
	register : function(appId, creator) {
		this.apps[appId] = {
			creator : creator,
			instance : null
		};
	},
	start : function(appId) {
		var app = this.apps[appId];
		app.instance = app.creator(this.sandbox);
		try {
			app.instance.init();
		} catch (e) {
			console && console.error(e.stack);
		}
	},
	stop : function(appId) {
		var data = this.apps[appId];
		if(!data.instance)
			return;
		data.instance.kill();
		data.instance = null;
	},
	boot : function() {
		this.sandbox = new gereji.broker();
		this.sandbox.init();
		this.sandbox.models = {};
		this.sandbox.collections = {};
		this.sandbox.validator = new gereji.validator();
		this.sandbox.transition = new gereji.transition();
		this.sandbox.storage = new gereji.storage();
		this.sandbox.sync = new gereji.sync();
		this.sandbox.storage.init();
		this.sandbox.sync.init();
		for (var i in this.apps) {
			this.apps.hasOwnProperty(i) && this.start(i);
		}
		this.sandbox.emit({type: "body:load", data: {}});
	},
	halt : function() {
		for ( var i in this.apps) {
			this.apps.hasOwnProperty(i) && this.stop(i);
		}
	}
});
gereji.apps = new gereji.os();
"use strict";
gereji.apps.register('events', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			for(var i in app.events){
				var ev = 'on' + app.events[i];
				document[ev] = function(){
					app.fire.apply(app, arguments);
				}
			}
			window.onresize = function(){
				sandbox.emit({type: "window:resize", data: arguments[0]});
			};
		},
		fire: function(event){
			event = event || window.event;
			var target = event.target || event.srcElement;
			if(app.bubble(target, event))
				return;
			var ev = { data: {} };
			ev.data.target = target;
			ev.data.event = event;
			var cls = String(target.className).split(' ');
			for(var i in cls){
				ev.type = '.' + cls[i] + ':' + event.type;
				sandbox.emit(new Object(ev));
			}
			ev.type = "#" + target.id + ":" + event.type;
			sandbox.emit(new Object(ev));
			ev.type = String(target.tagName).trim().toLowerCase() + ":" + event.type;
			sandbox.emit(new Object(ev));
		},
		bubble: function(target, event){
			if(String(target.className).indexOf("bubble-up") == -1)
				return false;
			if(target.parentNode[event.type])
				target.parentNode[event.type]()
			return true;
		},
		events: [
			'load',
			'change',
			'resize',
			'submit',
			'drag',
			'dragstart',
			'dragenter',
			'dragleave',
			'dragover',
			'dragend',
			'drop',
			'mousedown',
			'mouseup',
			'mousemove',
			'mouseover',
			'mouseout',
			'click',
			'dblclick',
			'keyup',
			'keydown',
			'keypress'
		]
	}
});
"use strict";
gereji.apps.register('collapsible', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(["body:load", "body:change"], app.close);
			sandbox.on([".collapsible-single-openclose:click"], app.toggle)
			sandbox.on([".collapsible-openclose:click"], app.dance);
		},
		close: function(){
			var tags = (new gereji.query()).init(".collapsible-close");
			tags.each(function(element){
				var tag = (new gereji.query()).setElement(element);
				if(!tag.attribute("collapsible-height"))
					tag.attribute("collapsible-height", element.clientHeight);
			});
		},
		toggle: function(){
			var target = (new gereji.query()).setElement(arguments[0].data.target).ancestor(".collapsible");
			if(!target.hasClass("collapsible-single-closed"))
				return target.css("collapsible-height", "auto").addClass("collapsible-single-closed");
			var height = target.attribute("collapsible-height") + "px";
			target.css("height", height).removeClass("collapsible-single-closed");
		},
		dance: function(){
			var target = arguments[0].data.target;
			var subject = (new gereji.query()).setElement(target).ancestor(".collapsible");
			var open = subject.hasClass('collapsible-open');
			var tags = (new gereji.query()).setElement(subject.elements[0].parentNode).children(".collapsible");
			tags.each(function(element){
				(new gereji.query()).setElement(element)
				.removeClass('collapsible-open')
				.addClass('collapsible-close');
			});
			subject.removeClass(open ? "collapsible-open" : "collapsible-close");
			subject.addClass(open ? "collapsible-close" : "collapsible-open");
			return this;
		}
	}
});
"use strict";
gereji.apps.register('basket', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(['.draggable:dragstart'], app.dragStart);
			sandbox.on(['.draggable:dragend'], app.dragEnd);
			sandbox.on(['.droppable:dragover'], app.dragOver);
			sandbox.on(['.droppable:dragenter'], app.dragEnter);
			sandbox.on(['.droppable:dragleave'], app.dragLeave);
			sandbox.on(['.droppable:drop'], app.drop);
		},
		dragStart: function(){
			var target = arguments[0].data.target;
			target.id = target.id ? target.id : sandbox.storage.uuid();
			var event = arguments[0].data.event;
			event.dataTransfer.setData("id", target.id);
		},
		dragOver: function(){
			var event = arguments[0].data.event;
			event.preventDefault();
			event.dataTransfer.effectAllowed = 'move';
		},
		dragEnter: function(){
			var target = arguments[0].data.target;
			target.classList.add('dragover');
		},
		dragLeave: function(){
			var target = arguments[0].data.target;
			target.classList.remove('dragover');
		},
		drop: function(){
			var target = arguments[0].data.target;
			var event = arguments[0].data.event;
			var id = event.dataTransfer.getData("id");
			var subject = document.getElementById(id);
			target.appendChild(subject);
			target.classList.remove('dragover');
			var type = subject.getAttribute("name") + ":drop";
			sandbox.emit({type: type, data : {area : target, object: subject}});
		},
		dragEnd: function(){
			var target = arguments[0].data.target;
			target.classList.remove('dragover');
		}
	};
});
"use strict";
gereji.apps.register('collapsible', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on(["body:load", "body:change"], app.close);
			sandbox.on([".collapsible-single-openclose:click"], app.toggle)
			sandbox.on([".collapsible-openclose:click"], app.dance);
		},
		close: function(){
			var tags = (new gereji.query()).init(".collapsible-close");
			tags.each(function(element){
				var tag = (new gereji.query()).setElement(element);
				if(!tag.attribute("collapsible-height"))
					tag.attribute("collapsible-height", element.clientHeight);
			});
		},
		toggle: function(){
			var target = (new gereji.query()).setElement(arguments[0].data.target).ancestor(".collapsible");
			if(!target.hasClass("collapsible-single-closed"))
				return target.css("collapsible-height", "auto").addClass("collapsible-single-closed");
			var height = target.attribute("collapsible-height") + "px";
			target.css("height", height).removeClass("collapsible-single-closed");
		},
		dance: function(){
			var target = arguments[0].data.target;
			var subject = (new gereji.query()).setElement(target).ancestor(".collapsible");
			var open = subject.hasClass('collapsible-open');
			var tags = (new gereji.query()).setElement(subject.elements[0].parentNode).children(".collapsible");
			tags.each(function(element){
				(new gereji.query()).setElement(element)
				.removeClass('collapsible-open')
				.addClass('collapsible-close');
			});
			subject.removeClass(open ? "collapsible-open" : "collapsible-close");
			subject.addClass(open ? "collapsible-close" : "collapsible-open");
			return this;
		}
	}
});
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
				(new gereji.query()).init('a[stage="' + stage + '-form"]').css({display: "block"});
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
