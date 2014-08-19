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
				xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400 && args.complete(xhr.responseText, xhr);
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
						if(script.readyState != "loaded" && script.readyState != "complete")
							return;
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
