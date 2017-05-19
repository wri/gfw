define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'text!countries/templates/countryHeader.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  tpl) {

  'use strict';

  var CountryHeaderView = Backbone.View.extend({
    el: '#country-header',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.countryData = params.countryData;
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.countryData));
    },
  });
  return CountryHeaderView;

});
