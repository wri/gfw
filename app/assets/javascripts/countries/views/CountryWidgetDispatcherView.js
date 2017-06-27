/**
 * The Country Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'services/CountryService',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/TreeCoverLossRankingView',
  'countries/views/widgets/AnnualTreeCoverLossView',
  'countries/views/widgets/TreeCoverReforestationView',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/TreeCoverLossAlertsView',
  'countries/views/widgets/FiresAlertsView',
  'countries/views/widgets/NearRealTimeAlertsView',

], function($,
  Backbone,
  _,
  Handlebars,
  CountryService,
  TreeCoverView,
  TreeCoverLossRankingView,
  AnnualTreeCoverLossView,
  TreeCoverReforestationView,
  TreeCoverLossView,
  TreeCoverLossAlertsView,
  FiresAlertsView,
  NearRealTimeAlertsView) {

  'use strict';

  var CountryWidgetDispatcherView = Backbone.View.extend({
    el: '.js-country-embed-widget',

    initialize: function(options) {
      this.widget = options.widget;
      this.iso = options.iso;
      this.region = options.region !== null ? options.region : 0;

      if(this.region !== 0){
        this._getDataRegions().then(function(results) {
          this.data = results;
          this._loadWidget();
        }.bind(this));
      } else {
        this._getData().then(function(results) {
          this.data = results;
          this._loadWidget();
        }.bind(this));
      }
    },

    _getData: function() {
      return CountryService.showCountry({ iso: this.iso });
    },

    _getDataRegions: function() {
      return CountryService.showRegion({ iso: this.iso, region: this.region });
    },

    _loadWidget: function () {
      switch (this.widget) {
        case 'summary':
          new TreeCoverView({
            iso: this.iso,
            region: this.region
          });

          new TreeCoverLossRankingView({
            iso: this.iso,
            region: this.region
          });

          new TreeCoverLossView({
            iso: this.iso,
            region: this.region,
            countryData: this.data
          });

          new NearRealTimeAlertsView({
            iso: this.iso,
            region: this.region
          });
          break;
        case 'snap_tree_cover':
          new TreeCoverView({
            iso: this.iso,
            region: this.region
          });

          new TreeCoverLossRankingView({
            iso: this.iso,
            region: this.region
          });
          break;
        case 'snap_tree_cover_loss':
        case 'alerts':
          new TreeCoverLossView({
            iso: this.iso,
            region: this.region,
            countryData: this.data
          });
          break;
        case 'tree_cover_loss':
        case 'loss_outside_plantations':
          new AnnualTreeCoverLossView({
            iso: this.iso,
            region: this.region
          });
          break;
        case 'near_real_time_alerts':
          new NearRealTimeAlertsView({
            iso: this.iso,
            region: this.region
          });
          break;
        case 'tree_cover_gain':
          break;
        case 'tree_cover_reforestation':
        case 'reforestation':
          new TreeCoverReforestationView({
            iso: this.iso,
            region: this.region
          });
          break;
        case 'tree_cover_loss_alerts':
          new TreeCoverLossAlertsView({
            iso: this.iso,
            region: this.region,
            latitude: JSON.parse(this.data.centroid).coordinates[0],
            longitude: JSON.parse(this.data.centroid).coordinates[1]
          });
          break;
        case 'fire_alerts':
          new FiresAlertsView({
            iso: this.iso,
            region: this.region
          });
          break;
      }

      this._removeLoadingStatus();
    },

    _removeLoadingStatus: function () {
      this.$el.removeClass('-loading');
    }
  });

  return CountryWidgetDispatcherView;
});
