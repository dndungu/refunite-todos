"use strict";
gereji.apps.register('zatiti-activate-b', function(sandbox){
	var app;
	return {
		init: function(){
			app = this;
			sandbox.on("model.activate_domain:create", app.step2);
			sandbox.on("model.activate_user:create", app.step3);
			sandbox.on("body:load", function(){
				app.alias = document.getElementById("alias");
				app.email = document.getElementById("email");
				app.alias.focus();
			});
		},
		step2: function(event){
			app.siteModel = event.data;
			app.siteModel.broker.on("submit", function(){
				var transition = new gereji.transition();
				var domain_div = document.getElementById("activate_wizard_domain");
				var sync = false;
				app.siteModel.broker.on("sync", function(){
					sync = arguments[0].data;
				});
				transition.duration(900).direction("left").slide(domain_div, function(){
					sandbox.emit({type: "body:change"});
					app.email.focus();
					app.siteModel.broker.on("sync", function(){
						var response = arguments[0].data;
						if(!response.activate.domain[0].error)
							return;
						app.alias.focus();
						var transition = new gereji.transition();
						transition.duration(900).direction("right");
						transition.slide(document.getElementById("activate_wizard_user"));
						app.alias.value = "";
						app.alias.setAttribute("placeholder", response.activate.domain[0].error);
						app.alias.className += " invalid-input";
					});
					sync && app.siteModel.broker.emit({type: "sync", data: sync});
				});
			});
		},
		step3: function(event){
			var userModel = event.data;
			userModel.set("site_id", app.siteModel.get("_id"));
			userModel.broker.on("submit", function(){
				var transition = new gereji.transition();
				transition.duration(900).direction("left");
				var div = document.getElementById("activate_wizard_user");
				var sync = false;
				userModel.broker.on("sync", function(){
					sync = arguments[0];
				});
				transition.slide(div, function(){
					sandbox.emit({type: "body:change"});
					setTimeout(function(){
						userModel.broker.on("sync", function(){	
							document.getElementById("activate_form").setAttribute("action", "//" + app.siteModel.response.activate.domain[0][0].alias[0]);
							document.getElementById("activate_email").value = userModel.response.activate.user[0].email;
							document.getElementById("activate_password").value = userModel.response.activate.user[0].password;
							var transition = new gereji.transition();
							transition.duration(900).direction("left");
							var div = document.getElementById("activate_wizard_creating");
							transition.slide(div);
						});
						sync && userModel.broker.emit({type: "sync", data: sync});
					}, 2000);
				});
			});
			var siteModel = new gereji.model();
			siteModel.init();
			siteModel.set("author", userModel.get("_id"));
			siteModel.meta("about", "/api/activate_domain/" + app.siteModel.get("_id"));
			siteModel.meta("name", "site");
			siteModel.sync();
		}
	};
});
