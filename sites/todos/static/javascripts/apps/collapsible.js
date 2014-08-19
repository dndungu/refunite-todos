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
