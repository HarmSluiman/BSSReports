/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 * 
 *	The role of the Transformer is to take the full data set and feed it to each
 * 	report unique data sets
 */


function initCollectionSet (inputArray, index) {
	inputArray[index] = [];	
}
function initSetElement (inputArray, index, value, period){
	inputArray[index] = {value:value, period:period};
}

function copySetByName (input, output, name, profileJSON){
	var i,j,k = 0;
//	iteration through input data set to first matching name
	for (i = 0; i < input.items.length ; i++){
		if (input.items[i].name === name){		
//			copy the period/value pairs to output array
//			skipping the first entry and use the profileLabels versus period number			
			for (j = 1; j < input.items[i].values.length ; j++){
				k = input.items[i].values[j].period;
				initSetElement(
						output,
						j-1,
						input.items[i].values[j].value,
						profileJSON.periodLabels[k]);
			}
//			exit the loop
			break;
		}
	}
}

function produceReportPage( outputPath, profileJSON){
	var reportID = profileJSON.reportID;
	var title = profileJSON.title;
	var description = profileJSON.description;
	var errorMessage = profileJSON.errorMessage;
	var labels = profileJSON.labels;
	var htmlFile = profileJSON.htmlFilePath + reportID + ".html";
	var htmlDataFile = profileJSON.htmlFilePath + reportID + "Data.html";
	var dataFile = profileJSON.dataFilePath + reportID + ".json";
	var yLabel = profileJSON.yLabel;
	var detailedDescription = profileJSON.detailedDescription;


	var htmlHeader =
		"<!DOCTYPE html>\n" +
		"<html>\n" +
		"<head>\n" +
		"<meta name='copyright' content='� Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.' />\n" +
		"<link href='/public/lib/metrics-graphics-2.4.0/dist/metricsgraphics.css' rel='stylesheet' type='text/css'>\n" +
		"<script src='/public/lib/jquery/jquery-1.11.3.min.js'></script>\n" +
		"<script src='/public/lib/d3/d3.min.js' charset='utf-8'></script>\n" +
		"<script src='/public/lib/metrics-graphics-2.4.0/dist/metricsgraphics.min.js'></script>\n" +
		"<script>						\n"+
		"function setMessageArea(input) \n"+
		"{								\n"+
		"	if (input !== '') {							\n"+
		"      document.getElementById('messageArea').innerHTML = '<p>'+input+'</p>'; \n"+
		"	} else {							\n"+	
		"      document.getElementById('messageArea').innerHTML = ''; \n"+
		"	}							\n"+	
		"}								\n"+
		"								\n"+	
		"var showingPage = false;		\n"+
		"function showHide(elementID)	\n"+
		"{								\n"+
		"	if (showingPage){			\n"+
		"		showingPage = false;	\n"+
		"		clearBox(elementID);	\n"+
		"	}							\n"+
		"	else {						\n"+
		"		showingPage = true;		\n"+
		"    document.getElementById(elementID).innerHTML =  \n"+
		"	\"	<input type='button' value='Redraw the graph with your changes' onClick='updateFromTable(ACVChurnAndExpansionTableData)'/> 	\"+	"+
		"   \"  <p>Making changes to this data is temporary and will not impact any other chart. To reset the values to the original state	\"+	"+
		"   \"  simply hide and reshow the data, and then redraw the graph.</p>																\"+	"+
		"   \"  <p>In order to make changes that affect all the graphs you can either resubmit the base data or edit the resolved			\"+	"+
		"   \"  full data set. To do this choose the Full Data Set Used link on the main page, or select <a href='/public/html/reports/dashboard/dataTables/fullAnnualContractData.html'>this link</a>.</p> \"+ "+
		"	\"	<div id='messageArea'></div>	\"+	\n"+
		"	\"	<iframe src='./"+ reportID +"Data.html' height='250' width='100%' />	\" ;\n"+
		"	}    						\n"+
		"								\n"+
		"								\n"+
		"}								\n"+
		"								\n"+
		"function clearBox(elementID)	\n"+
		"{								\n"+
		"    document.getElementById(elementID).innerHTML = \"\";\n"+
		"}								\n"+
		"								\n"+
		"								\n"+
		"function loadGraph(data)								\n"+
		"{								\n"+
		"            MG.data_graphic({\n"+
		"                title: '" + title + "',\n"+
		"                description: '" + description + "',\n"+
		"                error: '" + errorMessage + "',\n"+
		"                data: data,\n"+
		"                // auto resizing\n"+
		"                full_width: 'true',\n"+
		"                height: 300,\n"+
		" 				 area: false , \n" +
		"                //room for labels\n"+
		"                right: 120,\n"+
		"                //room for y axis label\n"+
		"                left: 100,\n"+
		"                target: '#" + reportID + "',\n"+
		"                legend:[" + labels + "],\n"+
		"                x_accessor: 'period',\n"+
		"                y_accessor: 'value' ,\n"+
		"                y_label: '" + yLabel + "'\n"+
		"            });\n"+

		"}								\n"+
		"								\n"+
		"								\n"+
		"function updateFromTable(data){ 										\n"+
		"// index through the table data cells and copy to the array 			\n"+
	 	"var rows = window.frames[window.frames.length - 1].document.getElementById('dataTable').rows;	\n"+		
	    "// iterate through each row in this specific table						\n"+			
	    "// each row is an item in the JSON model								\n"+		
	    "// each cell is a value in the JSON model   							\n"+		
	    "// loop through rows, skip row 1 and labels in column 1				\n"+							
		"var cellData;								\n"+
		"var messageString = '';												\n"+
	    "for(var i = 1, outputi = 0, rowCnt = rows.length; i < rowCnt; i++, outputi++) {	\n"+  						
	 	"	//in each row iterate through the cells											\n"+				
	   	"    for(var j=1, outputj =0,cellCnt = rows[i].children.length; j < cellCnt; j++, outputj++) { 	\n"+														
	   	"     	// period data is reused from prior usage												\n"+		
	    "	    cellData = rows[i].children[j].firstChild.data;						\n"+
		"		if ( !isNaN(cellData)) {						\n"+
	    "	    	data[outputi][outputj].value = cellData;						\n"+
		"		} else {						\n"+
		"			messageString += cellData + ' is not a number. ';					\n"+
		"		}						\n"+
	    "    }																							\n"+			
	    "}							\n"+
	    "setMessageArea(messageString);  							\n"+
		"// refresh the graph 			\n"+
		"loadGraph(data); 				\n"+
		"// save results in case transient data object was input 	\n"+
		"ACVChurnAndExpansionTableData = data;   					\n"+
		"}								\n"+
		"								\n"+
		"								\n"+
		"								\n"+
		"								\n"+
		"								\n"+
		"</script>						\n"+	
		"</head>						\n";
	var fileString = htmlHeader +
	"<body bgcolor='#CED8F6' >\n"+
	"	 <div>\n"+
	"	<div>										 \n"+ 
    "		<input type='button' id='ShowHide' value='Show/Hide Data' onclick='showHide(\"DataTable\")'/> \n"+ 
    "	</div>										\n"+ 
    "	<div id='DataTable'></div> 					\n"+              
	"<br/>\n"+
	"	 <div id='" + reportID + "'></div>\n"+
	"<!-- graph script -->\n"+
	"	 <script>\n"+
	"		var ACVChurnAndExpansionTableData; 							\n" +		
	"        d3.json('/public/data/viewdata/"+ dataFile +"', function(data) {	\n"+
	"            for (var i = 0; i < data.length; i++) { 				\n"+
    "                data[i] = MG.convert.date(data[i], 'period');		\n"+
    "                }													\n"+
    "			loadGraph(data); 										\n"+
    "			ACVChurnAndExpansionTableData = data; 					\n" +
	"        })															\n"+
	"     </script>\n"+
	"<!-- end of graph script  -->               \n"

	;
	if (detailedDescription !== null) {
		if (detailedDescription !== undefined) {
		fileString = fileString +
		"<b>Description</b> \n" +
		"<div id='detailedDescription'></div> \n" +
		"<script> \n"+
		"document.getElementById('detailedDescription').innerHTML = \" <iframe name='Detailed Description' src='"+ detailedDescription +"' width='100%' />\" ;\n" +
		"</script> \n"
		;
		}
	}
	fileString = fileString +
	"<!-- footer -->							\n"+
	"<hr/>										\n"+
	"<table>									\n"+
	"<th width='100%' align='center'>			\n"+
	"&copy; Copyright 2015 by 9250891 CANADA INC.. All rights reserved. This material may not be duplicated without written permission.\n"+
	"</th>										\n"+
	"</table>									\n"+
	"</body>                                     \n"+
	"</html>                                     \n"
	;

	var fs = require('fs');
	var target = outputPath + htmlFile;
//	console.log('-transformerShell- writing html file ' + target);
	fs.writeFile(target, fileString, function (err) {
		if (err) { throw err; } 
//		console.log('-transformerShell- saved');
	});
}
/*
 * produceDataFile
 * produce a json file that can feed the D3 package which means simple nested Arrays
 * also  produce an matching html table containing the data
 */
function produceDataFile (input, outputDataPath, outputHtmlPath, profileJSON) {
	var fs = require('fs');
	var dataFilename = profileJSON.reportID + ".json";
	var dataTarget = outputDataPath + profileJSON.dataFilePath + dataFilename;
	var i, j;	
	// convert to JSON
	var inputJSON = JSON.parse(input);
	// create and initialize output object
	var outputArray = [];
	// metric graphics uses simple unlabeled nested arrays
	// create 1 outputArray collectionSet entry for each line to be charted
	// using keys from report profile
	// blindly copy data sets needed based on names into generic format for metric graphics
	for (var k=0; k<profileJSON.keys.length; k++){
		initCollectionSet(outputArray, k);
		copySetByName(inputJSON, outputArray[k], profileJSON.keys[k], profileJSON);
	}
	// produce html table contents based on generated array
	// one row for each value set
	var htmlDataFile = outputHtmlPath + profileJSON.htmlFilePath + profileJSON.reportID + "Data.html";
	var htmlDataTable = 
		"<div bgcolor='#A9A9F5'> \n" +
		"   <table id='dataTable' style='table-layout: fixed' bgcolor='#F6D8CE' width='100%'  border='1' cellspacing='2' cellpadding='0'> \n";
	
	htmlDataTable = htmlDataTable + "      <tr align='center'> <th> </th>";
	for (i=1; i<profileJSON.periodLabels.length; i++){
		htmlDataTable = htmlDataTable + " <th>" + profileJSON.periodLabels[i] + "</th> ";
	}
	htmlDataTable = htmlDataTable + "</tr> \n";
		
	for (i=0; i<profileJSON.labels.length; i++){
		htmlDataTable = htmlDataTable + "      <tr align='center'> <td>" + profileJSON.labels[i] + "</td> ";
		for (j=0; j<outputArray[i].length; j++){
			htmlDataTable = htmlDataTable + "<td contenteditable='true'>" + outputArray[i][j].value + "</td>";
		}
		htmlDataTable = htmlDataTable + "</tr> \n";
	}
	htmlDataTable = htmlDataTable +
		"   </table> \n"+ 
		"</div>\n";

	// write html Data file 
	// write contents to viewer data source directory
//	console.log('-transformerShell- writing html data file ' + htmlDataFile);
	fs.writeFile(htmlDataFile, htmlDataTable, function (err) {
		if (err) { throw err; } 
//		console.log('-transformerShell- saved');
	});

	// stringify outputJSON 
	var output = JSON.stringify(outputArray, null, 3);
	if (output) {
		// write contents to viewer data source directory
//		console.log('-transformerShell- writing data file ' + dataTarget);
		fs.writeFile(dataTarget, output, function (err) {
			if (err) { throw err; } 
//			console.log('-transformerShell- saved');
		});
	}
}
function processProfile (data, profile, outputHtmlPath, outputDataPath){
	var fs = require('fs');
	console.log("-transformerShell- runing profile: "+ profile);
	var profileData;
	fs.readFile(profile, function (err, profileData) {
		if (err) {
			throw err;	
		} else {
			var profileJSON = JSON.parse(profileData);
			produceDataFile(data, outputDataPath, outputHtmlPath, profileJSON);
			produceReportPage(outputHtmlPath, profileJSON);
		}
	});
	
}
exports.processProfile = processProfile;

exports.watcher = function () {
	var fs = require('fs');
	var filename = './server/private/data/viewdata/fullset/fullAnnualContractInput.json';
	var outputDataPath = './server/public/data/viewdata/';
	var outputHtmlPath = './server/public/html/reports/dashboard/';
	var profilePath = './server/private/data/viewdata/viewProfiles/';
	fs.watch(filename, function(event){
		console.log("new report data files will be published");		
		console.log('event is: ' + event);
		// read the modified file and push to cloner
		var data;
		fs.readFile(filename, function (err, data) {
			if (err) {
				throw err;	
			} else {
//				invoke each registered reporter
//				iterate over profile directory and load the profile before generating
				fs.readdir(profilePath, function (err, fileList) {
					console.log("number of profile files:"+ fileList.length);
					for(var i=0; i < fileList.length; i++ ){
						processProfile(data, profilePath + fileList[i], outputHtmlPath, outputDataPath);
					}
				});	
				// produce html view of full set Data
				var builder = require('./FullAnnualContractInputBuilder.js');
				// write data and html to viewer source directory
				var targetDataTableDir = './server/private/html/dataTables/';
				var outputHtmlData = builder.generateHtmlFromJSON(JSON.parse(data), "http:\/\/localhost:10000\/fullAnnualContract\/");		
//				console.log('writing full set html data file ' + filename);
				fs.writeFile(targetDataTableDir + "fullAnnualContractData.html", outputHtmlData, function (err) {
					if (err) { throw err; } 
//					console.log(' data html saved');
				});


			}
		});
	});
	console.log("-transformerShell- Now watching " +filename+ " for changes...");

};

