define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'common/views/LineGraphView',
  'text!countries/templates/widgets/treeCoverLoss.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, NumbersHelper, LineGraphView, tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_NEW_API;
  var DATASET = '36dfec5c-61c5-4112-b332-1ab041663459';
  var QUERY = '/query/{dataset}?sql=select sum(area) as value, year from {dataset} WHERE iso = \'{iso}\' GROUP BY year';

  var TreeCoverLossView = Backbone.View.extend({
    el: '#widget-tree-cover-loss',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this._getData().done(this._initWidget.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        currentLoss: NumbersHelper.addNumberDecimals(this.data[this.data.length-1].value) || ''
      }));
    },

    _initWidget: function(res) {
      this.data = res.data;
      this.render();
      this.lineGraph = new LineGraphView({
        el: '#tree-cover-loss-graph',
        data: this.data,
        interpolate: 'basis'
      });
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        dataset: DATASET, iso: this.iso
      });

      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverLossView;

});
