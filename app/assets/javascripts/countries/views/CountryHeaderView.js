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
      this.render();
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
          this.renderRegions();
        }.bind(this))
    },

    changeRegion: function() {
      var value = $('#areaSelector').val();
      mps.publish('Regions/update', [value]);
      this.trigger('updateUrl');
    },

    renderRegions: function() {
      this.$regionField.html(this.template({
        placeholder: 'Select a jurisdiction',
        regions: this.regions
      }));
    },

    render: function() {
      this.$el.html(this.template(this.countryData));
    },
  });
  return CountryHeaderView;

});
