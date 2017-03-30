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

      this.getData();
    },

    getData: function() {
      CountryService.showCountry({ iso: this.iso })
        .then(function(results) {
          this.data = results;
          this.render();
        }.bind(this));
    },

    render: function() {
      this.$el.html(this.template(this.data));
    }
  });
  return CountryHeaderView;

});
