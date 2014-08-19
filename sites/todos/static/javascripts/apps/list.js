"use strict";
gereji.apps.register('list', function(sandbox){
    var app;
    return {
        init: function(){
			app = this;
			app.stage = {};
			app.history = !!(window.history && history.pushState);
			sandbox.on(["list:stage"], app.render);
			sandbox.on([".list-select-all:change", ".list-select-row:change"], app.toggleButtons);
			sandbox.on([".list-select-all:change"], app.toggleSelectors);
			sandbox.on([".list-select-row:change"], app.toggleBulkSelector);
		},
        render: function(){
			var options = arguments[0].data;
			var view = new gereji.view[options.type]();
			view.init(options);
			view.render();
			app.stage[options.stage] = view;
        },
		toggleButtons: function(){
			var target = arguments[0].data.target;
			setTimeout(function(){
				var button = (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("select").findClass("bulk-buttons").getElements()[0];
				if(!button)
					return this;
				var checkboxes = app.getSelectors(target);
				for(var i = 0; i < checkboxes.length ; i++){
					if(checkboxes[i].checked)
						return button.style.display = "block";
				}
				button.style.display = "none";
			}, 100);
			return this;
		},
		toggleSelectors: function(){
			var target = arguments[0].data.target;
			var checkboxes = app.getSelectors(target);
			for(var i = 0; i < checkboxes.length ; i++){
				checkboxes[i].checked = target.checked;
			}
		},
		toggleBulkSelector: function(){
			var target = arguments[0].data.target;
			var checkboxes = app.getSelectors(target);
			var n = 0;
			for(var i = 0; i < checkboxes.length ; i++){
				if(checkboxes[i].checked)
					n++;
			}
			app.getBulkSelector(target).checked = !!n;
		},
		getSelectors: function(target){
			return (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("input").findClass("list-select-row").getElements();
		},
		getBulkSelector: function(target){
			return (new gereji.dom()).setElement(target).findParentTag("section").findChildrenTag("input").findClass("list-select-all").getElements()[0];
		}
	}
});
