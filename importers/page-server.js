/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 */

// set up Express static http server used in dev environments - nginx used in production
var express = require('express');


var server = express();
server.use(express.static(__dirname + '/server/public'));

var port = 10080;
server.listen(port, function() { 
    console.log('My node server for web pages is listening on port ' + port);
    console.log('the root path is ' + __dirname + '/server/public');  
});










