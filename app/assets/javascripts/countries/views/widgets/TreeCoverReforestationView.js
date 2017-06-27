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
  var QUERY = 'SELECT name, iso, reforestation_rate FROM gfw2_countries WHERE reforestation_rate IS NOT NULL ORDER BY reforestation_rate DESC';
  var QUERYCOUNTRY = 'SELECT name, iso, reforestation_rate reforestation_rate FROM gfw2_countries WHERE iso=\'{iso}\'';

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
        this._getDataCountry().done(function(resCountry) {
          this.totalCountry = resCountry.rows[0].reforestation_rate;
          this.data = res.rows;
          this.render();
        }.bind(this))
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        totalReforestation: this.totalCountry,
      }));
      $('#widget-tree-cover-reforestation').removeClass('-loading');
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        iso: this.iso
      });

      return $.ajax({
        url: url,
        type: 'GET'
      });
    },

    _getDataCountry: function() {
      var url = API + new UriTemplate(QUERYCOUNTRY).fillFromObject({
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
