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
            // kill this request if it is a flooding attack
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
//    	console.log(body);

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
	var filename = 'AnnualContractInput.json';
	var targetdir = './server/private/data/viewdata/fullset/';
/* There are 3 post requests supported at this time:
 * /public/data/dropbox/
 * 		This is intended for a fresh input of data  and will be processed to create a full set of
 *  	data set files as viewdata to feed each report 
 * /rawAnnualContract/ 
 * 		Raw data is a convenience url that is used by a browser to have the same effect as dropbox
 * 		without altering the original input file. This is a user interaction to adjust previous
 * 		input data. So it is processed like dropbox but without updating the public/dropbox file.
 * /fullAnnualContract/
 * 		All inputs are merged into or used to create the fullAnnualContact data set which is the
 * 		input data plus any registered derivations needed to populate the report viewdata data sets.
 *
 * All other requests are ignored
 * 
 */
    
	if(request.method === 'POST') {
        processPost(request, response, function() {
            //console.log(JSON.stringify(request.post, null, 3));
        	//console.log(request.headers);
        	console.log(request.url);
//       	fs.writeFile("dump.json", JSON.stringify(data, null, 3), function (err) {
//        		if (err) { throw err; } 
//    			console.log('dumped post data to dump.json');
//    		});
        	// handle input that will not drive recalculation
        	if (request.url === '/fullAnnualContract/'){
        		// write input contents to viewer data source directory
//        		console.log('writing input data set data file full' + filename);
        		fs.writeFile(targetdir + 'full' + filename, JSON.stringify(data, null, 3), function (err) {
        			if (err) { throw err; } 
        			console.log('input full set data saved');
        		});
        	}
        	if (request.url === '/rawAnnualContract/'){
        		// write input contents to viewer data source directory
//        			console.log('writing input data set data file raw' + filename);
        		fs.writeFile("./server/private/data/dropbox/" + 'raw' + filename, JSON.stringify(data, null, 3), function (err) {
        			if (err) { throw err; } 
        			console.log('input raw set data saved to private dropbox');
        		});
        	}

        	if (request.url === '/public/data/dropbox/'){
        		// write input contents to viewer data source directory
//        			console.log('writing input data set data file full' + filename );
        		fs.writeFile( './server/private/data/dropbox/' + filename, JSON.stringify(data, null, 3), function (err) {
        			if (err) { throw err; } 
        			console.log('input saved to drop box');
        		});
        	}

        	
        	
        	//var postJSON= JSON.parse(request.post);
        	// respond with appropriate code
            response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
           
            response.end();
        });
    } else {
    	// just swallow all other http requests
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

//monitor for public input dropbox files and move to private area
var monitor = require('./server/private/js/watcher.js');
monitor.watcher();

