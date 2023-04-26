
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
  loadgraph(data);
}

function loadgraph(data) {
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
  .padding(0.01);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .style("font-size", 0)
  .call(d3.axisBottom(x).tickSize(0).ticks(10))
  

  var y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myVars)
  .padding(0.01);
svg.append("g")
.style("font-size", 0)
  .call(d3.axisLeft(y).tickSize(0).ticks(10))
    mincolour  = '#a0f7b6'
    maxcolour = '#000a02'
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
    .text("Elevation");
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
      .html("The elevation is " +d.target.__data__.z+'m')
      .style("left", (d.x+20) + "px")
      .style("top", (d.y+10) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
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
      .style("opacity", 0.8)
    .on("click", click)
    .on("mouseleave", mouseleave)
    console.log('loaded')
}
loadgraphs()
