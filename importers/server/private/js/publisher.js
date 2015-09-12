/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 * 
 *	The role of the publisher is to take any updated view data files and 
 * 	move them to the public content space
 */
function cloner (input, filename) {
	var fs = require('fs');
	if (input) {
		// write contents to viewer data source directory
		console.log('writing data file ' + filename);
		fs.writeFile(filename, input, function (err) {
			if (err) { throw err; } 
			console.log('saved');
		});
	}
}



exports.watcher = function () {
	var fs = require('fs');
	var profileHandler = require('./transformerShell');
	var outputDataPath = './server/public/data/viewdata/';
	var outputHtmlPath = './server/public/html/reports/dashboard/';

	
	fs.watch('./server/private/data/viewdata/', function(event, filename){
		console.log( filename + " will be published");		
		console.log('event is: ' + event);
		  if (filename) {
		    console.log('filename provided: ' + filename);
			  // read the modified file and push to cloner
			var data;
			fs.readFile('./server/private/data/viewdata/' + filename, function (err, data) {
			if (err) {
				throw err;	
			} else {
				cloner(data, './server/public/data/viewdata/' + filename);
				}
			});
		  } else {
		    console.log('filename not provided');
		  }
	});
	console.log("Now watching server/private/data/viewdata/ for changes...");
	
	fs.watch('./server/private/data/viewdata/viewProfiles/', function(event, filename){
		console.log( filename + " will be processed");		
		console.log('event is: ' + event);
		  if (filename) {
		    console.log('filename provided: ' + filename);
			  // read the modified file and push to cloner
			var dataset;
			fs.readFile('./server/private/data/viewdata/fullset/fullAnnualContractInput.json', function (err, dataset) {
			if (err) {
				throw err;	
			} else {
				profileHandler.processProfile(dataset,'./server/private/data/viewdata/viewProfiles/' + filename ,outputHtmlPath, outputDataPath);
				}
			});
		  } else {
		    console.log('filename not provided');
		  }
	});
	console.log("Now watching server/private/data/viewdata/viewProfile/ for changes...");

};

