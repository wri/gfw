/**
 * The TabsView view.
 *
 * @return TabsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'd3',
  'map/presenters/tabs/SpinnerPresenter',

], function(_, Handlebars, d3, Presenter) {

  'use strict';

  function arcTween(transition, newAngle, arc) {
      var τ = 2 * Math.PI;
      transition.attrTween("d", function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function(t) {
              d.endAngle = interpolate(t);
              return arc(d);
          };
      });
  }
  function tween(d, i, a) {
    return d3.interpolateString("rotate(0)", "rotate(1080)");
  }

  var SpinnerView = Backbone.View.extend({
    el: '#tab-spinner',

    events: {
      'click #spinner2-close' : 'cancel'
    },

    initialize: function(){
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function(){
      var $spinner = this.$el.find('#spinner2');
      var τ = 2 * Math.PI;
      var width = $spinner.width() || 50;
      var height = $spinner.height() || 50;
      this.arc = d3.svg.arc()
          .innerRadius(width/2 - 5)
          .outerRadius(width/2)
          .startAngle(0);

      var svg = d3.selectAll($spinner.toArray()).insert("svg", ":first-child")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate(-90)")
      // Add the background arc, from 0 to 100% (τ).
      var background = svg.append("path")
          .datum({endAngle: τ})
          .style("fill", "#fff")
          .style("stroke", "#ccc")
          .attr("d", this.arc);

      // Add the foreground arc in orange, currently showing 12.7%.
      var foreground = svg.append("path")
          .attr('class', 'foreground')
          .datum({endAngle: 0.25 * τ})
          .style("fill", "#555")
          .attr("d", this.arc);
    },

    start: function(){
      this.$el.addClass('active');
      this.$foreground = this.$el.find('.foreground');
      this.count = 0;
      this.rotate();
    },

    rotate: function(){
      this.count++;
      var τ = 2 * Math.PI;
      // var w = (this.count%2 == 0) ? Math.random()*0.25 + 0.25 : Math.random()*0.75 + 0.5;
      // var w = this.count*0.1;
      var w = 0.25;
      d3.selectAll(this.$foreground.toArray())
          // .classed('current', current)
          .transition()
          .duration(2000)
          .ease("sin-in-out")
          .attrTween("transform", tween)
          // .call(arcTween, w * τ, this.arc)
          .each("end", _.bind(this.rotate, this));

    },

    stop: function(){
      this.$el.removeClass('active');
    },

    cancel: function() {
      this.presenter.cancel();
    }


  });

  return SpinnerView;

});
