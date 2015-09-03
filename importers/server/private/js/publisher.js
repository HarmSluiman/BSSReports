/*
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
//				console.log(data);
				cloner(data, './server/public/data/viewdata/' + filename);
				}
			});
		  } else {
		    console.log('filename not provided');
		  }


	});
	console.log("Now watching server/private/data/viewdata for changes...");

};

