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
      var value = 0;
      var unitMeasure = 100;
      var iconsNumber = 0;
      var dataTemplate = [];
      var dataTemplateCountry = [];

      var countryOriginal = _.findWhere(this.data, {iso: this.iso});
      var countryValue = countryOriginal.reforestation_rate;

      if (countryValue <= 1000 && countryValue >= 0) { unitMeasure = 100; }
      if (countryValue <= 2000 && countryValue >= 1000) { unitMeasure = 200; }
      if (countryValue <= 3000 && countryValue >= 2000) { unitMeasure = 300; }
      if (countryValue <= 4000 && countryValue >= 3000) { unitMeasure = 400; }
      if (countryValue <= 5000 && countryValue >= 4000) { unitMeasure = 500; }
      if (countryValue <= 6000 && countryValue >= 5000) { unitMeasure = 600; }
      if (countryValue <= 7000 && countryValue >= 6000) { unitMeasure = 700; }
      if (countryValue <= 8000 && countryValue >= 7000) { unitMeasure = 800; }
      if (countryValue <= 9000 && countryValue >= 8000) { unitMeasure = 900; }
      if (countryValue <= 10000 && countryValue >= 9000) { unitMeasure = 1000; }

      for (var i = 0; i < this.data.length; i++) {
        value = Math.round(this.data[i].reforestation_rate);
        iconsNumber = value / unitMeasure;
        dataTemplate.push({
          hasData: value || false,
          value: value,
          index: i,
          position: i + 1,
          unit: 'thousand',
          name: this.data[i].name,
          icons: {
            number: _.range(Math.floor(iconsNumber)),
            percentage: iconsNumber % 1
          },
          iso: this.data[i].iso
        })
      }
      var country = _.findWhere(dataTemplate, {iso: this.iso});
      var countryPosition = country.index;
      switch (countryPosition) {
        case 0:
          dataTemplateCountry[0] = dataTemplate[countryPosition];
          dataTemplateCountry[1] = dataTemplate[countryPosition + 1];
          dataTemplateCountry[2] = dataTemplate[countryPosition + 2];
          break;
        case dataTemplate.length - 1:
          dataTemplateCountry[0] = dataTemplate[countryPosition - 2];
          dataTemplateCountry[1] = dataTemplate[countryPosition - 1];
          dataTemplateCountry[2] = dataTemplate[countryPosition];
          break;
        default:
          dataTemplateCountry[0] = dataTemplate[countryPosition - 1];
          dataTemplateCountry[1] = dataTemplate[countryPosition];
          dataTemplateCountry[2] = dataTemplate[countryPosition + 1];
      }

      this.$el.html(this.template({
        data: dataTemplateCountry,
        unitMeasure: unitMeasure,
        totalReforestation: this.totalCountry,
        unitTotal: 'thousand'
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
