define([
  'underscore', 'moment', 'd3'
], function(_, moment, d3) {

  var timeScale, brush, margin, width, height, el, extent, callback,
    handle, startingDate, slider;

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

  TorqueTimelineSlider.prototype.setDate = function(date) {
    brush.extent([date, date]);
    handle.attr("transform", "translate(" + timeScale(date) + ",0)");
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
    handle.attr("transform", "translate(" + timeScale(value) + ",0)");

    var notProgrammaticEvent = (d3.event && d3.event.sourceEvent);
    if (notProgrammaticEvent) {
      value = timeScale.invert(d3.mouse(this)[0]);
      brush.extent([value, value]);

      if (value !== undefined) {
        callback(value);
      }
    }
  };

  TorqueTimelineSlider.prototype.setupSlider = function(svg) {
    slider = svg.append("g")
      .attr("class", "slider")
      .call(brush);

    slider.selectAll(".extent,.resize").remove();
    slider.select(".background").attr("height", height);

    handle = slider.append("g")
      .attr("class", "handle")

    handle.append('svg:image')
      .attr('width', 16)
      .attr('height', 16)
      .attr('xlink:href', '/assets/svg/dragger2.svg')
      .attr('x', 0)
      .attr('y', 14);

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
