"use strict";var gereji=function(){};gereji.extend=function(){var b=arguments[0];var e=arguments[1];var d=function(){};d.extend=gereji.extend;for(var c in this.prototype){d.prototype[c]=this.prototype[c]}for(var a in e){d.prototype[a]=e[a]}this[b]=d};"use strict";gereji.extend("broker",{init:function(){this.events=[];return this},on:function(){var b=typeof arguments[0]=="string"?[arguments[0]]:arguments[0];for(var a in b){var c=b[a];this.events=this.events?this.events:{};this.events[c]=typeof this.events[c]=="undefined"?[]:this.events[c];this.events[c].push(arguments[1])}return this},emit:function(a){a=typeof a=="string"?{type:a,data:{}}:a;a.data=typeof a.data=="undefined"?{}:a.data;try{var c=this.events?this.events[a.type]:[];for(var b in c){typeof c[b]==="function"&&c[b](a)}return this}catch(d){var f=d.stack?d.stack:d;console&&console.log(f)}}});"use strict";gereji.extend("sync",{init:function(){this.headers={};this.headers["x-powered-by"]="gereji";this.headers["content-type"]="application/json";this.headers["cache-control"]="no-cache";this.broker=new gereji.broker();this.broker.init();this.options={async:true};this.transport=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP")},header:function(a,b){this.headers[a]=b;return this},get:function(a,b){return this.request({uri:a,method:"GET",complete:b})},post:function(a,b,c){return this.request({method:"POST",uri:a,data:b,complete:c})},put:function(d,e,f){var c=this;var b=["abort","error","load","loadstart","loadend","progress"];for(var a in b){this.transport.upload.addEventListener(b[a],function(g){c.broker.emit({type:g.type,data:g})},false)}return this.request({method:"PUT",uri:d,data:e,complete:f})},"delete":function(a,b){return this.request({method:"DELETE",uri:a,complete:b})},request:function(){var a=arguments[0];try{this.transport.onreadystatechange=function(){var d=arguments[0].target;d.readyState===4&&d.status>=200&&d.status<400&&a.complete(d.responseText)};this.transport.open(a.method,a.uri,this.options);for(var b in this.headers){this.transport.setRequestHeader(b,this.headers[b])}this.transport.send(a.data);return this}catch(c){console&&console.log(c)}},xget:function(b,d){try{var a=document.createElement("script");a.src=b;a.readyState?a.onreadystatechange=function(){if(a.readyState!="loaded"&&a.readyState!="complete"){return}d();a.onreadystatechange=null}:a.onload=d;a.type="text/javascript";a.async=true;document.getElementsByTagName("head")[0].appendChild(a)}catch(c){console&&console.log(c)}}});"use strict";gereji.extend("storage",{init:function(){this.scope=arguments[0]?arguments[0]:"gereji";this.store=localStorage?localStorage:new gereji.memory();this.store.hasOwnProperty(this.scope)||this.store.setItem(this.scope,"{}")},set:function(b,c){var a=this.getStore();a[b]=c;this.store.setItem(this.scope,JSON.stringify(a))},get:function(b){var a=this.getStore();return a.hasOwnProperty(b)?a[b]:{}},where:function(c){var a=this.getStore();var d=[];for(var b in a){}},getStore:function(){return this.store.hasOwnProperty(this.scope)?JSON.parse(this.store.getItem(this.scope)):{}},uuid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(d){var b=Math.random()*16|0,a=d=="x"?b:b&3|8;return a.toString(16)})}});"use strict";gereji.extend("validator",{test:function(b,a){switch(b){case"required":return String(a).length;break;case"string":return this.testString(a);break;case"integer":return this.testInteger(a);break;case"positiveinteger":return this.testPositiveInteger(a);break;case"negativeinteger":return this.testNegativeInteger(a);break;case"currency":return this.testCurrency(a);break;case"double":return this.testDouble(a);break;case"positivedouble":return this.testPositiveDouble(a);break;case"negativedouble":return this.testNegativeDouble(a);break;case"percent":return this.testPercent(a);break;case"phone":return this.testPhone(a);break;case"year":return this.testYear(a);break;case"date":return this.testDate(a);break;case"ip":return this.testIP(a);break;case"password":return this.testPassword(a);break;case"email":return this.testEmail(a);break;case"domain":return this.testDomain(a);break;case"subdomain":return this.testSubDomain(a);break;case"handle":return this.testHandle(a);break;case"url":return this.testURL(a);break;case"uuid":return this.testUUID(a);break;case"boolean":return(typeof a=="boolean");break;default:return true;break}},testString:function(){var a=/^.+$/i;return a.test(arguments[0])},testInteger:function(){var a=/^-{0,1}\d+$/;return a.test(arguments[0])},testPositiveInteger:function(){var a=/^\d+$/;return a.test(arguments[0])},testNegativeInteger:function(){var a=/^-\d+$/;return a.test(arguments[0])},testCurrency:function(){var a=/^-{0,1}\d*\.{0,2}\d+$/;return a.test(arguments[0])},testDouble:function(){var a=/^-{0,1}\d*\.{0,1}\d+$/;return a.test(arguments[0])},testPositiveDouble:function(){var a=/^\d*\.{0,1}\d+$/;return a.test(arguments[0])},testNegativeDouble:function(){var a=/^-\d*\.{0,1}\d+$/;return a.test(arguments[0])},testPercent:function(b){var a=b.match(/%/g);return a&&this.testPositiveDouble(b.replace("%",""))},testPhone:function(){var a=/^\+?[0-9\s]{8,16}/;return a.test(arguments[0])},testYear:function(){var a=/^(19|20)[\d]{2,2}$/;return a.test(arguments[0])},testDate:function(){return !isNaN(Date.parse(arguments[0]))},testIP:function(){var a=/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;return a.test(arguments[0])},testPassword:function(){var b=/^[a-z0-9_-]{6,18}$/i;var a=b.test(arguments[0]);return a},testEmail:function(){var a=/^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;return a.test(arguments[0])},testDomain:function(){var a=/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;return a.test(arguments[0])},testSubDomain:function(){var a=/^[a-z\d]+([-_][a-z\d]+)*$/i;return a.test(arguments[0])},testHandle:function(){var a=/^[a-z\d\/\+\-\.]+$/i;return a.test(arguments[0])},testURL:function(){var a=/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;return a.test(arguments[0])},testUUID:function(){var a=/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;return a.test(arguments[0])}});"use strict";gereji.extend("transition",{options:{direction:"left",duration:900,timingFunction:"ease"},duration:function(){this.options.duration=arguments[0]?arguments[0]:this.options.duration;return this},direction:function(){this.options.direction=arguments[0]?arguments[0]:this.options.direction;return this},slide:function(){var a=arguments[0];var b=arguments[1]?arguments[1]:false;switch(this.options.direction){case"left":this.transition(a,this.next(a),"width",b);break;case"right":this.transition(a,this.previous(a),"width",b);break;case"up":this.transition(a,this.next(a),"height",b);break;case"down":this.transition(a,this.previous(a),"height",b);break}return this},transition:function(d,c,b,f){c.style.display="inline-block";var a=d[("client"+b.charAt(0).toUpperCase()+b.slice(1))];if(!this.modern()){return this.animate(function(g){c.style[b]=String(Math.ceil(a*g))+"%";d.style[b]=String(Math.floor(a-(a*g)))+"%"},f)}var e=b+" "+this.options.duration+"ms "+this.options.timingFunction;d.style.transition=e;c.style.transition=e;d.style[b]="0";c.style[b]=String(a)+"px";f&&setTimeout(f,this.options.duration);return this},next:function(b){var a=b.nextSibling?b.nextSibling:b.parentNode.firstChild;while(a.nodeType!=1){a=a.nextSibling?a.nextSibling:b.parentNode.firstChild}return a},previous:function(b){var a=b.previousSibling?b.previousSibling:b.parentNode.lastChild;while(a.nodeType!=1){a=a.previousSibling?a.previousSibling:b.parentNode.lastChild}return a},modern:function(){var a=document.createElement("p").style;return("transition" in a||"webkitTransition" in a||"MozTransition" in a||"msTransition" in a||"OTransition" in a)},animate:function(a,b){var d=1;do{var c=Math.sin(0.5*Math.PI*d/this.options.duration);(function(){var f=c;var e=d;setTimeout(function(){a(f);(e==duration)&&b&&b()},d)})()}while(d++<duration)}});"use strict";gereji.extend("model",{init:function(){this.status="ready";this.broker=new gereji.broker();this.broker.init();this.ajax=new gereji.sync();this.ajax.init();this.store={data:{},meta:{}};return this},ready:function(){if(arguments[0]){this.status=arguments[0]}return(this.status=="ready")},meta:function(){var a=arguments[0]?arguments[0]:undefined;var b=arguments[1]?arguments[1]:undefined;if(b!=undefined){this.store.meta[a]=b}if(a!=undefined&&b==undefined){return this.store.meta[a]?this.store.meta[a]:undefined}return this},set:function(property,value){var store=this.store.data;var pattern=/\[([\d])\]/g;var path="this.store.data";var keys=property.split(/\./g);for(var i=0;i<keys.length;i++){var indices=keys[i].match(pattern);path+="."+keys[i].replace(pattern,"");eval(path+" = "+path+" ? "+path+" : "+(indices?"[]":"{}"));if(!indices){continue}for(var j=0;j<indices.length;j++){path+=indices[j];eval(path+" = "+path+" ? "+path+" : {}")}}eval(path+" = value");return this},get:function(key){var test="this.store.data";var path=key.replace(/\[(.*)\]/,"").split(".");var index=(key.indexOf("[")==-1)?false:key.match(/\[(.*)\]/)[1];var value=undefined;for(var i in path){test+="."+path[i];value=eval(test)===undefined?undefined:(index?eval(test+"["+index+"]"):eval(test))}return value},sync:function(){var b=this;var c=this.meta("about");var d=JSON.stringify(this.store.data);var a=this.broker;this.ajax.post(c,d,function(){b.broker.emit({type:"sync",data:arguments[0]})})},destroy:function(){this.store={}},serialize:function(){return JSON.stringify(this.store)},find:function(){return this.store.data}});"use strict";gereji.extend("collection",{init:function(){this.store={data:null,meta:{},ready:false};this.broker=new gereji.broker();this.broker.init();this.ajax=new gereji.sync();this.ajax.init();this.storage=new gereji.storage();this.storage.init();return this},ready:function(){var b=this.storage.get("collections");var a=this.store.meta.name;this.store.ready=b.hasOwnProperty(a);if(this.store.ready){this.store.data=b[a]}return this.store.ready},data:function(){if(arguments[0]){this.store.data=arguments[0]}return this.store.data},filter:function(f){var c;var a=this.store.data;var e=[];for(var d in a){c=true;for(var b in f){c=(a[d][b]==f[b]);if(!c){break}}if(c){e.push(a[d])}}return e},fetch:function(){var a=this.store.meta.name;var b=this;this.ajax.get(this.store.meta.about,function(c){var c=JSON.parse(c);var d=b.storage.get("collections");d[a]=c;b.store.data=d[a];b.storage.set("collections",d);b.broker.emit({type:"update",data:c})});return this},meta:function(){var a=arguments[0];var b=arguments[1];if(b!=undefined){this.store.meta[a]=b}if(a!=undefined&&b==undefined){return this.store.meta[a]?this.store.meta[a]:undefined}return this}});"use strict";gereji.extend("query",{init:function(){var b=arguments[0];var a=arguments[1]?arguments[1]:document;this.elements=Sizzle(b,a);return this},setElement:function(){this.elements=[arguments[0]];return this},ancestor:function(a){if(!this.elements.length){return this}this.elements=[this.elements[0].parentNode];if(Sizzle((">"+a),this.elements[0].parentNode).length){return this}return this.ancestor(a)},children:function(){var a=arguments[0];if(!this.elements.length){throw new Error("There is no element to find children of.")}this.elements=Sizzle(a,this.elements[0]);return this},next:function(){var b=this.elements[0];var a=b.nextSibling?b.nextSibling:b.parentNode.firstChild;while(a.nodeType!=1){a=a.nextSibling?a.nextSibling:b.parentNode.firstChild}this.elements=[a];return this},previous:function(){var b=this.elements[0];var a=b.previousSibling?b.previousSibling:b.parentNode.lastChild;while(a.nodeType!=1){a=a.previousSibling?a.previousSibling:b.parentNode.lastChild}this.elements=[a];return this},each:function(b){for(var a=0;a<this.elements.length;a++){b(this.elements[a])}return this},hasClass:function(){if(this.elements.length){return(this.elements[0].className.indexOf(arguments[0])!=-1)}else{return false}},addClass:function(){var a=arguments[0] instanceof Array?arguments[0]:[arguments[0]];this.each(function(c){for(var b in a){if(c.className.indexOf(a[b])==-1){c.className+=" "+a[b]}}});return this},removeClass:function(){var a=arguments[0] instanceof Array?arguments[0]:[arguments[0]];this.each(function(c){for(var b in a){c.className=c.className.replace(a[b],"").replace(/\s\s/g," ")}});return this},appendChild:function(a){this.each(function(b){b.appendChild(a)});return this},html:function(a){if(!a){return this.elements.length?this.elements[0].innerHTML:null}this.each(function(b){b.innerHTML=a});return this},innerHTML:function(a){this.each(function(b){b.innerHTML=a});return this},value:function(a){if(!a){return this.elements.length?this.elements[0].value:null}this.each(function(b){b.value=a});return this},attribute:function(a,b){if(arguments.length==1){return this.elements[0].getAttribute(a)}this.each(function(c){c.setAttribute(a,b)});return this},css:function(a){this.each(function(c){for(var b in a){c.style[b]=a[b]}});return this},remove:function(){this.each(function(a){a.remove()});return this}});"use strict";gereji.extend("xslt",{init:function(a){this.options=a;this.store={ready:false};this.name=a.type+"-"+a.name;this.broker=new gereji.broker();this.broker.init();this.sync=new gereji.sync();this.sync.init();this.storage=new gereji.storage();this.storage.init();return this},ready:function(){var a=this.storage.get("templates");this.store.ready=a.hasOwnProperty(this.name);if(this.store.ready){this.xsl=a[this.name]}return this.store.ready},fetch:function(){var a="/static/"+this.options.type+"/"+this.options.name+".xsl";var b=this;this.sync.get(a,function(d){b.xsl=d;var c=b.storage.get("templates");c[b.name]=b.xsl;b.storage.set("templates",c);b.broker.emit({type:"update",data:{}})});return this},transform:function(){try{}catch(a){if(!console){return this}console.log(a);console.log(a.stack)}},transform2:function(a){try{this.style=Saxon.parseXML(this.xsl);this.processor=Saxon.newXSLT20Processor(this.style);this.xml=this.json2xml({data:a});this.doc=Saxon.parseXML(this.xml);this.html=this.processor.transformToFragment(this.doc,document);console.log(this.html);return this}catch(b){if(!console){return this}console.log(b);console.log(b.stack)}},getHTML:function(){return this.html},json2xml:function(){var b=arguments[0];if(typeof b=="string"){b=JSON.parse(b)}var a=this.createXML(b);a.unshift('<?xml version="1.0"?>');return a.join("\n")},createXML:function(){var d=arguments[0];var b=[];for(var c in d){var a=isNaN(c)?c:"node-"+String(c);var f=["number","boolean","string"].indexOf(typeof d[c])==-1;var e=f?this.createXML(d[c]):this.encode(String(d[c]));b.push("<"+a+">"+e+"</"+a+">")}return b},encode:function(a){return document.createElement("a").appendChild(document.createTextNode(a)).parentNode.innerHTML},parse:function(){try{return((new DOMParser).parseFromString(arguments[0],"application/xml"))}catch(b){var a=document.implementation.createHTMLDocument("");a.documentElement.innerHTML=arguments[0];return a}}});"use strict";gereji.extend("view",{ready:function(){return(this.store.template.ready()&&this.store.source.ready())},initStore:function(){this.store={data:{},template:{},stage:{}};return this},initBroker:function(){this.broker=new gereji.broker();this.broker.init();return this},initStage:function(){this.store.stage=document.getElementById(this.options.stage);return this},initTemplate:function(){this.store.template=new gereji.xslt();this.store.template.init(this.options);this.store.template.fetch();return this}});"use strict";gereji.view.extend("form",{init:function(a){this.options=a;this.initStore();this.initBroker();this.initStage();this.initTemplate();this.initModel();this.attachEvents();this.activate();return this},initModel:function(){this.store.source=new gereji.model();this.store.source.init();this.store.source.meta("about",this.options.about);this.store.source.meta("name",this.options.name);if(this.options.data){this.store.source.store.data=this.options.data}return this},getModel:function(){return this.store.source},attachEvents:function(){var a=this;this.store.template.broker.on(["ready","update"],function(){a.render()})},activate:function(){var a=this.store.template;if(!a.ready()){a.fetch()}},render:function(){if(!this.store.template.ready()){return this}var c=this.store.source.find();this.store.template.transform(c);this.store.stage.innerHTML="";var a=this.store.template.getHTML();this.store.stage.appendChild(a);this.renderSelects();this.renderUploadBoxes();this.options.sandbox.emit({type:"body:change",data:this.store.stage});var b=this.options.name+"-form:render";this.options.sandbox.emit({type:b,data:this.options.data});this.initEditor();return this},renderSelects:function(){var b=this.options.data;var a=(new gereji.query()).setElement(this.store.stage).children("select");a.each(function(g){var h=new gereji.collection();h.init();var c=g.getAttribute("collection");var f=g.getAttribute("about");if(!c||!f){return}var j=g.getAttribute("property");h.meta("name",c);h.meta("about",f);var k=g.getAttribute("text");var i=g.getAttribute("value");var e;var l=g.getElementsByTagName("option");if(l){e=l[(l.length-1)]}var d=function(){var m=arguments[0].data;for(var n in m){var o=document.createElement("option");o.innerHTML=m[n][k];o.value=m[n][i];if(b&&b[0]&&m[n][i]==b[0][j]){o.selected="selected"}if(e){e.parentNode.insertBefore(o,e)}if(!e){g.appendChild(o)}}};h.broker.on("update",d);if(h.ready()){d(h.data())}h.fetch()})},renderUploadBoxes:function(){var a=(new gereji.query()).setElement(this.store.stage).children("input.upload-box-values");a.each(function(e){if(!e.value.length){return}var b=e.value.split(",");var f=(new gereji.query()).setElement(e).next().elements[0];for(var d in b){if(!b[d].length){continue}var j=f.cloneNode(true);var g=(new gereji.query()).setElement(j).findChildrenTag(".animation");g.css({display:"none"});var h=(new gereji.query()).setElement(j).children(".placeholder");var c="url('/images/"+b[d]+"')";h.css({backgroundImage:c,"border-width":0,display:"block"});e.parentNode.appendChild(j);(new gereji.query()).setElement(j).children("i.upload-box-uncheck").css({display:"inline-block"});(new gereji.query()).setElement(j).children("i.upload-box-add").css({display:"none"})}f.remove()})},initEditor:function(){if(typeof tinymce=="undefined"){return this}setTimeout(function(){tinymce.init({menubar:false,plugins:"imagestudio code paste",toolbar:"undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link imagestudio | code",selector:"textarea.html-editor",document_base_url:"/",entity_encoding:"numeric",relative_urls:true})},100);return this}});"use strict";gereji.view.extend("list",{init:function(a){this.options=a;this.initStore();this.initBroker();this.initStage();this.initTemplate();this.initCollection();this.attachEvents();return this},initCollection:function(){this.store.source=new gereji.collection();this.store.source.init();this.store.source.meta("name",this.options.name);this.store.source.meta("about",this.options.about);this.store.source.fetch();return this},attachEvents:function(){var a=this;this.store.template.broker.on(["update"],function(){if(a.store.source.ready()){a.render()}});this.store.source.broker.on(["update"],function(){if(a.store.template.ready()){a.render()}})},render:function(){if(!this.store.template.ready()||!this.store.source.ready()){return this}var a=this.store.source.data();this.store.template.transform(a);this.store.stage.innerHTML="";this.store.stage.appendChild(this.store.template.getHTML());this.options.sandbox.emit({type:"body:change",data:this.store.stage});return this}});"use strict";gereji.extend("os",{sandbox:{},apps:{},register:function(b,a){this.apps[b]={creator:a,instance:null}},start:function(b){var c=this.apps[b];c.instance=c.creator(this.sandbox);try{c.instance.init()}catch(a){console&&console.error(a.stack)}},stop:function(b){var a=this.apps[b];if(!a.instance){return}a.instance.kill();a.instance=null},boot:function(){this.sandbox=new gereji.broker();this.sandbox.init();this.sandbox.models={};this.sandbox.collections={};this.sandbox.validator=new gereji.validator();this.sandbox.transition=new gereji.transition();this.sandbox.storage=new gereji.storage();this.sandbox.sync=new gereji.sync();this.sandbox.storage.init();this.sandbox.sync.init();for(var a in this.apps){this.apps.hasOwnProperty(a)&&this.start(a)}this.sandbox.emit({type:"body:load",data:{}})},halt:function(){for(var a in this.apps){this.apps.hasOwnProperty(a)&&this.stop(a)}}});gereji.apps=new gereji.os();"use strict";gereji.apps.register("events",function(a){var b;return{init:function(){b=this;for(var c in b.events){var d="on"+b.events[c];document[d]=function(){b.fire.apply(b,arguments)}}window.onresize=function(){a.emit({type:"window:resize",data:arguments[0]})}},fire:function(f){f=f||window.event;var g=f.target||f.srcElement;if(b.bubble(g,f)){return}var e={data:{}};e.data.target=g;e.data.event=f;var c=String(g.className).split(" ");for(var d in c){e.type="."+c[d]+":"+f.type;a.emit(new Object(e))}e.type="#"+g.id+":"+f.type;a.emit(new Object(e));e.type=String(g.tagName).trim().toLowerCase()+":"+f.type;a.emit(new Object(e))},bubble:function(d,c){if(String(d.className).indexOf("bubble-up")==-1){return false}if(d.parentNode[c.type]){d.parentNode[c.type]()}return true},events:["load","change","resize","submit","drag","dragstart","dragenter","dragleave","dragover","dragend","drop","mousedown","mouseup","mousemove","mouseover","mouseout","click","dblclick","keyup","keydown","keypress"]}});"use strict";gereji.apps.register("collapsible",function(a){var b;return{init:function(){b=this;a.on(["body:load","body:change"],b.close);a.on([".collapsible-single-openclose:click"],b.toggle);a.on([".collapsible-openclose:click"],b.dance)},close:function(){var c=(new gereji.query()).init(".collapsible-close");c.each(function(e){var d=(new gereji.query()).setElement(e);if(!d.attribute("collapsible-height")){d.attribute("collapsible-height",e.clientHeight)}})},toggle:function(){var d=(new gereji.query()).setElement(arguments[0].data.target).ancestor(".collapsible");if(!d.hasClass("collapsible-single-closed")){return d.css("collapsible-height","auto").addClass("collapsible-single-closed")}var c=d.attribute("collapsible-height")+"px";d.css("height",c).removeClass("collapsible-single-closed")},dance:function(){var f=arguments[0].data.target;var e=(new gereji.query()).setElement(f).ancestor(".collapsible");var d=e.hasClass("collapsible-open");var c=(new gereji.query()).setElement(e.elements[0].parentNode).children(".collapsible");c.each(function(g){(new gereji.query()).setElement(g).removeClass("collapsible-open").addClass("collapsible-close")});e.removeClass(d?"collapsible-open":"collapsible-close");e.addClass(d?"collapsible-close":"collapsible-open");return this}}});"use strict";gereji.apps.register("basket",function(a){var b;return{init:function(){b=this;a.on([".draggable:dragstart"],b.dragStart);a.on([".draggable:dragend"],b.dragEnd);a.on([".droppable:dragover"],b.dragOver);a.on([".droppable:dragenter"],b.dragEnter);a.on([".droppable:dragleave"],b.dragLeave);a.on([".droppable:drop"],b.drop)},dragStart:function(){var d=arguments[0].data.target;d.id=d.id?d.id:a.storage.uuid();var c=arguments[0].data.event;c.dataTransfer.setData("id",d.id)},dragOver:function(){var c=arguments[0].data.event;c.preventDefault();c.dataTransfer.effectAllowed="move"},dragEnter:function(){var c=arguments[0].data.target;c.classList.add("dragover")},dragLeave:function(){var c=arguments[0].data.target;c.classList.remove("dragover")},drop:function(){var f=arguments[0].data.target;var e=arguments[0].data.event;var g=e.dataTransfer.getData("id");var c=document.getElementById(g);f.appendChild(c);f.classList.remove("dragover");var d=c.getAttribute("name")+":drop";a.emit({type:d,data:{area:f,object:c}})},dragEnd:function(){var c=arguments[0].data.target;c.classList.remove("dragover")}}});"use strict";gereji.apps.register("collapsible",function(a){var b;return{init:function(){b=this;a.on(["body:load","body:change"],b.close);a.on([".collapsible-single-openclose:click"],b.toggle);a.on([".collapsible-openclose:click"],b.dance)},close:function(){var c=(new gereji.query()).init(".collapsible-close");c.each(function(e){var d=(new gereji.query()).setElement(e);if(!d.attribute("collapsible-height")){d.attribute("collapsible-height",e.clientHeight)}})},toggle:function(){var d=(new gereji.query()).setElement(arguments[0].data.target).ancestor(".collapsible");if(!d.hasClass("collapsible-single-closed")){return d.css("collapsible-height","auto").addClass("collapsible-single-closed")}var c=d.attribute("collapsible-height")+"px";d.css("height",c).removeClass("collapsible-single-closed")},dance:function(){var f=arguments[0].data.target;var e=(new gereji.query()).setElement(f).ancestor(".collapsible");var d=e.hasClass("collapsible-open");var c=(new gereji.query()).setElement(e.elements[0].parentNode).children(".collapsible");c.each(function(g){(new gereji.query()).setElement(g).removeClass("collapsible-open").addClass("collapsible-close")});e.removeClass(d?"collapsible-open":"collapsible-close");e.addClass(d?"collapsible-close":"collapsible-open");return this}}});"use strict";gereji.apps.register("todos",function(a){var b;return{init:function(){b=this;a.on([".add-item:click",".edit-item:dblclick"],b.form);a.on(["form:submit"],b.submit);a.on(["todo:drop"],b.moveStage);a.on(["body:load"],function(){b.render(["ideas-list","developing-list","testing-list","production-list"])})},kill:function(){},render:function(f){var e=new gereji.collection();e.init();e.meta("name","todo");e.meta("about","/api/todos");var d=new gereji.xslt();d.init({name:"todo",type:"list"});var c=function(){if(!e.ready()||!d.ready()){return}for(var j=0;j<f.length;j++){var k={stage:f[j].replace("-list","")};var g=e.filter(k);var h=document.getElementById(f[j]);h.innerHTML="";h.appendChild(d.transform(g).getHTML())}};e.broker.on("update",c);d.broker.on("update",c);e.fetch();d.fetch()},form:function(){var e=arguments[0].type;var f=arguments[0].data.target;var d={sandbox:a,name:f.getAttribute("name"),about:f.getAttribute("about"),stage:f.getAttribute("stage"),type:"form"};var c=new gereji.view.form();if(e==".edit-item:dblclick"){d.data=[{_id:d.stage,todo:f.innerHTML}]}c.init(d);c.render();if(e==".add-item:click"){return(f.style.display="none")}(new gereji.query()).setElement(f).ancestor(".collapsible").removeClass("collapsible-close").addClass("collapsible-open")},submit:function(){var i=arguments[0].data.target;var h=arguments[0].data.event;var f={};f.about=i.getAttribute("about");f.name=i.getAttribute("name");if(!f.about||!f.name){return this}f.type="form";f.about=f.about.replace(/\/$/,"");h.preventDefault();var e=new gereji.model();e.init();e.meta("about",f.about);e.meta("name",f.name);if(!b.parse(["textarea"],i,e)){return this}var c=e.get("todo").match(/(#[\w]*)/g);if(c){e.set("hashtags",c.join(",").replace(/#/g,"").split(","))}var g=e.get("todo").match(/(@[\w]*)/g);if(g){e.set("handles",g.join(",").replace(/@/g,"").split(","))}var d=(new gereji.query()).setElement(i).ancestor(".droppable").elements[0].id.replace("-list","").replace("-form","");e.set("stage",d);a.emit({type:f.name+":sync",data:e});e.broker.on("sync",function(){b.render([d+"-list"]);i.remove()});e.sync();i.style.display="none";if(f.about=="/api/todos"){(new gereji.query()).init('a[stage="'+d+'-form"]').css({display:"block"})}return this},parse:function(d,k,c){for(var f in d){var e=d[f];var j=k.getElementsByTagName(e);for(var f=0;f<j.length;f++){var h=j[f].getAttribute("property");var g=j[f].getAttribute("type");if(!h){continue}if(["radio","checkbox"].indexOf(g)!=-1&&!j[f].checked){continue}if(!b.validate({data:{target:j[f]}})){return false}c.set(h,j[f].value)}}return true},validate:function(){var f=arguments[0].data.target;var e=(new gereji.query()).setElement(f);e.removeClass("invalid-input");var c=f.className.split(" ");for(var d in c){if(a.validator.test(c[d],f.value)){continue}f.focus();e.addClass(" invalid-input");if(f.tagName.toLowerCase()!="select"){f.value=""}if(e.hasClass("required")){return false}}return true},moveStage:function(){var d=(new gereji.query()).setElement(arguments[0].data.object).children('span[property="todo"]');var f=document.createElement("form");var e="/api/todos/"+d.attribute("stage");f.setAttribute("about",e);f.setAttribute("name","todo");var c=document.createElement("textarea");c.setAttribute("property","todo");c.innerHTML=d.html();f.appendChild(c);f.style.display="none";arguments[0].data.area.appendChild(f);b.submit({data:{target:f,event:{preventDefault:function(){}}}});setTimeout(function(){f.remove()},900)}}});