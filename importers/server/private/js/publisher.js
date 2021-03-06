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
//		console.log('-publisher- writing data file ' + filename);
		fs.writeFile(filename, input, function (err) {
			if (err) { throw err; } 
//			console.log('-publisher- saved');
		});
	}
}



exports.watcher = function () {
	var fs = require('fs');
	var profileHandler = require('./transformerShell');
	var outputDataPath = './server/public/data/viewdata/';
	var outputHtmlPath = './server/public/html/reports/dashboard/';

	
	fs.watch('./server/private/data/viewdata/', function(event, filename){
		console.log( "-publisher- " + filename + " will be published");		
		console.log('-publisher- event is: ' + event);
		  if (filename) {
		    console.log('-publisher- filename provided: ' + filename);
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
		    console.log('-publisher- filename not provided');
		  }
	});
	console.log("-publisher- Now watching ./server/private/data/viewdata/ for changes...");

	fs.watch('./server/private/html/dataTables/', function(event, filename){
		console.log("-publisher- " + filename + " will be published");		
		console.log('-publisher- event is: ' + event);
		  if (filename) {
		    console.log('-publisher- filename provided: ' + filename);
			  // read the modified file and push to cloner
			var data;
			fs.readFile('./server/private/html/dataTables/' + filename, function (err, data) {
			if (err) {
				throw err;	
			} else {
				cloner(data, './server/public/html/reports/dashboard/dataTables/' + filename);
				}
			});
		  } else {
		    console.log('-publisher- filename not provided');
		  }
	});
	console.log("-publisher- Now watching ./server/private/html/dataTables/ for changes...");

	
	fs.watch('./server/private/data/viewdata/viewProfiles/', function(event, filename){
		console.log("-publisher- " + filename + " will be processed");		
		console.log('-publisher- event is: ' + event);
		  if (filename) {
		    console.log('-publisher- filename provided: ' + filename);
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
		    console.log('-publisher- filename not provided');
		  }
	});
	console.log("-publisher- Now watching ./server/private/data/viewdata/viewProfiles/ for changes...");
	

};

