define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'helpers/numbersHelper',
  'common/views/LineGraphView',
  'text!countries/templates/widgets/treeCoverLoss.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, View, mps, NumbersHelper, LineGraphView, tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET = 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea';
  var QUERY = '/query?sql=select sum(area) as value, year as date from {dataset} where thresh=30 and iso=\'{iso}\' {region}';

  var TreeCoverLossView = View.extend({
    el: '#widget-tree-cover-loss',

    template: Handlebars.compile(tpl),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.region = parseInt(value);
          this.$el.addClass('-loading');
          this._getData().done(this._initWidget.bind(this));
        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
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
        dataset: DATASET, iso: this.iso, region: this.region === 0 ? 'GROUP BY year' : 'AND adm1 = '+this.region+' GROUP BY year, adm1'
      });
      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverLossView;

});
