/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 * 
 * 
 *	The role of the watcher is to take an input xcel or json file and 
 * 	copy them to the appropriate places in the private space for processing.
 * 	A main objective is to protect from external manipulation once received.
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
// handle data files	
	fs.watch('./server/public/data/dropbox/', function(event, filename){
		console.log(filename + " just changed and will be copied to private");		
		console.log('event is: ' + event);
		if (event === 'change'){
			if (filename) {
				console.log('filename provided: ' + filename);
				// read the modified file and push to cloner
				var data;
				fs.readFile('./server/public/data/dropbox/' + filename, function (err, data) {
					if (err) {
						throw err;	
					} else {
//						console.log(data);
						cloner(data, './server/private/data/dropbox/' + filename);
					}
				});
			} else {
				console.log('filename not provided');
			}
		}
	});
//	handle profile files
	fs.watch('./server/public/data/dropbox/reportProfiles/', function(event, filename){
		console.log(filename + " just changed and will be copied to private");

		console.log('event is: ' + event);
		if (event === 'change'){
			if (filename) {
				console.log('filename provided: ' + filename);
				// read the modified file and push to cloner
				var profile;
				fs.readFile('./server/public/data/dropbox/reportProfiles/' + filename, function (err, profile) {
					if (err) {
						throw err;	
					} else {
//						console.log(profile);
						cloner(profile, './server/private/data/dropbox/reportProfiles/' + filename);
					}
				});
			} else {
				console.log('filename not provided');
			}
		}

	});
	console.log("Now watching server/public/data/dropbox/ and dropbox/reportProfiles for changes...");

};

