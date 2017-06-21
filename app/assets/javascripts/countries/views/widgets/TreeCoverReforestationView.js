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
  var QUERY = 'SELECT name, iso, reforestation_rate FROM gfw2_countries WHERE reforestation_rate IS NOT NULL ORDER BY reforestation_rate DESC LIMIT 3';

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
        this.data = res.rows;
        this.render();
      }.bind(this));
    },

    render: function() {
      var value = 0;
      var unitMeasure = 200;
      var iconsNumber = 0;
      var dataTemplate = [];

      for (var i = 0; i < this.data.length; i++) {
        value = Math.round(this.data[i].reforestation_rate);
        iconsNumber = value / unitMeasure;
        dataTemplate.push({
          hasData: value || false,
          value: value,
          index: i + 1,
          unit: 'thousand',
          name: this.data[i].name,
          icons: {
            number: _.range(Math.floor(iconsNumber)),
            percentage: iconsNumber % 1
          },
          iso: this.data[i].iso
        })
      }

      this.$el.html(this.template({
        data: dataTemplate,
        unitMeasure: unitMeasure,
      }));

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
