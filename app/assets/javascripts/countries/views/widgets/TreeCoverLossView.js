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

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET = 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea';
  var QUERY = '/query?sql=select sum(area) as value, year as date from {dataset} where thresh=30 and iso=\'{iso}\' group by year';
  var TreeCoverLossView = Backbone.View.extend({
    el: '#widget-tree-cover-loss',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.countryData = params.countryData;
      this._getData().done(this._initWidget.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        currentLoss: NumbersHelper.addNumberDecimals(Math.round(this.data[this.data.length-1].value)) || '',
        country: this.countryData
      }));
      this.$el.removeClass('-loading');
    },

    _initWidget: function(res) {
      this.data = []
      res.data.forEach(function(data) {
        if (data.value) {
          data.date = moment.utc(data.date, 'YYYY').endOf('year');
          this.data.push(data);
        }
      }.bind(this));
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
