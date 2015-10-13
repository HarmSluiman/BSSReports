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
var qs = require('querystring');
server.use(express.static(__dirname + '/server/public'));


var servicePort = 10000;

var serviceServer = http.createServer(function(request, response) {
	  // request is an http.IncomingMessage, which is a Readable Stream
	  // response is an http.ServerResponse, which is a Writable Stream

    var body = '';
    request.setEncoding('utf8');

    // Readable streams emit 'data' events once a listener is added
    request.on('data', function (chunk) {
      body += chunk;
    });

    // the end event tells you that you have entire body
	var data;
    request.on('end', function () {
    	console.log(body);

      try {
        data = JSON.parse(body);
      } catch (er) {
        // uh oh!  bad json!
        response.statusCode = 400;
        return response.end('error: ' + er.message);
      }

      // write back something interesting to the user:
      response.write(typeof data);
      response.end();
    });
 
    
	console.log("request method: " + request.method);
	var fs = require('fs');
	var filename = 'fullAnnualContractInput.json';
	var targetdir = './server/private/data/viewdata/fullset/';

    
	if(request.method === 'POST') {
        processPost(request, response, function() {
            //console.log(JSON.stringify(request.post, null, 3));
        	//console.log(request.headers);
        	console.log(request.url);
        	fs.writeFile("dump.json", JSON.stringify(data, null, 3), function (err) {
        		if (err) { throw err; } 
        		if (request.url === '/fullAnnualContract/'){
        			// write fullset contents to viewer data source directory
//        			console.log('writing full set data file ' + filename);
        			fs.writeFile(targetdir + filename, JSON.stringify(data, null, 3), function (err) {
        				if (err) { throw err; } 
//        					console.log(' data saved');
        			});
        		}
        		console.log('dumped post data to dump.json');
        	});

        	
        	
        	//var postJSON= JSON.parse(request.post);
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
	//path.normalize(__dirname + '/server/public');
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

