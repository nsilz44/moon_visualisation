
// set the dimensions and margins of the graph
var margin = {top: 78, right: 15, bottom: 152, left: 78},
  width = 1296 - margin.left - margin.right,
  height = 856 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#moon")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var a = 1
//Read the data
async function loadgraphs(){
  var data = await d3.csv("lower.csv");
  var apollodata = await d3.csv("apollo.csv");
  loadgraph(data,apollodata);
}

function loadgraph(data,apollodata) {
     //console.log(data)
     data.forEach(function(d) {
      d.z = +d.z;
      d.x = +d.x;
      d.y = +d.y
    });
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = data.map(data => data.x).filter((value, index, self) => self.indexOf(value) === index)
  var myVars = data.map(data => data.y).filter((value, index, self) => self.indexOf(value) === index)
  var zdomain = data.map(data => data.z).filter((value, index, self) => self.indexOf(value) === index)
  console.log(zdomain)
  // Build X scales and axis:
  var x = d3.scaleBand()
  .range([ 0, width  ])
  .domain(myGroups)
  .padding(0.0001);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .style("font-size", 0)
  .call(d3.axisBottom(x).tickSize(0).ticks(10))
  

  var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.0001);
svg.append("g")
.style("font-size", 0)
  .call(d3.axisLeft(y).tickSize(0).ticks(10))
    mincolour  = '#f407dd'
    maxcolour = '#b2e509'
  minLegend = d3.min(zdomain);
  maxLegend = d3.max(zdomain);
  var myColor = d3.scaleLinear()
  .range([mincolour,maxcolour])
  .domain([minLegend,maxLegend])
  console.log(myColor(minLegend),myColor((maxLegend-minLegend)/2),myColor(maxLegend))
  // create a tooltip
  var tooltip = d3.select("#moon")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  //  Creating the legend
  var linearGradient = svg
    .append("linearGradient")
    .attr("id", "linear-gradient");
  //Horizontal gradient
  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");
  //Append multiple color stops by using D3's data/enter step
  linearGradient
    .selectAll("stop")
    .data([
      { offset: "0%", color: mincolour},
      { offset: "100%", color: maxcolour},
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });
  minLegend = d3.min(zdomain);
  maxLegend = d3.max(zdomain);
  console.log(minLegend,maxLegend)
  sumMinMaxLegend =
    d3.max(data, (d) => d.z) + d3.min(data, (d) => d.z);
  var legendWidth = width * 0.3,
    legendHeight = 8;
  //Color Legend container
  var legendsvg = svg
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      "translate(" + (margin.left + legendWidth / 2) + "," + (height+20) + ")"
    );
  //Draw the Rectangle
  legendsvg
    .append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth / 2 + 0.5)
    .attr("y", 10)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)")
    .style("stroke", "black")
    .style("stroke-width", "1px");
  //Append title
  legendsvg
    .append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", 2)
    .text("Elevation(m)");
  //Set scale for x-axis
  var xScale2 = d3.scaleLinear()
    .range([0, legendWidth])
    .domain([minLegend,maxLegend]);
  var xAxis = legendsvg
    .append("g")
    .call(d3.axisBottom(xScale2)
        .ticks(5)
    )
    .attr("class", "legendAxis")
    .attr("id", "legendAxis")
    .attr(
      "transform",
      "translate(" + -legendWidth / 2 + "," + (10 + legendHeight) + ")"
    );
  // Three function that change the tooltip when user hover / move / leave a cell
  var click = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
    coordX = (d.x-200) * (360/(width));
    coordY = ((d.y-76) * (140/(height)) - 70) * -1;
    tooltip
      .html("At latitude: "+ d.target.__data__.y + "°, longitude: "+ d.target.__data__.x+"° the elevation is " +d.target.__data__.z+'m')
      .style("left", (d.x+20) + "px")
      .style("top", (d.y+10) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
  }

  svg.selectAll()
      .data(data, function(d) {return d.x+':'+d.y;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.x) })
      .attr("y", function(d) { return y(d.y) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.z)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
    .on("click", click)
    .on("mouseleave", mouseleave)
    console.log('loaded')
    // set the dimensions and margins of the graph
var barmargin = {top: 20, right: 30, bottom: 40, left: 90},
barwidth = 460 - barmargin.left - barmargin.right,
barheight = 400 - barmargin.top - barmargin.bottom;

// append the svg object to the body of the page
var barsvg = d3.select("#barchart")
.append("svg")
.attr("width", barwidth + margin.left + margin.right)
.attr("height", barheight + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
// Add X axis
var barx = d3.scaleLinear()
.domain([0, maxLegend])
.range([ 0, barwidth]);
barsvg.append("g")
.attr("transform", "translate(0," +0 + ")")
.call(d3.axisTop(barx))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(45)")
  .style("text-anchor", "end");
barsvg.append("text")      // text label for the x axis
.attr("x", 200)
.attr("y",  -50)
.style("text-anchor", "middle")
.text("Elevation(m)");
// Y axis
var bary = d3.scaleBand()
.range([ 0, barheight ])
.domain(apollodata.map(function(d) { return d.name; }))
.padding(.1);
barsvg.append("g")
.call(d3.axisLeft(bary))

 // create a tooltip
 var bartooltip = d3.select("#barchart")
 .append("div")
 .style("opacity", 0)
 .attr("class", "tooltip")
 .style("background-color", "white")
 .style("border", "solid")
 .style("border-width", "2px")
 .style("border-radius", "5px")
 .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var barclick = function(d) {
    bartooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
    bartooltip
      .html("At latitude: "+ d.target.__data__.y + "°, longitude: "+ d.target.__data__.x+"° the elevation is " +d.target.__data__.z+'m')
      .style("left", (d.x) + "px")
      .style("top", (d.y+650) + "px")
  }
  var barmouseleave = function(d) {
    bartooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
  }
//Bars
barsvg.selectAll()
.data(apollodata)
.enter()
.append("rect")
.attr("x", barx(0) )
.attr("y", function(d) { return bary(d.name); })
.attr("width", function(d) { return barx(d.z); })
.attr("height", bary.bandwidth() )
.attr("fill", function(d) {return myColor(d.z);})
.on("click", barclick)
    .on("mouseleave", barmouseleave)




// set the dimensions and margins of the graph
var bubblemargin = {top: 10, right: 20, bottom: 60, left: 50},
    bubblewidth = 500 - bubblemargin.left - bubblemargin.right,
    bubbleheight = 420 - bubblemargin.top - bubblemargin.bottom;

// append the svg object to the body of the page
var bubblesvg = d3.select("#bubblechart")
  .append("svg")
    .attr("width", bubblewidth + bubblemargin.left + bubblemargin.right)
    .attr("height", bubbleheight + bubblemargin.top + bubblemargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + bubblemargin.left + "," + bubblemargin.top + ")");
  
  // Add X axis
  var bubblex = d3.scaleLinear()
    .domain([0, 360])
    .range([ 0, bubblewidth ]);
  bubblesvg.append("g")
    .attr("transform", "translate(0," + bubbleheight + ")")
    .call(d3.axisBottom(bubblex));
    bubblesvg.append("text")      // text label for the x axis
    .attr("x", 200)
    .attr("y",  385)
    .style("text-anchor", "middle")
    .text("Longitude(°)");

  // Add Y axis
  var bubbley = d3.scaleLinear()
    .domain([-70, 70])
    .range([ bubbleheight, 0]);
  bubblesvg.append("g")
    .call(d3.axisLeft(bubbley));
    bubblesvg.append("text")      // text label for the x axis
    .attr("x", -175)
    .attr("y",  -25)
    .attr("transform", "translate(0,0)rotate(-90)")
    .style("text-anchor", "middle")
    .text("Latitude(°)");

  // Add a scale for bubble size
  var bubblez = d3.scaleLinear()
    .domain([minLegend, maxLegend])
    .range([ 1, 40]);

    // create a tooltip
 var bubbletooltip = d3.select("#bubblechart")
 .append("div")
 .style("opacity", 0)
 .attr("class", "tooltip")
 .style("background-color", "white")
 .style("border", "solid")
 .style("border-width", "2px")
 .style("border-radius", "5px")
 .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var bubbleclick = function(d) {
    bubbletooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
    bubbletooltip
      .html(d.target.__data__.name)
      .style("left", (d.x) + "px")
      .style("top", (d.y+650) + "px")
  }
  var bubblemouseleave = function(d) {
    bubbletooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style('opacity','0.7')
  }
  
  // Add dots
  bubblesvg.append('g')
    .selectAll("dot")
    .data(apollodata)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return bubblex(d.x); } )
      .attr("cy", function (d) { return bubbley(d.y); } )
      .attr("r", function (d) { return bubblez(d.z); } )
      .style("fill", function(d){return myColor(d.z);})
      .style("opacity", "0.7")
      .attr("stroke", "black")
      .on("click", bubbleclick)
      .on("mouseleave", bubblemouseleave)
    // The scale you use for bubble size

// Add legend: circles
var valuesToShow = [10000, 22500, 35000]
var xCircle = 800
var xLabel = 900
var yCircle = 750
svg
.selectAll("legend")
.data(valuesToShow)
.enter()
.append("circle")
  .attr("cx", xCircle)
  .attr("cy", function(d){ return yCircle - bubblez(d) } )
  .attr("r", function(d){ return bubblez(d) })
  .style("fill", "none")
  .attr("stroke", "black")

// Add legend: segments
svg
.selectAll("legend")
.data(valuesToShow)
.enter()
.append("line")
  .attr('x1', function(d){ return xCircle + bubblez(d) } )
  .attr('x2', xLabel)
  .attr('y1', function(d){ return yCircle - bubblez(d) } )
  .attr('y2', function(d){ return yCircle - bubblez(d) } )
  .attr('stroke', 'black')
  .style('stroke-dasharray', ('2,2'))

// Add legend: labels
svg
.selectAll("legend")
.data(valuesToShow)
.enter()
.append("text")
  .attr('x', xLabel)
  .attr('y', function(d){ return yCircle - bubblez(d) } )
  .text( function(d){ return d +'m'} )
  .style("font-size", 5)
  .attr('alignment-baseline', 'middle')
}
loadgraphs()

