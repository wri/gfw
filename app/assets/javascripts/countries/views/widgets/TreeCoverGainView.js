define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'helpers/numbersHelper',
  'text!countries/templates/widgets/treeCoverGain.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  View,
  mps,
  NumbersHelper,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET = '4baa763a-1e33-4c68-8c89-d23ee5033c58';
  var QUERY = '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' {region}';

  var TreeCoverGainView = View.extend({
    el: '#widget-tree-cover-gain',

    template: Handlebars.compile(tpl),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.$el.addClass('-loading');
          this.region = parseInt(value);
          this._getData().done(function(res) {
            this.data = res.data[0];
            this.render();
          }.bind(this));
        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
      this._getData().done(function(res) {
        this.data = res.data[0];
        this.render();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        value: NumbersHelper.addNumberDecimals(Math.round(this.data.value / 10000)),
        unit: 'Ha'
      }));
      this.$el.removeClass('-loading');
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        dataset: DATASET,
        iso: this.iso,
        region: this.region === 0 ? 'GROUP BY iso' : 'AND adm1 = '+this.region+' GROUP BY iso, adm1',
      });
      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverGainView;

});
