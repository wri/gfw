define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'text!countries/templates/widgets/treeCoverReforestation.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, View, mps, tpl) {

  'use strict';

  var API = 'https://wri-01.cartodb.com/api/v2/sql?q='
  var QUERY = 'SELECT reforestation_rate FROM gfw2_countries WHERE iso=\'{iso}\'';

  var TreeCoverLossView = View.extend({
    el: '#widget-tree-cover-reforestation',

    template: Handlebars.compile(tpl),

    _subscriptions:[
      {
        'Regions/update': function(value) {

        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.start();
    },

    start: function() {
      this._getData().done(function(res) {
        this.data = res.rows[0];
        this.render();
      }.bind(this));
    },

    render: function() {
      var value = Math.round(this.data.reforestation_rate);
      var unitMeasure = 20;
      var iconsNumber = value / unitMeasure;

      this.$el.html(this.template({
        hasData: value || false,
        value: value,
        unit: 'thousand',
        unitMeasure: unitMeasure,
        icons: {
          number: _.range(Math.floor(iconsNumber)),
          percentage: iconsNumber % 1
        },
        iso: this.iso
      }));
      // $('#widget-tree-cover-reforestation').removeClass('-loading')
      // this.$el.removeClass('-loading');
      document.getElementById('widget-tree-cover-reforestation').classList.remove('-loading');
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        iso: this.iso
      });

      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverLossView;

});
