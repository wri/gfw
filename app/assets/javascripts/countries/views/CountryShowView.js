define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/NearRealTimeAlertsView'
], function($,
  Backbone,
  _,
  Handlebars,
  mps,
  TreeCoverView,
  TreeCoverLossView,
  NearRealTimeAlertsView) {

  'use strict';

  var CountryShowView = Backbone.View.extend({
    el: '#countryShowView',

    initialize: function(params) {
      this.iso = params.iso;
      this.modules = [];

      this.initSnapshot();
    },

    initSnapshot: function() {
      this.modules.push(new TreeCoverView({
        iso: this.iso
      }));

      this.modules.push(new TreeCoverLossView({
        iso: this.iso
      }));

      this.modules.push(new NearRealTimeAlertsView({
        iso: this.iso
      }));
    }

  });
  return CountryShowView;

});
