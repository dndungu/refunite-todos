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
