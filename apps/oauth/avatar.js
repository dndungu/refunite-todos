"use strict";
module.exports = {
	"get": function(sandbox){
		var facebook = sandbox.context.get("user").get("facebook");
		var linkedin = sandbox.context.get("user").get("linkedin");
		var twitter = sandbox.context.get("user").get("twitter");
		var url = "/static/images/avatar.png";
		if(twitter)
			url = "http://avatars.io/twitter/{screen_name}".replace("{screen_name}", twitter.screen_name);
		if(facebook)
			url = "https://graph.facebook.com/me/picture?access_token={token}".replace("{token}", facebook.token.token);
		if(linkedin)
			url = linkedin["picture-url"];
		sandbox.data(url).end();
	}
};
