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
