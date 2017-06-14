define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'services/CountryService',
], function($, Backbone, _, Handlebars, UriTemplate, View, mps, CountryService) {

  'use strict';

  var AreasCountries = View.extend({

    status: new (Backbone.Model.extend({
      defaults: {
        container: '',
        totalNumber: null
      }
    })),

    initialize: function(params) {
      this._getAreas(params.totalNumber, params.container, params.random);
    },

    _getAreas: function(totalNumber, container, random) {
      var $deferred = $.Deferred();
      var areas = null;
      var total = totalNumber.toString();
      total = parseInt(total.replace(/,/g , ''));
      var countryName = '';
      this.getCountriesAreas(true)
        .done(function(results) {
            areas = results.data;
            var listAreas = [];
            for (var i = 0; i < areas.length; i++) {
              listAreas[i] = parseInt(areas[i].area_ha);
            }
            var closest = Math.max.apply(null, listAreas);
            if (!random) {
              for (var i = 0; i < areas.length; i++) {
                if (parseInt(areas[i].area_ha) >= total && parseInt(areas[i].area_ha) < closest) {
                  closest = parseInt(areas[i].area_ha);
                  countryName = areas[i].name;
                }
              }
                $(container).html(countryName);
            } else {
              var randomArray = [];
              var countryInfo = null;
              for (var i = 0; i < areas.length; i++) {
                if (parseInt(areas[i].area_ha) > total) {
                  randomArray.push({
                    number: parseInt(areas[i].area_ha),
                    country: areas[i].name,
                  });
                }
              }
              countryInfo = _.sample(randomArray, 1);
              if (countryInfo[0]) {
                $(container).html('(Aprox.: '+Math.round((countryInfo[0].number / total))+' times the extent of '+countryInfo[0].country+' )');
              }
            }
            return $deferred.resolve();

        }.bind(this))
        return $deferred;
    },

    getCountriesAreas: function(showArea) {
      return CountryService.showCountry(
        {
           iso: '',
           showArea: showArea
         }
       );
    },

  });
  return AreasCountries;

});
