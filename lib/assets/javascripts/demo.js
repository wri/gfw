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
.data(data)
.enter().append("rect")
.attr("x", function(d, i) { return x(i) - .5; })
.attr("y", function(d) { return h - y(d) - .5; })
.attr("width", barWidth)
.attr("height", function(d) { return y(d); } );

// x and y are the lower-left position of the bar
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
.on("mouseenter", function() { console.log('a'); })
.on("click", function() { alert('a'); })





var circle = d3.select("#circle").append("svg")
.attr("class", "chart")
.attr("width", 300)
.attr("height", 300)

circle.append("circle")
.attr("r", function(d) { return 50; })
.attr("transform", "translate(110, 110)");
