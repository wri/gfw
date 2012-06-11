showMap = false;

// simple array
var
n        = 100, // sample size
data     = d3.range(n).map(function() { return 100 * Math.random(); }),
barWidth = 5,
h        = 100;

var chart = d3.select("#bars").append("svg")
.attr("class", "chart")
.attr("width", barWidth * data.length)
.attr("height", h);

var x = d3.scale.linear()
.domain([0, 1])
.range([0, barWidth]);

var y = d3.scale.linear()
.domain([0, h])
.rangeRound([0, h]); //rangeRound is used for antialiasing

// width is the width of the bar
// height is the height of the bar
// for crisp edges use -.5 (antialiasing)
chart.selectAll("rect")
.data(data).enter()
.append("rect")
.attr("x", function(d, i) { return x(i) - .5; })
.attr("y", function(d) { return h - y(d) - .5; })
.attr("width", barWidth)
.attr("height", function(d) { return y(d); } )
.on("mouseover", function() { d3.select(this).transition().duration(100).style("fill", "#427C8D"); })
.on("mouseout", function() { d3.select(this).transition().duration(500).style("fill", "#75ADB5"); })

// Circle example
var
width  = 300,
height = 300,
n      = 20, // sample size
h      = 140,

data     = d3.range(n).map(function() { return 100 * Math.random(); }),

radius = width / 2;

var graph = d3.select("#circle")
.append("svg:svg")
.attr("width", width)
.attr("height", height);

var x = d3.scale.linear().domain([0, data.length - 1]).range([0, width - 35]);
var y = d3.scale.linear().domain([0, d3.max(data)]).range([0, h]);

var line = d3.svg.line()
.x(function(d,i)  { return x(i); })
.y(function(d, i) { return y(d); })
.interpolate("basis");

graph.append("svg:path")
.attr("transform", "translate(" + 18 + "," + (radius - h/2) + ")")
.attr("d", line(data));


var myLine = graph.append("svg:line")
    .attr("x1", 2)
    .attr("y1", height/2)
    .attr("x2", width - 2)
    .attr("y2", height/2)
    .style("stroke-dasharray", "3,3")
    .style("stroke", "#F2B357");

var circle = graph.append("circle")
.attr("width", width)
.attr("height", height)
.attr("r", function(d) { return radius - 15.5; })
.attr("transform", "translate(" + radius + "," + radius + ")");

graph.append("circle")
.attr("width", width)
.attr("height", height)
.style("stroke", "white")
.attr("r", function(d) { return radius - 5.5; })
.attr("transform", "translate(" + radius + "," + radius + ")");

/*.on('mouseout', function() {
  return d3.select(this)
  .transition()
  .duration(750)
  .attr("r", radius - 15.5);
})
.on('mouseover', function() {
  return d3.select(this)
  .transition()
  .duration(750)
  .attr("r", radius - 5.5);
});*/
