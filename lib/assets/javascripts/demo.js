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
//
chart.selectAll("rect")
.data(data).enter()
.append("rect")
.attr("x", function(d, i) { return x(i) - .5; })
.attr("y", function(d) { return h - y(d) - .5; })
.attr("width", barWidth)
.attr("height", function(d) { return y(d); } )
.on("click", function() { alert('click!'); })



// Circle example
var circle = d3.select("#circle").append("svg")
.attr("class", "chart")
.attr("width", 300)
.attr("height", 300)


var width = 300;
var height = width;
var radius = width / 2;
circle.append("circle")
.attr("r", function(d) { return radius - 15.5; })
.attr("transform", "translate(" + radius + "," + radius + ")")
.on('mouseout', function() {
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
});


var
w     = 500,
h     = 100,
n     = 90, // sample size
dataY = d3.range(n).map(function() { return 100 * Math.random(); });
dataX = d3.range(n).map(function() { return 50 * Math.random(); });

var
graph = d3.select("#lines").append("svg:svg").attr("width", w).attr("height", h),
x = d3.scale.linear().domain([0, d3.max(dataX)]).range([0, w]),
y = d3.scale.linear().domain([0, d3.max(dataY)]).range([0, h]);

var line = d3.svg.line()
.x(function(d,i) { return x(i); })
.y(function(d) { return y(d); })
.interpolate("basis")

graph.append("svg:path").attr("d", line(data));
