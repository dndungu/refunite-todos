var server = require(__dirname + '/core/server.js');
var settings = require(__dirname + '/settings.json');
settings.path = __dirname + "/";
server.start(settings);
