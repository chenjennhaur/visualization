var oppbar = dc.barChart("#oppbar");
var opppie = dc.pieChart("#opppie");
var dataTable = dc.dataTable("#dc-table-graph");
d3.csv("../static/oppo.csv", function(error,data) {
  var dateFormat = d3.time.format('%d-%m-%Y');
  var dateMonthFormat = d3.time.format('%Y%m');
  data.forEach(function (d) {
    d.dd = dateFormat.parse(d.date);
	d.year = d3.time.year(d.dd);
    d.month = d3.time.month(d.dd); // pre-calculate month for better performance
    d.revenue = +d.revenue; // coerce to number
  })
  
  var ndx = crossfilter(data);
  //var all = ndx.groupAll();
	   
  var dimMonth = ndx.dimension(function (d) {
    return d.month;
  });
	   
  var datedim = ndx.dimension(function(d){ return d.date})
  var dimStage = ndx.dimension(function (d) {
    return d.stage;
  });
	   
  var revByMonthGroup = dimMonth.group().reduceSum(function(d) { return d.revenue; });
  var revByMonthCount = dimMonth.group().reduceCount();
  var revByStageGroup = dimStage.group().reduceSum(function(d) { return d.revenue; });
  var revByStageCount = dimStage.group().reduceCount();
  
//  revByStageGroup.top(Infinity).forEach(function (d){
//	  console.log(d.key,d.value)
//  })
  //revByStageGroup.all().forEach(function (d){console.log(d.key,d.value)})
  //revByMonthGroup.all().forEach(function (d){console.log(d.key,d.value)})
  
  var mindate = new Date(2016,1,1);
  var maxdate = new Date(2016,12,1);
  
  oppbar
  .width(580)
  .height(280)
  .elasticY(true)
  .yAxisLabel("Committed Revenue")
  .xAxisLabel("Date")
  .margins({top: 10, right: 10, bottom: 100, left: 100})
  .x(d3.time.scale().domain([new Date(2014, 0, 1), new Date(2016, 11, 31)]))
  .filter([new Date(2016,5,1),new Date(2016,8,1)])
  .xUnits(d3.time.months).round(d3.time.month.round)
  .dimension(dimMonth)
  .group(revByMonthGroup);
  
  //oppbar.xAxis().ticks(20).tickFormat(d3.time.format("%m-%Y"))
  oppbar.xAxis().ticks(20).tickFormat(d3.time.format("%Y-%m"))

  oppbar.renderlet(function(chart){
    chart.selectAll("g.x text")
	.attr('transform', "rotate(-65)")
	.attr('dx', '-30');
  })
  
  opppie
  .width(280)
  .height(280)
  .slicesCap(4)
  .innerRadius(100)
  .legend(dc.legend().x(90).y(100).gap(5))
  //.x(d3.scale.linear().domain(["07 - Shipped to Profile","06 - First Consignment"]))
  //.xUnits(dc.units.ordinal)
  .dimension(dimStage)
  .group(revByStageCount)
  .renderLabel(false)
  .render();

  dataTable.width(760).height(500)
  .dimension(datedim)
  .group(function(d){return "Opportunity Table"})
  .size(10)
  .columns([
    //function(d) {return d.date},
	//function(d) {return d.month},
	function(d) {return d.stage},
	function(d) {return d.source},
	function(d) {return d.revenue}
  ])
  .sortBy(function(d){return d.date})
  .order(d3.descending)
  
  
  
  dc.renderAll();
});
