define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'core/View',
  'mps',
  'services/CountryService',
  'text!countries/templates/countryHeader.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  View,
  mps,
  CountryService,
  tpl) {

  'use strict';

  var CountryHeaderView = View.extend({
    el: '#country-header',
    template: Handlebars.compile(tpl),

    events: {
      'change #areaSelector': 'changeRegion',
    },

    initialize: function(params) {
      this.iso = params.iso;
      this.region = params.region;
      this.countryData = params.countryData;
      this.cache();
      this.addRegions(params.iso);
    },

    cache: function() {
      this.$regionField = this.$el.find('#areaSelector');
    },

    addRegions: function(country) {
      var data = [];
      CountryService.getRegionsList({ iso: country })
        .then(function(results) {
          for ( var i = 0; i < results.length; i++) {
            data[i] = {
              name: results[i].name_1,
              id: results[i].id_1,
              selected: results[i].id_1 === parseInt(this.region),
            }
          }
          this.regions = data;
          this.render();
        }.bind(this))
    },

    changeRegion: function() {
      var value = $('#areaSelector').val();
      mps.publish('Regions/update', [value, this.iso]);
      this.trigger('updateUrl');
    },

    getData: function(showArea) {
      return CountryService.showCountry(
        {
           iso: this.iso,
           showArea: showArea
         }
       );
    },

    render: function() {
      this.getData(false).then(function(results) {
        this.dataCountry = results;
        this.$el.html(this.template({
          name: this.dataCountry.name,
          placeholder: 'Select a jurisdiction',
          regions: this.regions
        }));
      }.bind(this));
    },
  });
  return CountryHeaderView;

});
