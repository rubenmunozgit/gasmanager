
$(document).ready(function () {

	$('ul.graphView a').click(function(e){
		// e.stopPropagation();
		$(this).closest("li").addClass('active');
        $(this).closest("li").siblings().removeClass('active');
		showGraph();
	});

	$('ul.ranges a').click(function(e){
		// e.stopPropagation();
		$(this).closest("li").addClass('active');
        $(this).closest("li").siblings().removeClass('active');
		getGraphData();
	});

	getGraphData();
  	getGraphByMonth();
});

function getGraphData() {
	var daysfrom = $('ul.ranges li.active a').attr('data-range');
	console.log(daysfrom);	
	$.getJSON('/dashboard/findByUserDate', {days: daysfrom},function(ajaxGraphData){
		$("#trackDataGraph").data("ajaxGraphData", ajaxGraphData);
		showGraph(); 
	});
}

function getGraphByMonth() {
  $.getJSON('/dashboard/findByMonth', function(ajaxGraphByMonth){
    $("#KmByMonthGraph").data("ajaxGraphByMonth", ajaxGraphByMonth);
    showGraphByMonth(); 
  });
}

function showGraph() {
	var listKeys = [];
	var labelKeys = [];
	var labelUnits = {unitprice: 'eur/l', consumed: 'l/100Km', totalprice: 'eur', distance: 'Km'};
	var count = 0;
	var ajaxGraphData = $("#trackDataGraph").data("ajaxGraphData");
	listKeys[count] = $('ul.graphView li.active a').attr('graphView');
	switch(listKeys[count]){
		case 'unitprice':
			labelKeys[count] = labelUnits.unitprice;
			break;
		case 'consumed':
			labelKeys[count] = labelUnits.consumed;
			break;
		case 'totalprice':
			labelKeys[count] = labelUnits.totalprice;
			break;
		case 'distance':
			labelKeys[count] = labelUnits.distance;
	};
	
	$("#trackDataGraph").html("");

	Morris.Line({
	// ID of the element in which to draw the chart.
	element: 'trackDataGraph',
	// Chart data records -- each entry in this array corresponds to a point on
	// the chart.
	data: ajaxGraphData,
	// The name of the data record attribute that contains x-values.
  	xkey: 'date',
  	// A list of names of data record attributes that contain y-values.
  	ykeys: listKeys,
  	// Labels for the ykeys -- will be displayed when you hover over the
  	// chart.
  	labels: labelKeys
	});
}


function showGraphByMonth() {
    var graphDatabyMonth = $('#KmByMonthGraph').data('ajaxGraphByMonth');
    console.log(graphDatabyMonth +", "+ graphDatabyMonth.length);
    
      
    Morris.Bar({
    element: 'KmByMonthGraph',
    data: graphDatabyMonth,
    xkey: 'date',
    ykeys: ['distance'],
    labels: ['Km'],
    barColors: ['#57889c'],
    hideHover: ['true']
    });
    
/*    Morris.Bar({
    element: 'ConsumByMonthGraph',
    data: ajaxDataByMonth,
    xkey: 'date',
    ykeys: ['Conumed'],
    labels: ['l/100km'],
    barColors: ['#d1b993'],
    hideHover: ['true']
    });*/
    
    Morris.Bar({
    element: 'PriceByMonthGraph',
    data: graphDatabyMonth,
    xkey: 'date',
    ykeys: ['price'],
    labels: ['eur'],
    barColors: ['#26c281'],
    hideHover: ['true']
    });
}



