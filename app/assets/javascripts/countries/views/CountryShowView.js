define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/NearRealTimeAlertsView'
], function($,
  Backbone,
  _,
  Handlebars,
  mps,
  TreeCoverLossView,
  NearRealTimeAlertsView) {

  'use strict';

  var CountryShowView = Backbone.View.extend({
    el: '#countryShowView',

    initialize: function(params) {
      this.iso = params.iso;

      new TreeCoverLossView({
        iso: this.iso
      });

      new NearRealTimeAlertsView({
        iso: this.iso
      });
    }

  });
  return CountryShowView;

});
