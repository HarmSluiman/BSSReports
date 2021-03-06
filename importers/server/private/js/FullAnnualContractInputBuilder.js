/*
 * Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.
 * 
 *	The role of the FullAnnulaCOntractBuilder is to take an input json file and 
 * 	convert/merge the data into a ssingle data source that will be processed 
 *  downstream based on the profiles that have been provided for each report.
 *  
 *  Also generate a basic html table to render the raw full data set.
 */
function cloner (input, filename) {

}

function initItem (inputArray, index) {
	inputArray[index] = {name:'' , values:[]};	
}
function initValue (inputArray, index){
	inputArray[index] = {value:'', period:''};
}
/*
 * generateHtmlFromJSON produces a generic html table for 
 * editing and resubmitting the provided table of json data
 */
exports.generateHtmlFromJSON = function (inputJSON, targetURL){
	var htmlDataTable = "";
	// one row for each value set
	htmlDataTable = 
		"<!DOCTYPE html>\n" +
		"<html>\n" +
		"<head>\n" +
		"<meta name='copyright' content='� Copyright 2015 by Harm Sluiman. All rights reserved. This material may not be duplicated without written permission.' />\n" +
		"			\n"+
		"			\n"+
		"<script src='/public/js/postTable.js'>						\n"+
		"														\n"+
		"</script>												\n"+
		"<script>												\n"+
		"	function setMessageArea(input) \n"+
		"	{								\n"+
		"		if (input !== '') {							\n"+
		"      		document.getElementById('messageArea').innerHTML = '<p>'+input+'</p>'; \n"+
		"		} else {							\n"+	
		"      		document.getElementById('messageArea').innerHTML = ''; \n"+
		"		}							\n"+	
		"	}								\n"+
		"								\n"+	
		"	function initItem (inputArray, index) {  			\n"+
		"		inputArray[index] = {name:'n' , values:[]};	  	\n"+
		"	}													\n"+
		"	function initValue (inputArray, index){  			\n"+
		"		inputArray[index] = {value:'v', period:'1'};  	\n"+
		"	}													\n"+
		" 														\n"+
		"   function sendJSON() { 								\n"+  
		"      var outputJSON =	 {								\n"+
		" 		  'label': 'AnnualContractInput',  				\n"+
		"  		  'items': [{									\n"+
		"         'name': 'name',								\n"+
		"         'values': [{'value':'\"v\"', 'period':'\"1\"'}]}]};			\n"+ 
		"	   var cellData;								\n"+
		"	   var messageString = '';												\n"+
		"      var rows = document.getElementById('dataTable').rows;			\n"+
		"      // iterate through each row in this specific table				\n"+
		"      // each row is an item in the JSON model							\n"+
		"      // each cell is a value in the JSON model   						\n"+ 
		"      // loop through rows, skip row 1									\n"+
		"      for(var i = 1, outputi = 0, rowCnt = rows.length; i < rowCnt; i++, outputi++) {  					\n"+
		"         initItem(outputJSON.items,outputi);																\n"+
		"         outputJSON.items[outputi].name = rows[i].firstElementChild.firstChild.data; 						\n"+
        " 		  //column 0 of output is init/start data and ignored in reports but needs to be present			\n"+
		"         initValue(outputJSON.items[outputi].values, 0); 													\n"+
		"		  outputJSON.items[outputi].values[0].period = 0;													\n"+
		"		  outputJSON.items[outputi].values[0].value = 0;													\n"+
		"       																									\n"+
        " 		  //in each row iterate through the cells															\n"+
        "   	  for(var j=1, outputj = 1,cellCnt = rows[i].children.length; j < cellCnt; j++, outputj++) {			\n"+
		"   		 initValue(outputJSON.items[outputi].values, outputj);											\n"+
		"   	     // top row of table hold period values															\n"+
		"    	     outputJSON.items[outputi].values[outputj].period = rows[0].children[j].firstChild.data;		\n"+
	    "	         cellData = rows[i].children[j].firstChild.data;												\n"+
		"		     if ( !isNaN(cellData)) {																		\n"+
	    "	    	    outputJSON.items[outputi].values[outputj].value = cellData;									\n"+
		"		     } else {																						\n"+
		"			    messageString += cellData + ' is not a number. ';											\n"+
		"		     }																								\n"+
		"         }																									\n"+
		"      }																									\n"+
	    "	   setMessageArea(messageString);  																		\n"+
		"	   // post the valid data and trigger a refresh of the data files and profiled reports.  				\n"+
		"      // if there was no bad data 																			\n"+
		"      if (messageString === '') { 																			\n"+
		"      // postTable('http://localhost:10000/fullAnnualContract/', JSON.stringify(outputJSON, null, 3));  	\n"+
		"      	  postTable('"+ targetURL+ "', outputJSON);  							\n"+
		"      } 																									\n"+
		"       																									\n"+
		"	     			\n"+
		"   }				\n"+
		"</script> 			\n"+		
		"</head>			\n"+
		"					\n"+
		"<p>Submitting updated data from here will feed your raw input and regenerate \n"+
		"the reports without any derived calculations. To provide new base data and allow \n"+
		"derived calculations, please submit new base data <a href='/public/html/NotImplementedYet.html'> here</a>.</p>\n"+
		"							\n"+
		"<button					\n"+
		"	onclick='sendJSON()'> 	\n"+
		"	submit the new data		\n"+
		"</button>					\n"+
		"<div id='messageArea'></div> \n"+
		"<body bgcolor='#A9A9F5'> \n" +
		"   <table id='dataTable' style='table-layout: fixed' bgcolor='#F6D8CE' width='100%'  border='1' cellspacing='2' cellpadding='0'> \n";
	
	htmlDataTable = htmlDataTable + "      <tr align='center'> <th width='220'> </th>";
	// use first object as template for all columns
	var i;
	var j;
	var period;
	for (i=1; i<inputJSON.items[0].values.length; i++){
		// if the period is not provided then use sequential numbers
		if (inputJSON.items[0].values[i].period === undefined) {
			period = i;
		}else{
			period = inputJSON.items[0].values[i].period;
		}
		htmlDataTable = htmlDataTable + " <th>" + period + "</th> ";
	}
	htmlDataTable = htmlDataTable + "</tr> \n";
		
	for (i=0; i<inputJSON.items.length; i++){
		htmlDataTable = htmlDataTable + "      <tr > <td align='left'>" + inputJSON.items[i].name + "</td> ";
		for (j=1; j<inputJSON.items[i].values.length; j++){
			htmlDataTable = htmlDataTable + "<td bgcolor='#CED8F6' contenteditable='true'>" + inputJSON.items[i].values[j].value + "</td>";
		}
		htmlDataTable = htmlDataTable + "</tr> \n";
	}
	htmlDataTable = htmlDataTable +
		"   </table> \n"+ 
		"<!-- footer --> \n"+
		"	<hr/> \n"+
		"	<table> \n"+
		"		<th width='100%' align='center'> \n"+
		"			&copy; Copyright 2015 by 9250891 CANADA INC.. All rights reserved. This material may not be duplicated without written permission. \n"+
		"		</th> \n"+
		"	</table> \n"+
		"</body>\n";
	
	return htmlDataTable;
};

/*
 * build
 * based on the input data this function does the calculations and expansion to create the full data set 
 * as used in the xls on the forEnterepreneurs.com site
 * in addition it will generate an html page with a table showing the full set of data
 */
exports.build = function (inputJSON, outputJSON) {
	var inputBookings = 0;
	var outputBookings = 0;
	var outputAvgACV = 1;
	var inputAvgContractTerm = 1;
	var outputAvgContractTerm = 2;
	var inputAvgMonthUpfront = 2;
	var outputAvgMonthUpfront = 3;
	var outputARPAAvgMRR = 4;
	var outputARPAAcrossInstall = 5;	
	var inputNewACV = 3;
	var outputNewACV = 6;
	var outputChurnedACV = 7;
	var outputExpansionACV = 8;
	var outputNetNewACV = 9;
	var outputStartingARR = 10;
	var inputEndingARR = 4;
	var outputEndingARR = 11;
	var inputTotalNumCustomers = 5;
	var outputTotalNumCustomers = 12;
	var inputNumNewCustomers = 6;
	var outputNumNewCustomers = 13;
	var inputNumChurnCustomers = 7;
	var outputNumChurnCustomers = 14;
	var outputNetNewCustomers = 15;
	var outputPercentCustomerChurn = 16;
	var inputPercentACVChurn = 8;
	var outputPercentACVChurn = 17;
	var inputPercentACVExpansion = 9;
	var outputPercentACVExpansion = 18;
	var outputPercentNetACVChurn = 19;
	var inputCustomerEngagementScore = 10;
	var outputCustomerEngagementScore = 20;
	var inputNetPromoterScore = 11;
	var outputNetPromoterScore = 21;
	var outputLTV = 22;
	var outputCAC = 23;
	var outputLTVToCACRatio = 24;
	var outputMonthsToRecoverCAC = 25;
	var inputInvoiced = 12;
	var outputInvoiced = 26;
	var outputRevenue = 27;
	var outputCOGS = 28;
	var outputGrossMargin = 29;
	var inputGrossMarginPercent = 13;
	var outputGrossMarginPercent = 30;
	var outputTotalExpenses = 31;
	var inputSalesAndMarketing = 14;
	var outputSalesAndMarketing = 32;
	var inputRnD = 15;
	var outputRnD = 33;
	var inputGeneralAndAdmin = 16;
	var outputGeneralAndAdmin = 34;
	var outputEBITDA = 35;
	var outputBillingBasedPnL = 36;
	var outputRawLeadsEnquiries = 37;
	var inputConversionRawLeadsToMQLs = 17;
	var outputConversionRawLeadsToMQLs = 38;
	var outputOpportunities = 39;
	var inputConversionOppToWin = 18;
	var outputConversionOppToWin = 40;
	var inputWinLossRatio = 19;
	var outputWinLossRatio = 41;
	var inputNumFTESalesRep = 20;
	var outputNumFTESalesRep = 42;
	var inputQuotaPerRep = 21;
	var outputQuotaPerRep = 43;
	var outputSalesCapacity = 44;
	var inputCoverageRatio = 22;
	var outputCoverageRatio = 45;
	var outputProductivityPerFTE = 46;
	
	var C20, C23, D6, D7, D8, D9, D10, D11, D14, D15, D16, D17, D19, D20, 
		D23, D24, D25, D26, D28, D29, D30, D31, D33, D34, D36, D37,
		D40, D41, D42 ,D43, D48, D49, D50, D51, D52, D54, D55, D56, D57,
		D59, D60, D64, D65, D66, D70, D71, D72, D73, D74, D77, D78, D79, D80, D82;
	
	if (inputJSON) {
		console.log("-FullAnnualContractInputBuilder- Building full AnnualContractInput.");
		// create JSON output structure
		var i;
		
		outputJSON.label = inputJSON.label;
		// Copy Bookings
		initItem(outputJSON.items, outputBookings);
		outputJSON.items[outputBookings].name = "Bookings";
		for (i = 0; i < inputJSON.items[inputBookings].values.length ; i++){
			initValue(outputJSON.items[outputBookings].values, i);
			outputJSON.items[outputBookings].values[i].value = inputJSON.items[inputBookings].values[i].value;
			outputJSON.items[outputBookings].values[i].period = i;
		}
		//Add Average ACV (new contracts)
		initItem(outputJSON.items, outputAvgACV);
		outputJSON.items[outputAvgACV].name = "AverageACV";
		for (i = 0; i < inputJSON.items[inputBookings].values.length ; i++){
			initValue(outputJSON.items[outputAvgACV].values, i);
			outputJSON.items[outputAvgACV].values[i].value = Math.round(inputJSON.items[inputBookings].values[i].value / inputJSON.items[inputNumNewCustomers].values[i].value *1000);			
			outputJSON.items[outputAvgACV].values[i].period = i;
		}
		// Copy Average Contract Term
		initItem(outputJSON.items, outputAvgContractTerm);
		outputJSON.items[outputAvgContractTerm].name = "AverageContractTerm";
		for (i = 0; i < inputJSON.items[inputAvgContractTerm].values.length ; i++){
			initValue(outputJSON.items[outputAvgContractTerm].values, i);
			outputJSON.items[outputAvgContractTerm].values[i].value = inputJSON.items[inputAvgContractTerm].values[i].value;
			outputJSON.items[outputAvgContractTerm].values[i].period = i;
		}
		// Copy Average Months Paid Upfront
		initItem(outputJSON.items, outputAvgMonthUpfront);
		outputJSON.items[outputAvgMonthUpfront].name = "AverageMonthUpfront";
		for (i = 0; i < inputJSON.items[inputAvgMonthUpfront].values.length ; i++){
			initValue(outputJSON.items[outputAvgMonthUpfront].values, i);
			outputJSON.items[outputAvgMonthUpfront].values[i].value = inputJSON.items[inputAvgMonthUpfront].values[i].value;
			outputJSON.items[outputAvgMonthUpfront].values[i].period = i;
		}
		// Add ARPA - Avg MRR (for new Custs)
		initItem(outputJSON.items, outputARPAAvgMRR);
		outputJSON.items[outputARPAAvgMRR].name = "ARPAAverageMRR";
		for (i = 0; i < inputJSON.items[0].values.length ; i++){
			initValue(outputJSON.items[outputARPAAvgMRR].values, i);
			outputJSON.items[outputARPAAvgMRR].values[i].value = Math.round(outputJSON.items[outputAvgACV].values[i].value / 12*10)/10;			
			outputJSON.items[outputARPAAvgMRR].values[i].period = i;
		}
		// Add ARPA - across installed base
		// as well as pre-req s
		//      StartingARR
		//		EndingARR
		//		TotalNumCustomers
		//		ChurnedACV
		//		ExpansionACV
		//		NetNewACV
		//      NetNewCustomers
		//		PercentACVChurn
		//		PercentACVExpansion
		initItem(outputJSON.items, outputARPAAcrossInstall);
		outputJSON.items[outputARPAAcrossInstall].name = "ARPAAcrossInstall";
		//set first field value
		initValue(outputJSON.items[outputARPAAcrossInstall].values, 0);
		outputJSON.items[outputARPAAcrossInstall].values[0].value = 0;
		outputJSON.items[outputARPAAcrossInstall].values[0].period = 0;
		
		// set pre-req data and seed it
		initItem(outputJSON.items, outputStartingARR);
		outputJSON.items[outputStartingARR].name = "StartingArr";
		initValue(outputJSON.items[outputStartingARR].values, 0);
		outputJSON.items[outputStartingARR].values[0].value = 0;
		outputJSON.items[outputStartingARR].values[0].period = 0;
		
		initItem(outputJSON.items, outputEndingARR);
		outputJSON.items[outputEndingARR].name = "EndingArr";
		initValue(outputJSON.items[outputEndingARR].values, 0);
		outputJSON.items[outputEndingARR].values[0].value = inputJSON.items[inputEndingARR].values[0].value;
		outputJSON.items[outputEndingARR].values[0].period = 0;
		
		initItem(outputJSON.items, outputTotalNumCustomers);
		outputJSON.items[outputTotalNumCustomers].name = "TotalNumCustomers";
		initValue(outputJSON.items[outputTotalNumCustomers].values, 0);
		outputJSON.items[outputTotalNumCustomers].values[0].value = inputJSON.items[inputTotalNumCustomers].values[0].value;
		outputJSON.items[outputTotalNumCustomers].values[0].period = 0;
		
		initItem(outputJSON.items, outputChurnedACV);
		outputJSON.items[outputChurnedACV].name = "ChurnACV";
		initValue(outputJSON.items[outputChurnedACV].values, 0);
		outputJSON.items[outputChurnedACV].values[0].period = 0;
		
		initItem(outputJSON.items, outputExpansionACV);
		outputJSON.items[outputExpansionACV].name = "ExpansionACV";
		initValue(outputJSON.items[outputExpansionACV].values, 0);
		outputJSON.items[outputExpansionACV].values[0].period = 0;
		
		initItem(outputJSON.items, outputNetNewACV);
		outputJSON.items[outputNetNewACV].name = "NetNewACV";
		initValue(outputJSON.items[outputNetNewACV].values, 0);
		outputJSON.items[outputNetNewACV].values[0].period = 0;
		
		initItem(outputJSON.items, outputNumNewCustomers);
		outputJSON.items[outputNumNewCustomers].name = "NumNewCustomers";
		initValue(outputJSON.items[outputNumNewCustomers].values, 0);
		outputJSON.items[outputNumNewCustomers].values[0].period = 0;
		
		initItem(outputJSON.items, outputNumChurnCustomers);
		outputJSON.items[outputNumChurnCustomers].name = "NumChurnCustomers";
		initValue(outputJSON.items[outputNumChurnCustomers].values, 0);
		outputJSON.items[outputNumChurnCustomers].values[0].period = 0;
		
		initItem(outputJSON.items, outputNetNewCustomers);
		outputJSON.items[outputNetNewCustomers].name = "NetNewCustomers";
		initValue(outputJSON.items[outputNetNewCustomers].values, 0);
		outputJSON.items[outputNetNewCustomers].values[0].period = 0;
		
		initItem(outputJSON.items, outputPercentACVChurn);
		outputJSON.items[outputPercentACVChurn].name = "PercentACVChurn";
		initValue(outputJSON.items[outputPercentACVChurn].values, 0);
		outputJSON.items[outputPercentACVChurn].values[0].period = 0;
		
		initItem(outputJSON.items, outputPercentACVExpansion);
		outputJSON.items[outputPercentACVExpansion].name = "PercentACVExpansion";
		initValue(outputJSON.items[outputPercentACVExpansion].values, 0);
		outputJSON.items[outputPercentACVExpansion].values[0].period = 0;

		for (i = 1; i < inputJSON.items[0].values.length ; i++){
			// use xcel cell number to decypher 
			D29 = inputJSON.items[inputPercentACVChurn].values[i].value;
			D30 = inputJSON.items[inputPercentACVExpansion].values[i].value;
			D14 = inputJSON.items[inputNewACV].values[i].value;
			C20 = outputJSON.items[outputEndingARR].values[i-1].value;
			C23 = outputJSON.items[outputTotalNumCustomers].values[i-1].value;
			D24 = inputJSON.items[inputNumNewCustomers].values[i].value;
		  	D25 = inputJSON.items[inputNumChurnCustomers].values[i].value;	
		    D26 = D24 + D25;
			D15 = -D29/100 * C20;
		  	D16 = D30/100 * C20;
			D17 = D14 + D15 + D16;
		    D20 = C20 + D17;
			D23 = C23 + D26;
			var result = (D20/12)/D23*1000;	
			//console.log("D29:"+D29+" D30:"+D30+" D14:"+D14+" C20:"+C20+" C23:"+C23+" D26:"+D26+" D15:"+D15+" D16:"+D16+" D17:"+D17+" D20:"+D20+" D23:"+D23);
			//console.log("result = "+result);
			initValue(outputJSON.items[outputARPAAcrossInstall].values, i);
			outputJSON.items[outputARPAAcrossInstall].values[i].value = Math.round(result*10)/10;	
			outputJSON.items[outputARPAAcrossInstall].values[i].period = i;
			// set EndingARR in advance of next iteration
			initValue(outputJSON.items[outputEndingARR].values, i);
			outputJSON.items[outputEndingARR].values[i].value = Math.round(D20);
			outputJSON.items[outputEndingARR].values[i].period = i;
			// set total number of customers in advance of next iteration
			initValue(outputJSON.items[outputStartingARR].values, i);
			outputJSON.items[outputStartingARR].values[i].value = outputJSON.items[outputEndingARR].values[i-1].value;
			outputJSON.items[outputStartingARR].values[i].period = i;
			initValue(outputJSON.items[outputTotalNumCustomers].values, i);
			outputJSON.items[outputTotalNumCustomers].values[i].value = Math.round(D23*10)/10;
			outputJSON.items[outputTotalNumCustomers].values[i].period = i;
			initValue(outputJSON.items[outputChurnedACV].values, i);
			outputJSON.items[outputChurnedACV].values[i].value = Math.round(D15*10)/10;
			outputJSON.items[outputChurnedACV].values[i].period = i;
			initValue(outputJSON.items[outputExpansionACV].values, i);
			outputJSON.items[outputExpansionACV].values[i].value = Math.round(D16*10)/10;
			outputJSON.items[outputExpansionACV].values[i].period = i;
			initValue(outputJSON.items[outputNetNewACV].values, i);
			outputJSON.items[outputNetNewACV].values[i].value = Math.round(D17*10)/10;
			outputJSON.items[outputNetNewACV].values[i].period = i;
			initValue(outputJSON.items[outputNetNewCustomers].values, i);
			outputJSON.items[outputNetNewCustomers].values[i].value = Math.round(D26*10)/10;
			outputJSON.items[outputNetNewCustomers].values[i].period = i;
			initValue(outputJSON.items[outputNumNewCustomers].values, i);
			outputJSON.items[outputNumNewCustomers].values[i].value = Math.round(D24*10)/10;
			outputJSON.items[outputNumNewCustomers].values[i].period = i;
			initValue(outputJSON.items[outputNumChurnCustomers].values, i);
			outputJSON.items[outputNumChurnCustomers].values[i].value = Math.round(D25*10)/10;
			outputJSON.items[outputNumChurnCustomers].values[i].period = i;
			initValue(outputJSON.items[outputPercentACVChurn].values, i);
			outputJSON.items[outputPercentACVChurn].values[i].value = D29;
			outputJSON.items[outputPercentACVChurn].values[i].period = i;
			initValue(outputJSON.items[outputPercentACVExpansion].values, i);
			outputJSON.items[outputPercentACVExpansion].values[i].value = D30;
			outputJSON.items[outputPercentACVExpansion].values[i].period = i;
			}
		// Copy NewACV
		initItem(outputJSON.items, outputNewACV);
		outputJSON.items[outputNewACV].name = "NewACV";
		for (i = 0; i < inputJSON.items[inputNewACV].values.length ; i++){
			initValue(outputJSON.items[outputNewACV].values, i);
			outputJSON.items[outputNewACV].values[i].value = 
				inputJSON.items[inputNewACV].values[i].value;
			outputJSON.items[outputNewACV].values[i].period = i;
		}
		// Copy PercentACVChurn
		initItem(outputJSON.items, outputPercentACVChurn);
		outputJSON.items[outputPercentACVChurn].name = "PercentACVChurn";
		for (i = 0; i < inputJSON.items[inputPercentACVChurn].values.length ; i++){
			initValue(outputJSON.items[outputPercentACVChurn].values, i);
			outputJSON.items[outputPercentACVChurn].values[i].value = 
				inputJSON.items[inputPercentACVChurn].values[i].value;
			outputJSON.items[outputPercentACVChurn].values[i].period = i;
		}
		// Set PercentCustomerChurn
		initItem(outputJSON.items, outputPercentCustomerChurn);
		outputJSON.items[outputPercentCustomerChurn].name = "PercentCustomerChurn";
		initValue(outputJSON.items[outputPercentCustomerChurn].values, 0);
		outputJSON.items[outputPercentCustomerChurn].values[0].value = 0;
		outputJSON.items[outputPercentCustomerChurn].values[0].period = 0;
		for (i = 1; i < outputJSON.items[outputTotalNumCustomers].values.length ; i++){
			initValue(outputJSON.items[outputPercentCustomerChurn].values, i);
			outputJSON.items[outputPercentCustomerChurn].values[i].value = 
				Math.round((-outputJSON.items[outputNumChurnCustomers].values[i].value /
						outputJSON.items[outputTotalNumCustomers].values[i-1].value)*10000)/100;
			outputJSON.items[outputPercentCustomerChurn].values[i].period = i;
		}
		// Set PercentNetACVChurn (-D15-D16)/D19
		initItem(outputJSON.items, outputPercentNetACVChurn);
		outputJSON.items[outputPercentNetACVChurn].name = "PercentNetACVChurn";
		initValue(outputJSON.items[outputPercentNetACVChurn].values, 0);
		outputJSON.items[outputPercentNetACVChurn].values[0].value = 0;
		outputJSON.items[outputPercentNetACVChurn].values[0].period = 0;
		for (i = 1; i < outputJSON.items[outputStartingARR].values.length ; i++){
			D15 = outputJSON.items[outputChurnedACV].values[i].value;
			D16 = outputJSON.items[outputExpansionACV].values[i].value;
			D19 = outputJSON.items[outputStartingARR].values[i].value;
			initValue(outputJSON.items[outputPercentNetACVChurn].values, i);
			outputJSON.items[outputPercentNetACVChurn].values[i].value = 
				Math.round((-D15 - D16 ) / D19 * 1000)/10;
			outputJSON.items[outputPercentNetACVChurn].values[i].period = i;
		}
		// Copy CustomerEngagementScore
		initItem(outputJSON.items, outputCustomerEngagementScore);
		outputJSON.items[outputCustomerEngagementScore].name = "CustomerEngagementScore";
		for (i = 0; i < inputJSON.items[inputCustomerEngagementScore].values.length ; i++){
			initValue(outputJSON.items[outputCustomerEngagementScore].values, i);
			outputJSON.items[outputCustomerEngagementScore].values[i].value = 
				inputJSON.items[inputCustomerEngagementScore].values[i].value;
			outputJSON.items[outputCustomerEngagementScore].values[i].period = i;
		}
		// Copy NetPromoterScore
		initItem(outputJSON.items, outputNetPromoterScore);
		outputJSON.items[outputNetPromoterScore].name = "NetPromoterScore";
		for (i = 0; i < inputJSON.items[inputNetPromoterScore].values.length ; i++){
			initValue(outputJSON.items[outputNetPromoterScore].values, i);
			outputJSON.items[outputNetPromoterScore].values[i].value = 
				inputJSON.items[inputNetPromoterScore].values[i].value;
			outputJSON.items[outputNetPromoterScore].values[i].period = i;
		}
		// Set LTV D10*D52/D29
		initItem(outputJSON.items, outputLTV);
		outputJSON.items[outputLTV].name = "LTV";
		initValue(outputJSON.items[outputLTV].values, 0);
		outputJSON.items[outputLTV].values[0].value = 0;
		outputJSON.items[outputLTV].values[0].period = 0;
		for (i = 1; i < inputJSON.items[inputPercentACVChurn].values.length ; i++){
			D10 = outputJSON.items[outputARPAAvgMRR].values[i].value;
			D52 = inputJSON.items[inputGrossMarginPercent].values[i].value/100;
			D29 = inputJSON.items[inputPercentACVChurn].values[i].value/100;
			initValue(outputJSON.items[outputLTV].values, i);
			outputJSON.items[outputLTV].values[i].value = Math.round(D10*D52/D29);	
			outputJSON.items[outputLTV].values[i].period = i;
		}
		// Set CAC D55/D24*1000
		initItem(outputJSON.items, outputCAC);
		initValue(outputJSON.items[outputCAC].values, 0);
		outputJSON.items[outputCAC].values[0].value = 0;
		outputJSON.items[outputCAC].values[0].period = 0;
		outputJSON.items[outputCAC].name = "CAC";
		for (i = 1; i < outputJSON.items[outputNumNewCustomers].values.length ; i++){
			D55 = inputJSON.items[inputSalesAndMarketing].values[i].value;
			D24 = outputJSON.items[outputNumNewCustomers].values[i].value;
			initValue(outputJSON.items[outputCAC].values, i);
			outputJSON.items[outputCAC].values[i].value = Math.round(D55/D24*1000);	
			outputJSON.items[outputCAC].values[i].period = i;
		}
		// Set LTV to CAC Ratio D40/D41
		initItem(outputJSON.items, outputLTVToCACRatio);
		initValue(outputJSON.items[outputLTVToCACRatio].values, 0);
		outputJSON.items[outputLTVToCACRatio].values[0].value = 0;
		outputJSON.items[outputLTVToCACRatio].values[0].period = 0;
		outputJSON.items[outputLTVToCACRatio].name = "LTVToCACRatio";
		for (i = 1; i < outputJSON.items[outputNumNewCustomers].values.length ; i++){
			D40 = outputJSON.items[outputLTV].values[i].value;
			D41 = outputJSON.items[outputCAC].values[i].value;
			initValue(outputJSON.items[outputLTVToCACRatio].values, i);
			outputJSON.items[outputLTVToCACRatio].values[i].value = Math.round(D40/D41*10)/10;
			outputJSON.items[outputLTVToCACRatio].values[i].period = i;
		}
		// Set MonthsToRecoverCAC D41/(D10*D52)
		initItem(outputJSON.items, outputMonthsToRecoverCAC);
		initValue(outputJSON.items[outputMonthsToRecoverCAC].values, 0);
		outputJSON.items[outputMonthsToRecoverCAC].values[0].value = 0;	
		outputJSON.items[outputMonthsToRecoverCAC].values[0].period = 0;
		outputJSON.items[outputMonthsToRecoverCAC].name = "MonthsToRecoverCAC";
		for (i = 1; i < inputJSON.items[inputGrossMarginPercent].values.length ; i++){
			D10 = outputJSON.items[outputARPAAvgMRR].values[i].value;
			D41 = outputJSON.items[outputCAC].values[i].value;
			D52 = inputJSON.items[inputGrossMarginPercent].values[i].value;
			initValue(outputJSON.items[outputMonthsToRecoverCAC].values, i);
			outputJSON.items[outputMonthsToRecoverCAC].values[i].value = Math.round(D41/(D10*D52/100));	
			outputJSON.items[outputMonthsToRecoverCAC].values[i].period = i;
		}
// Summary Financial Metrics in $000's		
		// Copy Invoiced
		initItem(outputJSON.items, outputInvoiced);
		outputJSON.items[outputInvoiced].name = "Invoiced";
		for (i = 0; i < inputJSON.items[inputInvoiced].values.length ; i++){
			initValue(outputJSON.items[outputInvoiced].values, i);
			outputJSON.items[outputInvoiced].values[i].value = 
				inputJSON.items[inputInvoiced].values[i].value;
			outputJSON.items[outputInvoiced].values[i].period = i;
		}
		// Set Revenue D20
		initItem(outputJSON.items, outputRevenue);
		initValue(outputJSON.items[outputRevenue].values, 0);
		outputJSON.items[outputRevenue].values[0].value = 0;
		outputJSON.items[outputRevenue].values[0].period = 0;
		outputJSON.items[outputRevenue].name = "Revenue";
		for (i = 1; i < outputJSON.items[outputEndingARR].values.length ; i++){
			D20 = outputJSON.items[outputEndingARR].values[i].value;
			initValue(outputJSON.items[outputRevenue].values, i);
			outputJSON.items[outputRevenue].values[i].value = D20;
			outputJSON.items[outputRevenue].values[i].period = i;
		}
		// Set COGS (1-D52)*D49
		initItem(outputJSON.items, outputCOGS);
		initValue(outputJSON.items[outputCOGS].values, 0);
		outputJSON.items[outputCOGS].values[0].value = 0;
		outputJSON.items[outputCOGS].values[0].period = 0;
		outputJSON.items[outputCOGS].name = "COGS";
		for (i = 1; i < outputJSON.items[outputRevenue].values.length ; i++){
			D49 = outputJSON.items[outputRevenue].values[i].value;
			D52 = inputJSON.items[inputGrossMarginPercent].values[i].value;
			initValue(outputJSON.items[outputCOGS].values, i);
			outputJSON.items[outputCOGS].values[i].value = Math.round((1-(D52/100))*D49);
			outputJSON.items[outputCOGS].values[i].period = i;
		}
		// Set Gross Margin D49-D50
		initItem(outputJSON.items, outputGrossMargin);
		initValue(outputJSON.items[outputGrossMargin].values, 0);
		outputJSON.items[outputGrossMargin].values[0].value = 0;
		outputJSON.items[outputGrossMargin].values[0].period = 0;
		outputJSON.items[outputGrossMargin].name = "GrossMargin";
		for (i = 1; i < outputJSON.items[outputRevenue].values.length ; i++){
			D49 = outputJSON.items[outputRevenue].values[i].value;
			D50 = outputJSON.items[outputCOGS].values[i].value;
			initValue(outputJSON.items[outputGrossMargin].values, i);
			outputJSON.items[outputGrossMargin].values[i].value = D49 - D50;
			outputJSON.items[outputGrossMargin].values[i].period = i;
		}
		// Copy Gross Margin Percent
		initItem(outputJSON.items, outputGrossMarginPercent);
		outputJSON.items[outputGrossMarginPercent].name = "GrossMarginPercent";
		for (i = 0; i < inputJSON.items[inputGrossMarginPercent].values.length ; i++){
			initValue(outputJSON.items[outputGrossMarginPercent].values, i);
			outputJSON.items[outputGrossMarginPercent].values[i].value = 
				inputJSON.items[inputGrossMarginPercent].values[i].value;
			outputJSON.items[outputGrossMarginPercent].values[i].period = i;
		}
		// Set Total Expenses D55 + D56 + D57
		initItem(outputJSON.items, outputTotalExpenses);
		initValue(outputJSON.items[outputTotalExpenses].values, 0);
		outputJSON.items[outputTotalExpenses].values[0].value = 0;	
		outputJSON.items[outputTotalExpenses].values[0].period = 0;
		outputJSON.items[outputTotalExpenses].name = "TotalExpenses";
		for (i = 1; i < inputJSON.items[inputRnD].values.length ; i++){
			D55 = inputJSON.items[inputSalesAndMarketing].values[i].value;
			D56 = inputJSON.items[inputRnD].values[i].value;
			D57 = inputJSON.items[inputGeneralAndAdmin].values[i].value;
			initValue(outputJSON.items[outputTotalExpenses].values, i);
			outputJSON.items[outputTotalExpenses].values[i].value = D55 + D56 + D57;
			outputJSON.items[outputTotalExpenses].values[i].period = i;
		}
		// Copy Sales And Marketing
		initItem(outputJSON.items, outputSalesAndMarketing);
		outputJSON.items[outputSalesAndMarketing].name = "SalesAndMarketing";
		for (i = 0; i < inputJSON.items[inputSalesAndMarketing].values.length ; i++){
			initValue(outputJSON.items[outputSalesAndMarketing].values, i);
			outputJSON.items[outputSalesAndMarketing].values[i].value = 
				inputJSON.items[inputSalesAndMarketing].values[i].value;
			outputJSON.items[outputSalesAndMarketing].values[i].period = i;
		}
		// Copy Research and Development
		initItem(outputJSON.items, outputRnD);
		outputJSON.items[outputRnD].name = "RnD";
		for (i = 0; i < inputJSON.items[inputRnD].values.length ; i++){
			initValue(outputJSON.items[outputRnD].values, i);
			outputJSON.items[outputRnD].values[i].value = 
				inputJSON.items[inputRnD].values[i].value;
			outputJSON.items[outputRnD].values[i].period = i;
		}
		// Copy General and Administrative
		initItem(outputJSON.items, outputGeneralAndAdmin);
		outputJSON.items[outputGeneralAndAdmin].name = "GeneralAndAdmin";
		for (i = 0; i < inputJSON.items[inputGeneralAndAdmin].values.length ; i++){
			initValue(outputJSON.items[outputGeneralAndAdmin].values, i);
			outputJSON.items[outputGeneralAndAdmin].values[i].value = 
				inputJSON.items[inputGeneralAndAdmin].values[i].value;
			outputJSON.items[outputGeneralAndAdmin].values[i].period = i;
		}
// EBITDA
		// Set EBITDA D51-D54
		initItem(outputJSON.items, outputEBITDA);
		initValue(outputJSON.items[outputEBITDA].values, 0);
		outputJSON.items[outputEBITDA].values[0].value = 0;	
		outputJSON.items[outputEBITDA].values[0].period = 0;
		outputJSON.items[outputEBITDA].name = "EBITDA";
		for (i = 1; i < inputJSON.items[inputRnD].values.length ; i++){
			D51 = outputJSON.items[outputGrossMargin].values[i].value;
			D54 = outputJSON.items[outputTotalExpenses].values[i].value;
			initValue(outputJSON.items[outputEBITDA].values, i);
			outputJSON.items[outputEBITDA].values[i].value = D51-D54;
			outputJSON.items[outputEBITDA].values[i].period = i;
		}
		// Set Billing Based Operating Profit and Loss D48*D52-D54
		initItem(outputJSON.items, outputBillingBasedPnL);
		initValue(outputJSON.items[outputBillingBasedPnL].values, 0);
		outputJSON.items[outputBillingBasedPnL].values[0].value = 0;
		outputJSON.items[outputBillingBasedPnL].values[0].period = 0;
		outputJSON.items[outputBillingBasedPnL].name = "BillingBasedPnL";
		for (i = 1; i < inputJSON.items[inputRnD].values.length ; i++){
			D48 = outputJSON.items[outputInvoiced].values[i].value;
			D52 = outputJSON.items[outputGrossMarginPercent].values[i].value;
			D54 = outputJSON.items[outputTotalExpenses].values[i].value;
			initValue(outputJSON.items[outputBillingBasedPnL].values, i);
			outputJSON.items[outputBillingBasedPnL].values[i].value = Math.round((D48*D52/100)-D54);	
			outputJSON.items[outputBillingBasedPnL].values[i].period = i;
		}
// Cash and Deferred Revenue section of xls is not defined/provided as of June 25/2015

// Funnel Metrics
		// initialize items in order
		initItem(outputJSON.items, outputRawLeadsEnquiries);
		outputJSON.items[outputRawLeadsEnquiries].name = "RawLeadsEnquiries";

		initItem(outputJSON.items, outputConversionRawLeadsToMQLs);
		outputJSON.items[outputConversionRawLeadsToMQLs].name = "ConversionRawLeadsToMQLs";

		initItem(outputJSON.items, outputOpportunities);
		outputJSON.items[outputOpportunities].name = "Opportunities";
		
		initItem(outputJSON.items, outputConversionOppToWin);
		outputJSON.items[outputConversionOppToWin].name = "ConversionOppToWin";

		initItem(outputJSON.items, outputWinLossRatio);
		outputJSON.items[outputWinLossRatio].name = "WinToLossRatio";

		// Copy Conversion Raw Leads to MQLs
		for (i = 0; i < inputJSON.items[inputConversionRawLeadsToMQLs].values.length ; i++){
			initValue(outputJSON.items[outputConversionRawLeadsToMQLs].values, i);
			outputJSON.items[outputConversionRawLeadsToMQLs].values[i].value = 
				inputJSON.items[inputConversionRawLeadsToMQLs].values[i].value;
			outputJSON.items[outputConversionRawLeadsToMQLs].values[i].period = i;
		}
		// Copy Conversion Opportunities to Wins
		for (i = 0; i < inputJSON.items[inputConversionOppToWin].values.length ; i++){
			initValue(outputJSON.items[outputConversionOppToWin].values, i);
			outputJSON.items[outputConversionOppToWin].values[i].value = 
				inputJSON.items[inputConversionOppToWin].values[i].value;
			outputJSON.items[outputConversionOppToWin].values[i].period = i;
		}
		// Copy Win Loss Ratio
		for (i = 0; i < inputJSON.items[inputWinLossRatio].values.length ; i++){
			initValue(outputJSON.items[outputWinLossRatio].values, i);
			outputJSON.items[outputWinLossRatio].values[i].value = 
				inputJSON.items[inputWinLossRatio].values[i].value;
			outputJSON.items[outputWinLossRatio].values[i].period = i;
		}
		// Set Opportunities  D24/D73
		initValue(outputJSON.items[outputOpportunities].values, 0);
		outputJSON.items[outputOpportunities].values[0].value = 0;	
		outputJSON.items[outputOpportunities].values[0].period = 0;
		for (i = 1; i < outputJSON.items[outputConversionOppToWin].values.length ; i++){
			D24 = outputJSON.items[outputNumNewCustomers].values[i].value;
			D73 = outputJSON.items[outputConversionOppToWin].values[i].value;
			initValue(outputJSON.items[outputOpportunities].values, i);
			outputJSON.items[outputOpportunities].values[i].value = Math.round(D24/(D73/100));
			outputJSON.items[outputOpportunities].values[i].period = i;
		}
		// Set Raw Leads Enquires D72/D71
		initValue(outputJSON.items[outputRawLeadsEnquiries].values, 0);
		outputJSON.items[outputRawLeadsEnquiries].values[0].value = 0;
		outputJSON.items[outputRawLeadsEnquiries].values[0].period = 0;
		for (i = 1; i < outputJSON.items[outputConversionRawLeadsToMQLs].values.length ; i++){
			D72 = outputJSON.items[outputOpportunities].values[i].value;
			D71 = outputJSON.items[outputConversionRawLeadsToMQLs].values[i].value;
			initValue(outputJSON.items[outputRawLeadsEnquiries].values, i);
			outputJSON.items[outputRawLeadsEnquiries].values[i].value = Math.round(D72/(D71/100));	
			outputJSON.items[outputRawLeadsEnquiries].values[i].period = i;
		}

// Sales Metrics
		// Copy Number of FTE Sales Reps
		initItem(outputJSON.items, outputNumFTESalesRep);
		outputJSON.items[outputNumFTESalesRep].name = "NumFTESalesRep";
		for (i = 0; i < inputJSON.items[inputNumFTESalesRep].values.length ; i++){
			initValue(outputJSON.items[outputNumFTESalesRep].values, i);
			outputJSON.items[outputNumFTESalesRep].values[i].value = 
				inputJSON.items[inputNumFTESalesRep].values[i].value;
			outputJSON.items[outputNumFTESalesRep].values[i].period = i;
		}
		// Copy Quota set per FTE sales rep
		initItem(outputJSON.items, outputQuotaPerRep);
		outputJSON.items[outputQuotaPerRep].name = "QuotaPerRep";
		for (i = 0; i < inputJSON.items[inputQuotaPerRep].values.length ; i++){
			initValue(outputJSON.items[outputQuotaPerRep].values, i);
			outputJSON.items[outputQuotaPerRep].values[i].value = 
				inputJSON.items[inputQuotaPerRep].values[i].value;
			outputJSON.items[outputQuotaPerRep].values[i].period = i;
		}
		// Set Sales Capacity D78 * D77
		initItem(outputJSON.items, outputSalesCapacity);
		outputJSON.items[outputSalesCapacity].name = "SalesCapacity";
		initValue(outputJSON.items[outputSalesCapacity].values, 0);
		outputJSON.items[outputSalesCapacity].values[0].value = 0;
		outputJSON.items[outputSalesCapacity].values[0].period = 0;
		for (i = 1; i < outputJSON.items[outputConversionRawLeadsToMQLs].values.length ; i++){
			D78 = outputJSON.items[outputQuotaPerRep].values[i].value;
			D77 = outputJSON.items[outputNumFTESalesRep].values[i].value;
			initValue(outputJSON.items[outputSalesCapacity].values, i);
			outputJSON.items[outputSalesCapacity].values[i].value = Math.round(D78*D77*10)/10;	
			outputJSON.items[outputSalesCapacity].values[i].period = i;
		}
		// Copy ratio for plan
		initItem(outputJSON.items, outputCoverageRatio);
		outputJSON.items[outputCoverageRatio].name = "CoverageRatio";
		for (i = 0; i < inputJSON.items[inputCoverageRatio].values.length ; i++){
			initValue(outputJSON.items[outputCoverageRatio].values, i);
			outputJSON.items[outputCoverageRatio].values[i].value = 
				inputJSON.items[inputCoverageRatio].values[i].value;
			outputJSON.items[outputCoverageRatio].values[i].period = i;
		}
		// Set Productivity per FTE sales rep D14/D77
		initItem(outputJSON.items, outputProductivityPerFTE);
		outputJSON.items[outputProductivityPerFTE].name = "ProductivityPerfTE";
		initValue(outputJSON.items[outputProductivityPerFTE].values, 0);
		outputJSON.items[outputProductivityPerFTE].values[0].value = 0;
		outputJSON.items[outputProductivityPerFTE].values[0].period = 0;
		for (i = 1; i < outputJSON.items[outputConversionRawLeadsToMQLs].values.length ; i++){
			D14 = outputJSON.items[outputNewACV].values[i].value;
			D77 = outputJSON.items[outputNumFTESalesRep].values[i].value;
			initValue(outputJSON.items[outputProductivityPerFTE].values, i);
			outputJSON.items[outputProductivityPerFTE].values[i].value = Math.round(D14/D77*10)/10;	
			outputJSON.items[outputProductivityPerFTE].values[i].period = i;
		}

		
		

	} else {
		console.log("-FullAnnualContractInputBuilder- no input JSON provided to builder");
	}
	


};

