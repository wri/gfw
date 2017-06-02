define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'core/View',
  'mps',
  'services/CountryService',
  'countries/views/CountryHeaderView',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/TreeCoverLossRankingView',
  'countries/views/widgets/AnnualTreeCoverLossView',
  'countries/views/widgets/TreeCoverGainView',
  'countries/views/widgets/TreeCoverReforestationView',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/TreeCoverLossAlertsView',
  'countries/views/widgets/FiresAlertsView',
  'countries/views/widgets/NearRealTimeAlertsView',
  'countries/views/widgets/MapCountry',
  'countries/helpers/StickyMap',
  'text!countries/templates/countryDashboard.handlebars'
], function($,
  Backbone,
  _,
  Handlebars,
  View,
  mps,
  CountryService,
  CountryHeaderView,
  TreeCoverView,
  TreeCoverLossRankingView,
  AnnualTreeCoverLossView,
  TreeCoverGainView,
  TreeCoverReforestationView,
  TreeCoverLossView,
  TreeCoverLossAlertsView,
  FiresAlertsView,
  NearRealTimeAlertsView,
  MapCountry,
  StickyMap,
  tpl) {

  'use strict';

  var CountryShowView = View.extend({
    el: '#countryShowView',

    template: Handlebars.compile(tpl),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.getDataRegions(value).then(function(results) {
            this.mapCountry = new MapCountry({
              iso: this.iso,
              countryData: results,
              region: true,
            });
          }.bind(this));
        }
      },
    ],

    initialize: function(params) {
      $('html,body').scrollTop(0);
      View.prototype.initialize.apply(this);
      this.region = 0;
      this.iso = params.iso;
      this.modules = {
        snapshot: [],
        treeCoverLoss: [],
        treeCoverGain: [],
        treeCoverLossAlerts: [],
        firesAlerts: [],
      };

      this.cache();
      this.render();

      this.getData().then(function(results) {
        this.data = results;
        this.start();
      }.bind(this));
    },

    cache: function() {
      this.$dashboard = this.$el.find('#countryDashboard');
    },

    getData: function() {
      return CountryService.showCountry({ iso: this.iso });
    },

    getDataRegions: function(value) {
      return CountryService.showRegion({ iso: this.iso, region: value });
    },

    render: function() {
      this.$dashboard.html(this.template({}));
      this.$el.removeClass('-loading');
      this.$dashboard.removeClass('-loading');
    },

    start: function() {
      this.initHeader();
      this.initSnapshot();
      this.initTreeCoverLoss();
      this.initCoverGain();
      this.initCoverLossAlerts();
      this.initFiresAlerts();
      this.initMapCountry();
      this.initStickyMap();
      this.listenTo(
         this.header,
         'updateUrl',
         this.updateUrl
      );
      this.$el.find('.widgets > .content').removeClass('-loading');
    },

    initHeader: function() {
      this.header = new CountryHeaderView({
        iso: this.iso,
        countryData: this.data
      });
    },

    initStickyMap: function() {
      this.stickyMap = new StickyMap();
    },

    initMapCountry: function() {
      this.mapCountry = new MapCountry({
        iso: this.iso,
        countryData: this.data,
        region: false,
      });
    },

    initSnapshot: function() {
      this.modules.snapshot.push(new TreeCoverView({
        iso: this.iso
      }));

      this.modules.snapshot.push(new TreeCoverLossRankingView({
        iso: this.iso
      }));

      this.modules.snapshot.push(new TreeCoverLossView({
        iso: this.iso,
        countryData: this.data
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
        iso: this.iso,
        latitude: JSON.parse(this.data.centroid).coordinates[0],
        longitude: JSON.parse(this.data.centroid).coordinates[1]
      }));
    },

    initFiresAlerts: function() {
      this.modules.firesAlerts.push(new FiresAlertsView({
        iso: this.iso
      }));
    },

    updateUrl: function() {
      this.trigger('updateUrl');
    },

  });
  return CountryShowView;

});
