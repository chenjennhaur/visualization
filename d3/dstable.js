 function loadd3table(url){
	 //var columns = ['script_category','script_name','business_case','purpose','keywords','script_owner','created_by']
	 var columns = [{csv:'script_category',title:'Category'},
					{csv:'script_name',title:'Name'},
					{csv:'business_case',title:'Business Case'},
					{csv:'purpose',title:'Purpose'},
					{csv:'keywords',title:'Keywords'},
					{csv:'script_owner',title:'Owner'},
					{csv:'created_by',title:'Created By'}]
	 var csv_columns = columns.map(function(a){return a.csv})
	 
	 var tabulate = function (data) {
	   //d3.select("body").append("div")
		//	.attr("id","container");
	   
	   //d3.select("#container").append("div")
		//	.attr("id", "FilterableTable");
			
	   d3.select("#FilterableTable").append("div")
			.attr("class", "SearchBar")
	

      d3.select(".SearchBar")
		.append("div")
		//.text("Name : ")
		.append("input")
		.attr("class", "SearchBar")
		.attr("id", "searchname")
		.attr("type", "text")
		.attr("placeholder", "Search Name..");	
	
	  d3.select(".SearchBar")
		.append("div")
		//.text("Purpose : ")
		.append("input")
		.attr("class", "SearchBar")
		.attr("id", "searchpurpose")
		.attr("type", "text")
		.attr("placeholder", "Search Purpose...");		
		
	 d3.select(".SearchBar")
		.append("div")
		//.text("Business Case : ")
		.append("input")
		.attr("class", "SearchBar")
		.attr("id", "searchbiz")
		.attr("type", "text")
		.attr("placeholder", "Search Business Case...");		
	
	
	   var drop_category = d3.select(".SearchBar")
							 .append("div").text("Category : ")
							 .append("select")
							 .attr("class", "SearchBar")
							 .attr("id", "dropcat")
		
		var dropdata = d3.map(data, function(d){return d.script_category;}).keys();
		dropdata.unshift("ALL");
		console.log(dropdata);
       options = drop_category.selectAll('option').data(dropdata); // Data join
	   options.enter().append("option").text(function(d) { return d; }).attr("value",function(d) {return d;});
       //options.enter().append("option").text(function(d) { return d; }).attr("value",function(d) {return d;});
		
	
	   var table = d3.select('#FilterableTable').append('table').attr("id","d3table")
	   var thead = table.append('thead')
	   var tbody = table.append('tbody')
		thead.append('tr')
			.selectAll('th')
			.data(columns)
			.enter()
			.append('th')
			.attr("class",function(d) { return d.csv })
			.text(function (d) { return d.title })
	  var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
		.append('tr')
	  //console.log(rows)	
	  var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return csv_columns.map(function (column) {
	    		return { column: column, value: row[column] }
			})
		})
		.enter()
		.append('td')
		.text(function (d) { return d.value })
     //console.log(cells)	
	//return table;
	
	}
	d3.csv(url,function (data) {
		//data.forEach(function(d){ d.date = parseDate(d.date)
		//})
		//var columns = ['uid','book','title','subject','summary','original_publisher','digital_publisher','format','language','copyright','author_name','published']
		//var columns = ['script_id','script_status','script_category','script_name','business_case','purpose','keywords','script_owner','created_by','approved_by','variables','LvlCnt']
		
		var callback = function (){
				dropcat = d3.select('#dropcat').node().value.trim();
				console.log(dropcat);
				biztext = d3.select('#searchbiz').node().value.trim();
				purposetext = d3.select('#searchpurpose').node().value.trim();
				nametext = d3.select('#searchname').node().value.trim();
				var bizregex = new RegExp("^.*" + biztext + ".*", "i");
				var purposeregex = new RegExp("^.*" + purposetext + ".*", "i");
				var nameregex = new RegExp("^.*" + nametext + ".*", "i");
				if (dropcat === "ALL"){
				  var catregex = new RegExp("^.*$");
				}else 
				  var catregex = new RegExp("^"+dropcat+"$");
								
				searched_data = data.filter(function(p) {
					return (bizregex.test(p.business_case)) && (nameregex.test(p.script_name)) && (purposeregex.test(p.purpose)) && (catregex.test(p.script_category))
				})
				var frows = d3.select('#d3table').select("tbody").selectAll("tr")
						.data(searched_data,function(d){ return d.script_id}) // key function is critical
				frows.enter()
				     .append("tr")	
				
				cells = frows.selectAll('td')
								cells.data(function(row) {
									return csv_columns.map(function (column) {
										return { column: column, value: row[column]}
									})
								})
							.enter()
							.append('td')
							.text(function (d) { return d.value })
							//cells.exit().remove();
				frows.exit().remove();
			}
		
		var d3table = tabulate(data)
		//https://bost.ocks.org/mike/constancy/
		d3.select("#searchbiz")
			.on("keyup",callback);
		
		d3.select("#searchpurpose")
			.on("keyup",callback);
		
		
		d3.select("#searchname")
			.on("keyup",callback);
		
		d3.select(".SearchBar")		
			.on("change",callback);
		
	});
	
	
	
	
	
 }