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
	
		var drop_category = d3.select("#dropcat")
		var dropdata = d3.map(data, function(d){return d.script_category;}).keys();
		dropdata.unshift("ALL");
		//console.log(dropdata);
		
       options = drop_category.selectAll('option').data(dropdata); // Data join
	   options.enter().append("option").text(function(d) { return d; }).attr("value",function(d) {return d;});
		
	   var thead = d3.select('#FilterableTable').select('thead').select('tr')
	   var tbody = d3.select('#FilterableTable').select('tbody')
		thead.selectAll('th')
			.data(columns)
			.enter()
			.append('th')
			.attr("class",function(d) { return d.csv })
			.text(function (d) { return d.title })
	  var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
		.append('tr')
	  
	  var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return csv_columns.map(function (column) {
	    		return { column: column, value: row[column] }
			})
		})
		.enter()
		.append('td')
		.text(function (d) { return d.value })
     
	}
	d3.csv(url,function (data) {
				
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
		
				frows.exit().remove();
			}
		
		var d3table = tabulate(data)
		
		d3.select("#searchbiz")
			.on("keyup",callback);
		
		d3.select("#searchpurpose")
			.on("keyup",callback);
		
		
		d3.select("#searchname")
			.on("keyup",callback);
		
		d3.select("#dropcat")		
			.on("change",callback);
		
	});
	
	
	
	
	
 }