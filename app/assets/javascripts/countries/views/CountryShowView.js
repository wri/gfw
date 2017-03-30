define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'countries/views/CountryHeaderView',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/TreeCoverLossAlertsView',
  'countries/views/widgets/NearRealTimeAlertsView'
], function($,
  Backbone,
  _,
  Handlebars,
  mps,
  CountryHeaderView,
  TreeCoverView,
  TreeCoverLossView,
  TreeCoverLossAlertsView,
  NearRealTimeAlertsView) {

  'use strict';

  var CountryShowView = Backbone.View.extend({
    el: '#countryShowView',

    initialize: function(params) {
      this.iso = params.iso;
      this.modules = {
        snapshot: [],
        treeCoverLossAlerts: []
      };

      this.initHeader();
      this.initSnapshot();
      this.initCoverLossAlerts();
    },

    initHeader: function() {
      this.header = new CountryHeaderView({
        iso: this.iso
      });
    },

    initSnapshot: function() {
      this.modules.snapshot.push(new TreeCoverView({
        iso: this.iso
      }));

      this.modules.snapshot.push(new TreeCoverLossView({
        iso: this.iso
      }));

      this.modules.snapshot.push(new NearRealTimeAlertsView({
        iso: this.iso
      }));
    },

    initCoverLossAlerts: function() {
      this.modules.treeCoverLossAlerts.push(new TreeCoverLossAlertsView({
        iso: this.iso
      }));
    }

  });
  return CountryShowView;

});
