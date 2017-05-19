define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'services/CountryService',
  'text!countries/templates/countryHeader.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  CountryService,
  tpl) {

  'use strict';

  var CountryHeaderView = Backbone.View.extend({
    el: '#country-header',
    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.countryData = params.countryData;
      this.render();
      this.cache();
      this.addRegions(params.iso);
    },

    cache: function() {
      this.$regionField = this.$el.find('#areaSelector');
    },

    addRegions: function(country) {
      CountryService.getRegionsList({ iso: country })
        .then(function(results) {
          this.regions = results;
          this.renderRegions();
        }.bind(this))
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
