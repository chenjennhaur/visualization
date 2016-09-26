

function salesonline(error,customerJson,customerlistJson)
{
  var customer = customerJson;
  var customerlist = customerlistJson;
  
  var dateFormat = d3.time.format('%Y-%m-%d');
  //console.log(profile[0]);
  //console.log(product);
  
  var f = d3.format(".4r");
  var formatMonth = d3.time.format("%m-%y");
  
  customer.forEach(function (d) {
	d.dd = dateFormat.parse(d.period);
	d.year = d3.time.year(d.dd);
    d.month = d3.time.month(d.dd); // pre-calculate month for better performance
	d.pcs = +d.pcs;
	d.wght = +d.wght;
    d.revenue = f(+d.revenue) ; // coerce to number
  })
  
  
  var customer_ndx = crossfilter(customer);
  
  var dimPeriod = customer_ndx.dimension(function (d) {return d.period;});   
  var dimProduct = customer_ndx.dimension(function (d) {return d.product;});
  var dimMonth = customer_ndx.dimension(function (d) {return d.month;});
  var dimCust = customer_ndx.dimension(function(d) {return d.macagcname;});
  
  var revByProduct = dimProduct.group().reduceSum(function(d) { return f(d.revenue); });
  var pcsByProduct = dimProduct.group().reduceSum(function(d) { return d.pcs; });
  var revByMonth = dimMonth.group().reduceSum(function(d) { return d.revenue; });
  var wghtByMonth = dimMonth.group().reduceSum(function(d) { return d.wght; });
  var pcsByMonth = dimMonth.group().reduceSum(function(d) { return d.pcs; });
  
  var names =[];
  var names_id = [];
  customerlist.forEach(function (d){
	  names.push(d.macagcname);
	  names_id.push(d.macagcname);
  }
  )
  names.push("null");
  names_id.push("null");
  console.log(names);
  
  var select = selsegment.append("select")
  select.selectAll("option.name")
    .data(names)
	.enter()
	.append("option")
	.classed("name",true)
	.attr({
		value:function(d){return d}
	})
	.text(function(d){return d})

  select.on("change",function(d){
	  dimCust.filter(names[this.selectedIndex]);
	  dc.renderAll();
  })
  
  
  productpie
  .width(280)
  .height(380)
  .innerRadius(100)
  .legend(dc.legend().x(0).y(0).gap(5))
  .dimension(dimProduct)
  .group(revByProduct)
  .title(function(d){return d.key + ": " + f(d.value);})
  .renderLabel(false);
  
  //console.log(revByProduct.all());
  //console.log(dimProduct);
  
  productbar
  .width(780)
  .height(380)
  .elasticY(true)
  .elasticX(true)
  .yAxisLabel("Revenue")
  .xAxisLabel("Product")
  .margins({top: 10, right: 10, bottom: 100, left: 100})  
  .dimension(dimMonth)
  .group(revByMonth)
  .title(function(d){return formatMonth(d.key) + ": "+f(d.value);})
  .x(d3.scale.ordinal())
  .xUnits(dc.units.ordinal);
 
  productcomposite
   .width(580)
   .height(380)
   .yAxisLabel("Revenue")
   .elasticY(true)
   .xAxisLabel("Date")
   .margins({top: 50, right: 10, bottom: 100, left: 100})  
   .x(d3.time.scale().domain([new Date(2015, 12, 1), new Date(2016, 9, 30)]))
   .legend(dc.legend().x(500).y(20).itemHeight(13).gap(5))
   .renderHorizontalGridLines(true)
   .renderlet(function(chart) {
        chart.svg().select('.chart-body').attr('clip-path', null)})
   .shareTitle(false)
   .brushOn(false)
   .compose([
     dc.lineChart(productcomposite)
	   .dimension(dimPeriod)
	   .colors('red')
	   .title(function(d){return formatMonth(d.key) + ": "+f(d.value);})
	   .group(wghtByMonth,'Weight'),
	 dc.lineChart(productcomposite)
	   .dimension(dimPeriod)
	   .colors('blue')
	   .title(function(d){return formatMonth(d.key) + ": "+f(d.value);})
	   .group(pcsByMonth,'Pcs'),
	 dc.lineChart(productcomposite)
	   .dimension(dimPeriod)
	   .colors('green')
	   .title(function(d){return formatMonth(d.key) + ": "+f(d.value);})
	   .group(revByMonth,'Revenue')
   ]);
    
	  
  
 
  dc.renderAll();
};