"use script";
gereji.apps.register("stage", function(sandbox){
    var app;
    return {
		init: function(){
			app = this;
			sandbox.on([".add-item:click", ".list-items:click"], app.render);
		},
        render: function(){
			var options = app.options(arguments[0].data.target);
            if(!options.type || !options.name)
                return;
            var view = sandbox.views[options.type] ? sandbox.views[options.type][options.name] : null;
            if(!view)
                view = (new gereji.view[options.type]()).init(options);
            view.render();
		},
		options: function(target){
			var options = {};
			options.type = target.getAttribute("type");
			options.href = target.getAttribute("href");
			options.about = target.getAttribute("about");
			options.name = target.getAttribute("name");
			options.stage = target.getAttribute("stage");
			return options;
		}
	};
});
