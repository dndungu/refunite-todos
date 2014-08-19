"use strict";
gereji.extend("dom", {
	findId: function(id){
		this.elements = document.getElementsById(id);
	},
	findTag: function(tagName){
		this.elements = document.getElementsByTagName(tagName);
		return this;
	},
	findClass: function(className){
		var result = [];
		for(var i = 0; i < this.elements.length; i++){
			var element = this.elements[i];
			if(element.className.split(" ").indexOf(className) != -1)
				result.push(element);			
		}
		this.elements = result;
		return this;
	},
	findParentTag: function(parentTag){
		var tag = this.elements[0].tagName.toLowerCase();
		if(tag == "body")
			this.elements = [];
		if(tag == parentTag || tag == "body")
			return this;
		this.elements = [this.elements[0].parentNode];
		return this.findParentTag(parentTag);
	},
	findChildrenTag: function(tag){
		if(!this.elements.length){
			this.elements = [];
			return this;
		}
		var elements = this.elements[0].getElementsByTagName(tag);
		this.elements = elements ? elements : [];
		return this;
	},
    findNextSibling: function(){
		var target = this.elements[0];
        var subject = target.nextSibling ? target.nextSibling : target.parentNode.firstChild;
        while(subject.nodeType != 1){
			subject = subject.nextSibling ? subject.nextSibling : target.parentNode.firstChild;
        }
		this.elements = [subject];
        return this;
    },
    findPreviousSibling: function(){
		var target = this.elements[0];
        var subject = target.previousSibling ? target.previousSibling : target.parentNode.lastChild;
        while(subject.nodeType != 1){
           subject = subject.previousSibling ? subject.previousSibling : target.parentNode.lastChild;
        }
		this.elements = [subject];
        return this;
    },
	getElements: function(){
		return this.elements;
	},
    setElement: function(){
        this.elements = [arguments[0]];
        return this;
    },
	setElements: function(){
		this.elements = [];
		for(var i = 0; i < arguments[0].length; i++){
			this.elements.push(arguments[0][i]);
		}
		return this;
	},
	addClass: function(){
		var classes = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];
		for(var i = 0; i < this.elements.length; i++){
			for(var j in classes){
				var className = this.elements[i].className;
				this.elements[i].className = (className.indexOf(classes[i]) == -1) ? (className + " " + classes[i]) : className;
			}
		}
		return this;
	},
	removeClass: function(){
		var classes = arguments[0] instanceof Array ? arguments[0] : [arguments[0]];
		for(var i = 0; i < this.elements.length; i++){
			for(var j in classes){
				this.elements[i].className = this.elements[i].className.replace(classes[j], "").replace("  ", " ");
			}
		}
		return this;
	},
	hasClass: function(){
		return (this.elements[0] && this.elements[0].className && this.elements[0].className.indexOf(arguments[0]) != -1)
	},
	append: function(){
		if(!this.elements.length)
			return this;
		this.elements[0].innerHTML += arguments[0];
	},
	html: function(){
        if(!this.elements.length)
            return this;
		this.elements[0].innerHTML = "";
        this.elements[0].appendChild(arguments[0]);		
	},
	value: function(){
		if(!arguments.length)
			return this.elements[0].value;
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].value = arguments[0];
		}
		return this;
	},
	attribute: function(){
		if(arguments.length == 1)
			return this.elements[0].getAttribute(arguments[0]);
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].setAttribute(arguments[0], arguments[1]);
		}
		return this;
	},
	css: function(css){
		for(var i = 0; i < this.elements.length; i++){
			for(var j in css){
				this.elements[i].style[j] = css[j];
			}
		}
		return this;
	},
	remove: function(){
        if(!this.elements.length)
            return this;
		this.elements[0].parentNode.removeChild(this.elements[0]);		
		return this;
	},
	each: function(callback){
		for(var i = 0; i < this.elements.length; i++){
			callback(this.elements[i]);
		}
	}
});
