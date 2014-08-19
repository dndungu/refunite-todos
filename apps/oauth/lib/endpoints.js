"use strict";

var resources = {
	connect : {
		"facebook-signup": "https://www.facebook.com/dialog/oauth?client_id={facebook}&redirect_uri={callback}&scope=email&response_type=code",
		"facebook-profile": "https://www.facebook.com/dialog/oauth?client_id={facebook}&redirect_uri={callback}&scope=publish_actions&response_type=code",
		"linkedin-profile": "https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id={linkedin}&scope=r_basicprofile%20r_emailaddress&&state={state}&&redirect_uri={callback}"
	},
	access_token: {
		"facebook": "/oauth/access_token?client_id={facebook}&client_secret={facebook-secret}&grant_type=client_credentials"
	},
	token: {
		"facebook-signup": "/oauth/access_token?client_id={facebook}&redirect_uri={callback}&client_secret={facebook-secret}&code={code}",
		"linkedin-profile": "/uas/oauth2/accessToken?grant_type=authorization_code&code={code}&redirect_uri={callback}&client_id={linkedin}&client_secret={linkedin-secret}"
	},
	me: {
		"facebook-signup": "/v2.0/me?access_token={token}",
		"linkedin-profile": "/v1/people/~:(id,first-name,last-name,email-address,picture-url)?oauth2_access_token={token}"
	}
};

module.exports = function(){
	return {
		parameters: {},
		set: function(){
			this.parameters[arguments[0]] = arguments[1];
			return this;
		},
		get: function(){
			return this.parameters[arguments[0]];
		},
		endpoint: function(){
			var resource = new String(resources[arguments[1]][arguments[0]]);
			for(var i in this.parameters){
				resource = resource.replace(("{" + i + "}"), this.parameters[i]);
			}
			return resource;
		}
	}
};
