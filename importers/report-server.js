// set up Express static http server
var express = require('express');
 
var server = express();
server.use(express.static(__dirname + '/server/public'));

var port = 10001;
server.listen(port, function() {
    console.log('My node server is listening on port ' + port);
    console.log('the root path is ' + __dirname + '/server/public');
});


//monitor for new view data and publish to public
var publisher = require('./server/private/js/publisher.js');
publisher.watcher();

//monitor for new complete data set and run report generators
var transformer = require('./server/private/js/transformerShell.js');
transformer.watcher();

// monitor private input files and convert into appropriate view data etc.
var importer = require('./server/private/js/importer.js');
importer.watcher();

//monitor for input dropbox files and move to private area
var monitor = require('./server/private/js/watcher.js');
monitor.watcher();

