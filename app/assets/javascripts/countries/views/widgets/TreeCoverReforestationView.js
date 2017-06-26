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
      if(countryOriginal) {
        var countryValue = countryOriginal.reforestation_rate;
        var unitMeasure;
        var unitReference = 1000;
        for (var i = 1; i <= 10; i++) {
          var limit = unitReference * i;
          if (countryValue <= limit && countryValue >= limit - unitReference) {
            unitMeasure = limit / 10;
          }
        }

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

        console.log(this.totalCountry);

        this.$el.html(this.template({
          data: dataTemplateCountry,
          unitMeasure: unitMeasure,
          totalReforestation: this.totalCountry,
          unitTotal: 'thousand'
        }));
      } else {
        this.$el.html(this.template({
          data: null,
          unitMeasure: null,
          totalReforestation: null,
          unitTotal: null
        }));
      }

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
