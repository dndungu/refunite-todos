"use strict";
gereji.apps.register("basket", function(sandbox){
    var app;
    return {
        init: function(){
			if(location.href.indexOf("/product/") == -1)
				return gereji.apps.stop("basket");
		},
		kill: function(){
		}
	}
});

