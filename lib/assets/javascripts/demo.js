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
width    = 300,
height   = width,
n        = 20, // sample size
h        = 40,
maxValue = 50 // max random value
data     = d3.range(n).map(function() {
  return Math.floor(Math.random() * (maxValue*2 -1)) - maxValue;
}),
radius   = width / 2;

var graph = d3.select(".circle")
.append("svg:svg")
.attr("width", width)
.attr("height", height);

var x = d3.scale.linear().domain([0, data.length - 1]).range([0, width - 35]);
var y = d3.scale.linear().domain([0, d3.max(data)]).range([0, h]);

var line = d3.svg.line()
.x(function(d,i)  { return x(i); })
.y(function(d, i) { return y(d); })
.interpolate("basis");

// Adds the dotted line
graph.append("svg:line")
.attr("x1", 2)
.attr("y1", height/2)
.attr("x2", width - 2)
.attr("y2", height/2)
.style("stroke-dasharray", "3,3")
.style("stroke", "#F2B357");

// Adds the line graph
var marginLeft = 20;
var marginTop = radius - h/2;
var p = graph.append("svg:path")
.attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
.attr("d", line(data));

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





function addBars(data, options) {

var
width             = options.width      || 300,
height            = options.height     || width,
barWidth          = options.barWidth   || 5,
h                 = 100, // maxHeight
unit              = options.unit       || "",
color             = options.color      || "#75ADB5",
hoverColor        = options.hoverColor || "#427C8D",
radius            = width / 2,
mouseOverDuration = 10,
mouseOutDuration  = 700;

var graph = d3.select(".circle.demo2")
.append("svg:svg")
.attr("width", width)
.attr("height", height);

var x = d3.scale.linear().domain([0, data.length - 1]).range([0, width - 35]);
var y = d3.scale.linear().domain([0, d3.max(data)]).range([0, h]);

var line = d3.svg.line()
.x(function(d,i)  { return x(i); })
.y(function(d, i) { return y(d); })
.interpolate("basis");

var dashedLines = [
  { x1:2, y:height/2, x2:width },
  { x1:55, y:height/5, x2:250 },
  { x1:67, y:250, x2:250 },
];

// Adds the dotted lines
_.each(dashedLines, function(line) {
  graph.append("svg:line")
  .attr("x1", line.x1)
  .attr("y1", line.y)
  .attr("x2", line.x2)
  .attr("y2", line.y)
  .style("stroke-dasharray", "3,3")
  .style("stroke", color);
});

d3.select("#bars").append("svg")
.attr("class", "chart")
.attr("width", barWidth * data.length)
.attr("height", h);

var x = d3.scale.linear()
.domain([0, 1])
.range([0, barWidth]);

var y = d3.scale.linear()
.domain([0, h])
.rangeRound([0, h]); //rangeRound is used for antialiasing

graph.append("circle")
.attr("width", width)
.attr("height", height)
.style("stroke", color)
.attr("r", function(d) { return radius - 15.5; })
.attr("transform", "translate(" + radius + "," + radius + ")");

graph.append("circle")
.attr("width", width)
.attr("height", height)
.style("stroke", "white")
.attr("r", function(d) { return radius - 5.5; })
.attr("transform", "translate(" + radius + "," + radius + ")");

var marginLeft = width/2 - data.length * barWidth/2;
var marginTop = d3.max(data);

// Value
graph.append("text")
.attr("text-anchor", "middle")
.attr("class", "amount")
.attr("transform", "translate(" + 150 + "," + 230 + ")");

// Value
graph.append("text")
.attr("text-anchor", "middle")
.attr("class", "amount")
.attr("transform", "translate(" + 150 + "," + 230 + ")");

graph.selectAll("rect")
.data(data).enter()
.append("rect")
.attr("x", function(d, i) { return x(i) - .5; })
.attr("y", function(d) { return h - y(d) - .5; })
.attr("width", barWidth)
.attr("height", function(d) { return y(d); } )
.attr("transform", "translate(" + marginLeft + "," + marginTop + ")")
.on("mouseover", function(d) {
  var val = Math.floor(d) + " " + unit;
  $(".amount").text(val);
  d3.select(this).transition().duration(mouseOverDuration).style("fill", hoverColor);
})
.on("mouseout", function() { d3.select(this).transition().duration(mouseOutDuration).style("fill", color); })

}

data = d3.range(40).map(function() { return 100 * Math.random(); }),
addBars(data, { width: 300, title: "Height", subtitle:"Tree height distribution", legend:"total forest area", hoverColor: "#427C8D", color: "#75ADB5", unit: "Ha" });
