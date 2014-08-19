"use strict";
gereji.extend("validator", {
	test: function(type, input){
		switch(type){
			case "required":
				return String(input).length;
				break;
			case "string":
				return this.testString(input);
				break;
			case "integer":
				return this.testInteger(input);
				break;
			case "positiveinteger":
				return this.testPositiveInteger(input);
				break;
			case "negativeinteger":
				return this.testNegativeInteger(input);
				break;
			case "currency":
				return this.testCurrency(input);
				break;
			case "double":
				return this.testDouble(input);
				break;
			case "positivedouble":
				return this.testPositiveDouble(input);
				break;
			case "negativedouble":
				return this.testNegativeDouble(input);
				break;
			case "percent":
				return this.testPercent(input);
				break;
			case "phone":
				return this.testPhone(input);
				break;
			case "year":
				return this.testYear(input);
				break;
			case "date":
				return this.testDate(input);
				break;
			case "ip":
				return this.testIP(input);
				break;
			case "password":
				return this.testPassword(input);
				break;
			case "email":
				return this.testEmail(input);
				break;
			case "domain":
				return this.testDomain(input);
				break;
			case "subdomain":
				return this.testSubDomain(input);
				break;
			case "handle":
				return this.testHandle(input);
				break;
			case "url":
				return this.testURL(input);
				break;
			case "uuid":
				return this.testUUID(input);
				break;
			case "boolean":
				return (typeof input == "boolean");
				break;
			default:
				return true;
				break;
		}
	},
    testString: function(){
        var pattern = /^.+$/i;
        return pattern.test(arguments[0]);
    },
    testInteger: function(){
        var pattern = /^-{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPositiveInteger: function(){
        var pattern = /^\d+$/;
        return pattern.test(arguments[0]);
    },
    testNegativeInteger: function(){
        var pattern = /^-\d+$/;
        return pattern.test(arguments[0]);
    },
    testCurrency: function(){
        var pattern = /^-{0,1}\d*\.{0,2}\d+$/;
        return pattern.test(arguments[0]);
    },
    testDouble: function(){
        var pattern = /^-{0,1}\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPositiveDouble: function(){
        var pattern = /^\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testNegativeDouble: function(){
        var pattern = /^-\d*\.{0,1}\d+$/;
        return pattern.test(arguments[0]);
    },
    testPercent: function(value){
		var percent = value.match(/%/g);
		return percent && this.testPositiveDouble(value.replace("%", ""));
    },
    testPhone: function(){
        var pattern = /^\+?[0-9\s]{8,16}/;
        return pattern.test(arguments[0]);
    },
    testYear: function(){
        var pattern = /^(19|20)[\d]{2,2}$/;
        return pattern.test(arguments[0]);
    },
    testDate: function(){
        return !isNaN(Date.parse(arguments[0]));
    },
    testIP: function(){
        var pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return pattern.test(arguments[0]);
    },
    testPassword: function(){
        var pattern = /^[a-z0-9_-]{6,18}$/i;
        var pass = pattern.test(arguments[0]);
        return pass;
    },
    testEmail: function(){
        var pattern = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;
        return pattern.test(arguments[0]);
    },
    testDomain: function(){
        var pattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
        return pattern.test(arguments[0]);
    },
    testSubDomain: function(){
        var pattern = /^[a-z\d]+([-_][a-z\d]+)*$/i;
        return pattern.test(arguments[0]);
    },
	testHandle: function(){
		var pattern = /^[a-z\d\/\+\-\.]+$/i;
		return pattern.test(arguments[0]);
	},
    testURL: function(){
        var pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
        return pattern.test(arguments[0]);
    },
	testUUID: function(){
		var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return pattern.test(arguments[0]);
	}
});
