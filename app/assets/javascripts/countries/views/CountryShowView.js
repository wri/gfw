define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'countries/views/CountryHeaderView',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/AnnualTreeCoverLossView',
  'countries/views/widgets/TreeCoverGainView',
  'countries/views/widgets/TreeCoverReforestationView',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/TreeCoverLossAlertsView',
  'countries/views/widgets/FiresAlertsView',
  'countries/views/widgets/NearRealTimeAlertsView'
], function($,
  Backbone,
  _,
  Handlebars,
  mps,
  CountryHeaderView,
  TreeCoverView,
  AnnualTreeCoverLossView,
  TreeCoverGainView,
  TreeCoverReforestationView,
  TreeCoverLossView,
  TreeCoverLossAlertsView,
  FiresAlertsView,
  NearRealTimeAlertsView) {

  'use strict';

  var CountryShowView = Backbone.View.extend({
    el: '#countryShowView',

    initialize: function(params) {
      this.iso = params.iso;
      this.modules = {
        snapshot: [],
        treeCoverLoss: [],
        treeCoverGain: [],
        treeCoverLossAlerts: [],
        firesAlerts: [],
      };

      this.initHeader();
      this.initSnapshot();
      this.initTreeCoverLoss();
      this.initCoverGain();
      this.initCoverLossAlerts();
      this.initFiresAlerts();
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

    initTreeCoverLoss: function() {
      this.modules.treeCoverLoss.push(new AnnualTreeCoverLossView({
        iso: this.iso
      }));
    },

    initCoverGain: function() {
      this.modules.treeCoverGain.push(new TreeCoverGainView({
        iso: this.iso
      }));
      this.modules.treeCoverGain.push(new TreeCoverReforestationView({
        iso: this.iso
      }));
    },

    initCoverLossAlerts: function() {
      this.modules.treeCoverLossAlerts.push(new TreeCoverLossAlertsView({
        iso: this.iso
      }));
    },

    initFiresAlerts: function() {
      this.modules.firesAlerts.push(new FiresAlertsView({
        iso: this.iso
      }));
    },

  });
  return CountryShowView;

});
