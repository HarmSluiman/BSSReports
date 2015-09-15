/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 */

// set up Express static http server used in dev environments - nginx used in production
var express = require('express');
var path = require('path');
 
var http = require('http');
var querystring = require('querystring');

function processPost(request, response, callback) {
    var queryData = "";
    if(typeof callback !== 'function'){ return null;}
    console.log("service server received a "+request.method+" http request");
    if(request.method === 'POST') {
        request.on('data', function(data) {
            queryData += data;
            if(queryData.length > 1e6) {
                queryData = "";
                response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                request.connection.destroy();
            }
        });

        request.on('end', function() {
            request.post = querystring.parse(queryData);
            callback();
        });

    } else {
        response.writeHead(405, {'Content-Type': 'text/plain'});
        response.end();
    }
}


var server = express();
server.use(express.static(__dirname + '/server/public'));


var servicePort = 10000;

var serviceServer = http.createServer(function(request, response) {
    console.log("request method: " + request.method);
	if(request.method === 'POST') {
        processPost(request, response, function() {
            console.log(request.post);
            // Use request.post here

            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
            response.end();
        });
    } else {
        response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        response.end();
    }
});
//server.listen(__dirname + '/server/public');
serviceServer.listen(servicePort,  function() {
	path.normalize(__dirname + '/server/public');
    console.log('My node service server is listening on port ' + servicePort);
  
});

// start all the stage monitors in reverse order so that a startup time push is not missed

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

