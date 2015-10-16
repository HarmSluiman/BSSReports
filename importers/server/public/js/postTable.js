function postTable(path, data) {
	// construct an HTTP request
	var xhr = new XMLHttpRequest();
	var output = JSON.stringify(data);
	xhr.open("POST", path , true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader("Content-length", output.length);
  
	xhr.setRequestHeader("Connection", "close");

	// send the collected data as JSON
	xhr.send("\n"+ output);

	//console.log(xhr);
	xhr.onloadend = function () {
    // done
	};
  
}



