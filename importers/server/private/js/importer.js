/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 * 
 *	The role of the importer is to take an input xcel or json file found in the private dropbox 
 *  and and send for processing into consumable input for the downstream profiles.
 *  the builder does the consolidation, and importer creates an html file for editing the 
 *  most recent input json.
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
		// this hack is no longer needed
		outputJSON = JSON.parse(input);
		// parse input and load it into the full data set needed to produce all the reports
		var builder = require('./FullAnnualContractInputBuilder.js');
		builder.build(inputJSON, outputJSON);		
		// write fullset contents to viewer data source directory
//		console.log('-importer- writing full set data file ' + filename);
		fs.writeFile(targetdir + "fullAnnualContractInput.json" , JSON.stringify(outputJSON, null, 3), function (err) {
			if (err) { throw err; } 
//			console.log('-importer-  data saved');
		});
		// provide an html page to edit this file and resubmit the data if the user chooses to iterate	
		// produce html view of raw set Data
		// var builder = require('./FullAnnualContractInputBuilder.js');
		// write data and html to viewer source directory
		var targetDataTableDir = './server/private/html/dataTables/';
		outputHtmlData = builder.generateHtmlFromJSON(inputJSON, "http://localhost:10000/rawAnnualContract/");		
//		console.log('-importer- writing full set html data file ' + filename);
		fs.writeFile(targetDataTableDir + "LastRawAnnualContractData.html", outputHtmlData, function (err) {
			if (err) { throw err; } 
//			console.log('-importer-  data html saved');
		});

			
			


	}
}

exports.watcher = function () {
	var fs = require('fs');
	var inputdir = './server/private/data/dropbox/';
	var targetFilename = "fullAnnualContractInput.json";
//	handle data files	
	fs.watch(inputdir, function(event, filename){
		console.log( "-importer- " + filename + " will be imported");
		console.log('-importer- event is: ' + event);
		if (filename) {
			console.log('-importer- filename provided: ' + filename);
			// read the modified file and push to cloner
//			Handle xcel and json separately
			var segments = filename.split('.');
			if (segments[segments.length-1] === 'json'){
				var data;
				fs.readFile(inputdir + filename, function (err, data) {
					if (err) {
						throw err;	
					} else {
						cloner(data,  targetFilename);
					}
					
				});
			} else {
				console.log('-importer- only import .json files at this time.');
			}

		} else {
			console.log('-importer- filename not provided');
		}
	});
	console.log("-importer- Now watching /server/private/data/dropbox/ for changes...");

	
	// handle profile files	
	fs.watch(inputdir + "reportProfiles/", function(event, filename){
		console.log( "-importer- "+filename + " will be imported");
		console.log('event is: ' + event);
		if (filename) {
			console.log('-importer- filename provided: ' + filename);
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
							console.log('-importer- profile saved');
						});					
					}
				}
			});
		} else {
			console.log('-importer- filename not provided');
		}
	});
	console.log("-importer- Now watching /server/private/data/dropbox/reportProfiles/ for changes...");


};

