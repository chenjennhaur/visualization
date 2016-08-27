queue()
  .defer(d3.json,"/profile/1")
  .defer(d3.json,"/product/1")
  .defer(d3.json,"/country")
  .await(salesonline);
  
// var productline = dc.lineChart("#pline");
var productcomposite = dc.compositeChart("#pline");
var productpie = dc.pieChart("#ppie");
var productbar = dc.barChart("#pbar");
var heatmap = dc.heatMap("#hmap")

function salesonline(error,profileJson,productJson,countrycode)
{
  var product = productJson;
  var profile = profileJson;
  var dateFormat = d3.time.format('%Y%m');
  //console.log(profile[0]);
  //console.log(product);
  
  product.forEach(function (d) {
    d.periodstr = d.period.toString() // convert to string
	d.dd = dateFormat.parse(d.periodstr);
    d.month = d3.time.month(d.dd); 
	d.pcs = +d.pcs;
	d.wght = +d.wght;
    d.revenue = +d.revenue; // coerce to number
  })
  
  profile.forEach(function (d) {
    d.pcs = +d.pcs;
	d.wght = +d.wght;
    d.revenue = +d.revenue; // coerce to number
  })
  
  var profile_ndx = crossfilter(profile);
  var product_ndx = crossfilter(product);
  	   
  var dimPeriod = product_ndx.dimension(function (d) {return d.period;});   
  var dimProduct = product_ndx.dimension(function (d) {return d.product;});
  var dimMonth = product_ndx.dimension(function (d) {return d.month;});
  var dimSTC = product_ndx.dimension(function (d) {return d.sub_segment_desc;});
  
  var revByProduct = dimProduct.group().reduceSum(function(d) { return d.revenue; });
  var revBySTC = dimSTC.group().reduceSum(function(d) { return d.revenue; });
  var revByMonth = dimMonth.group().reduceSum(function(d) { return d.revenue; });
  var wghtByMonth = dimMonth.group().reduceSum(function(d) { return d.wght; });
  var pcsByMonth = dimMonth.group().reduceSum(function(d) { return d.pcs; });
  
  
  
  productpie
  .width(280)
  .height(380)
  .innerRadius(100)
  .legend(dc.legend().x(0).y(0).gap(5))
  .dimension(dimSTC)
  .group(revBySTC)
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
  .dimension(dimProduct)
  .group(revByProduct)
  .x(d3.scale.ordinal())
  .xUnits(dc.units.ordinal);
 
  productcomposite
   .width(580)
   .height(380)
   .yAxisLabel("Revenue")
   .elasticY(true)
   .xAxisLabel("Date")
   .margins({top: 10, right: 10, bottom: 100, left: 100})  
   .x(d3.time.scale().domain([new Date(2016, 3, 1), new Date(2016, 10, 31)]))
   .legend(dc.legend().x(500).y(20).itemHeight(13).gap(5))
   .renderHorizontalGridLines(true)
   .brushOn(false)
   .compose([
     dc.lineChart(productcomposite)
	   .dimension(dimPeriod)
	   .colors('red')
	   .group(wghtByMonth,'Weight'),
	 dc.lineChart(productcomposite)
	   .dimension(dimPeriod)
	   .colors('blue')
	   .group(pcsByMonth,'Pcs'),
	 dc.lineChart(productcomposite)
	   .dimension(dimPeriod)
	   .colors('green')
	   .group(revByMonth,'Revenue')
   ]);
    
	var heatColorMapping = function(d) {
        if (d < 0) {
          return d3.scale.linear().domain([0,5000]).range(["red", "#e5e5e5"])(d);
        }
        else {
          return d3.scale.linear().domain([5000,100000]).range(["#e5e5e5", "green"])(d);
        }
    };
    
	heatColorMapping.domain = function() {
      return [0,100000];
    };
	
	var dimOrigDest = profile_ndx.dimension(function (d) {return [d.orig,d.dest];});
    var revByOrigDest = dimOrigDest.group().reduceSum(function(d) { return d.revenue; });
  
    //console.log(revByOrigDest.all());
    //console.log(dimOrigDest)
	
	
    heatmap
	  .width(40*20+80)
	  .height(40*20+40)
	  .dimension(dimOrigDest)
	  .group(revByOrigDest)
	  .keyAccessor(function(d) { return countrycode[d.key[0]]; })
      .valueAccessor(function(d) { return countrycode[d.key[1]]; })
      .colorAccessor(function(d) { return +d.value; })
      .title(function(d) {
        return "Orig:   " + countrycode[d.key[0]] + "\n" +
               "Dest:  " + countrycode[d.key[1]] + "\n" +
               "Revenue: " +d.value ;})
      //.colors(heatColorMapping)
	  .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
      .calculateColorDomain();
	  
	  
	  
 // productline
 // .width(780)
 // .height(380)
 // .yAxisLabel("Revenue")
 // .elasticY(true)
 // .xAxisLabel("Date")
 // .x(d3.time.scale().domain([new Date(2016, 3, 1), new Date(2016, 10, 31)]))
 // .xUnits(d3.time.months).round(d3.time.month.round)
 // .margins({top: 10, right: 10, bottom: 50, left: 100})
 // .dimension(dimMonth)
 // .group(revByMonth)
 // .elasticY(true);
  
  
 
  dc.renderAll();
};
