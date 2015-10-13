/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 * 
 *	The role of the importer is to take an input xcel or json file and 
 * 	process them into the data into the various view data files for rendering
 */
function cloner (input, filename) {
	var fs = require('fs');
	var targetdir = './server/private/data/viewdata/fullset/';

	var inputJSON, outputJSON = {};
	var outputHtmlData = "";
	if (input) {
		// create JSON input structure
		inputJSON = JSON.parse(input);
		// assert that output structure is the same but bigger than input to avoid cloning isssues
		outputJSON = JSON.parse(input);
		// monitor for input dropbox files and move to private area
		var builder = require('./FullAnnualContractInputBuilder.js');
		builder.build(inputJSON, outputJSON);		
		// write fullset contents to viewer data source directory
//		console.log('writing full set data file ' + filename);
		fs.writeFile(targetdir + "full" + filename, JSON.stringify(outputJSON, null, 3), function (err) {
			if (err) { throw err; } 
//			console.log(' data saved');
		});

	}
}

exports.watcher = function () {
	var fs = require('fs');
	var inputdir = './server/private/data/dropbox/';
//	handle data files	
	fs.watch(inputdir, function(event, filename){
		console.log( filename + " will be imported");
		console.log('event is: ' + event);
		if (filename) {
			console.log('filename provided: ' + filename);
			// read the modified file and push to cloner
			var data;
			fs.readFile(inputdir + filename, function (err, data) {
				if (err) {
					throw err;	
				} else {
//					Handle xcel and json separately
					var segments = filename.split('.');
					if (segments[segments.length-1] === 'json'){
						cloner(data,  filename);
					}
				}
			});
		} else {
			console.log('filename not provided');
		}
	});
	console.log("Now watching /server/private/data/dropbox/ for changes...");

	
	// handle profile files	
	fs.watch(inputdir + "reportProfiles/", function(event, filename){
		console.log( filename + " will be imported");
		console.log('event is: ' + event);
		if (filename) {
			console.log('filename provided: ' + filename);
			// read the modified file and push to cloner
			var profile;
			fs.readFile(inputdir + "reportProfiles/" + filename, function (err, profile) {
				if (err) {
					throw err;	
				} else {
//					Handle xcel and json separately
					var segments = filename.split('.');
					if (segments[segments.length-1] === 'json'){
						var targetdir = './server/private/data/viewdata/viewProfiles/';
						fs.writeFile(targetdir + filename, profile, function (err) {
							if (err) {throw err; } 
							console.log('profile saved');
						});					
					}
				}
			});
		} else {
			console.log('filename not provided');
		}
	});
	console.log("Now watching /server/private/data/dropbox/reportProfiles/ for changes...");


};

