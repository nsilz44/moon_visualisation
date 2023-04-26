
// set the dimensions and margins of the graph
var margin = {top: 78, right: 15, bottom: 12, left: 78},
  width = 1296 - margin.left - margin.right,
  height = 716 - margin.top - margin.bottom;

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
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = data.map(data => data.x).filter((value, index, self) => self.indexOf(value) === index)
  var myVars = data.map(data => data.y).filter((value, index, self) => self.indexOf(value) === index)
  var zdomain = data.map(data => data.z).filter((value, index, self) => self.indexOf(value) === index)
  
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

  var myColor = d3.scaleLinear()
  .range(["white", "#69b3a2"])
  .domain(zdomain)
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
