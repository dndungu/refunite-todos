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
