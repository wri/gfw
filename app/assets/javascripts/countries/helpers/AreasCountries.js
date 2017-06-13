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
      this._getAreas(params.totalNumber, params.container);
    },

    _getAreas: function(totalNumber, container) {
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
          for (var i = 0; i < areas.length; i++) {
            if (parseInt(areas[i].area_ha) >= total && parseInt(areas[i].area_ha) < closest) {
              closest = parseInt(areas[i].area_ha);
              countryName = areas[i].name;
            }
          }
          $(container).html(countryName);
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
