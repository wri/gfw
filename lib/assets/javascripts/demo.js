showMap = false;

// simple array
var
n        = 100, // sample size
data     = d3.range(n).map(function() { return 100 * Math.random(); }),
barWidth = 5,
h        = 100;

var chart = d3.select(".charts").append("svg")
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
.attr("height", function(d) { return y(d); })
.on("mouseover", function(d,i) {
	d3.select(this).transition().duration(50).style("fill","#54838F");
	console.log(d+" - "+data[i]);
})
.on("mouseout", function(d,i) {
	d3.select(this).transition().duration(50).style("fill","#75ADB5");
})
.on("click", function() {  });