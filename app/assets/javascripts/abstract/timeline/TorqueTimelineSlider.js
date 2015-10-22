define([
  'underscore', 'moment', 'd3'
], function(_, moment, d3) {

  var timeScale, brush, margin, width, height, el, extent, callback,
    handle, startingDate;

  var TorqueTimelineSlider = function(options) {
    options = options || {};

    margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = options.width - margin.left - margin.right,
    height = options.height - margin.bottom - margin.top,

    el = options.el;
    callback = options.callback;

    extent = options.extent;
    startingDate = options.startingDate;

    this.setupScales();
    this.render();

    return this;
  };

  TorqueTimelineSlider.prototype.setupScales = function() {
    timeScale = d3.time.scale()
      .domain(extent)
      .range([0, width])
      .clamp(true);
  };

  TorqueTimelineSlider.prototype.setupBrush = function() {
    var startingExtent = [startingDate, startingDate];
    if (!startingDate) {
      startingExtent = [moment(0).toDate(), moment(0).toDate()];
    }

    brush = d3.svg.brush()
      .x(timeScale)
      .extent([startingDate, startingDate])
      .on("brush", this.brushed);
  };

  TorqueTimelineSlider.prototype.brushed = function() {
    var value = brush.extent()[0];

    if (d3.event.sourceEvent) { // not a programmatic event
      value = timeScale.invert(d3.mouse(this)[0]);
      brush.extent([value, value]);
    }

    handle.attr("transform", "translate(" + timeScale(value) + ",0)");
    console.log(value);

    if (value !== undefined) {
      callback(value);
    }
  };

  TorqueTimelineSlider.prototype.setupSlider = function(svg) {
    var slider = svg.append("g")
      .attr("class", "slider")
      .call(brush);

    slider.selectAll(".extent,.resize").remove();
    slider.select(".background").attr("height", height);

    handle = slider.append("g")
      .attr("class", "handle")

    handle.append("path")
      .attr("transform", "translate(0," + height / 2 + ")")
      .attr("d", "M 0 -20 V 20")

    handle.append('text')
      .text(0)
      .attr("transform", "translate(" + (-18) + " ," + (height / 2 - 25) + ")");

    slider
      .call(brush.event)
  };

  TorqueTimelineSlider.prototype.render = function() {
    var svg = d3.select(el).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.setupBrush();
    this.setupSlider(svg);
  };

  return TorqueTimelineSlider;

});
