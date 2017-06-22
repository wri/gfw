define([
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'core/View',
  'mps',
  'moment'
], function(
  Backbone,
  _,
  Handlebars,
  d3,
  View,
  mps,
  moment
) {

  'use strict';

  var ChangeLineGraph = View.extend({

    defaults: {
      dataSvg: [],
    },

    _subscriptions: [
      {
        'Line/data': function(data) {
          this.defaults.dataSvg.push({
            data: data,
          })
        }
      },

      {
        'Line/update': function(position, data) {
          var svgContainer = null;
          var circle = null;
          for (var i = 0; i < this.defaults.dataSvg.length; i++) {
            svgContainer = $('.svg-'+this.defaults.dataSvg[i].data[0].cid);
            circle = svgContainer.find('.dot');
            $(circle).attr("cx", this.defaults.dataSvg[i].data[0].xValues[position]);
            $(circle).attr("cy", this.defaults.dataSvg[i].data[0].yValues[position]);
            $('#alert-value-'+i).html(data[i].data[position].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
          }
        }
      },

      {
        'Line/restart': function(data) {
          var svgContainer = null;
          var circle = null;
          for (var i = 0; i < this.defaults.dataSvg.length; i++) {
            svgContainer = $('.svg-'+this.defaults.dataSvg[i].data[0].cid);
            circle = svgContainer.find('.dot');
            $(circle).attr("cx", this.defaults.dataSvg[i].data[0].xValues[this.defaults.dataSvg[i].data[0].xValues.length-1]);
            $(circle).attr("cy", this.defaults.dataSvg[i].data[0].yValues[this.defaults.dataSvg[i].data[0].yValues.length-1]);
            $('#alert-value-'+i).html(data[i].data[this.defaults.dataSvg[i].data[0].yValues.length-1].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
          }
        }
      },

      {
        'Line/clean': function(restart) {
          this.defaults.dataSvg = [];
        }
      },
    ],

    initialize: function() {
      View.prototype.initialize.apply(this);
    },

  });

  return ChangeLineGraph;

});
