/**
 * The router module.
 *
 * Router handles app routing and URL parameters and updates Presenter.
 *
 * @return singleton instance of Router class (extends Backbone.Router).
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'mps',
  'amplify',
  'services/PlaceService',
  'views/LayersNavView',
  'views/MapView',
  'views/LegendView',
  'views/ThresholdView',
  'views/SearchboxView',
  'views/MaptypeView',
  'views/TimelineView',
  'views/AnalysisToolView',
  'views/AnalysisResultsView',
  'views/ShareView',
], function($, _, Backbone, mps, amplify, PlaceService, LayersNavView, MapView, LegendView,
    ThresholdView, SearchboxView, MaptypeView, TimelineView, AnalysisToolView, AnalysisResultsView,
    ShareView) {

  'use strict';

  var Router = Backbone.Router.extend({

    routes: {
      'map(/:zoom)(/:lat)(/:lng)(/:iso)(/:maptype)(/:baselayers)(/:sublayers)(/)': 'map',
    },

    initialize: function() {
      this.bind('all', this._checkForCacheBust());
      this.placeService = new PlaceService(this);
    },

    map: function(zoom, lat, lng, iso, maptype, baselayers, sublayers) {
      var params = _.extend({
        zoom: zoom,
        lat: lat,
        lng: lng,
        iso: iso,
        maptype: maptype,
        baselayers: baselayers,
        sublayers: sublayers
      }, _.parseUrl());

      if (!this.mapView) {
        this.layersNavView = new LayersNavView();
        this.mapView = new MapView();
        this.legendView = new LegendView();
        this.maptypeView = new MaptypeView();
        this.searchboxView = new SearchboxView();
        this.thresholdView = new ThresholdView();
        this.timelineView = new TimelineView();
        this.analysisToolView = new AnalysisToolView(this.mapView.map);
        this.analysisResultsView = new AnalysisResultsView();
        this.shareView = new ShareView();
      }

      this.placeService.publishPlace(params);
    },

    /**
     * If the URL contains the cache parameter (e.g., cache=bust), clear all
     * cached values in the browser (e.g., from memory, local storage,
     * session).
     */
    _checkForCacheBust: function() {
      var params = _.parseUrl();

      if (_.has(params, 'cache')) {
        _.each(amplify.store(), function(value, key) {
          amplify.store(key, null);
        });
      }
    },

    navigateTo: function() {
      this.navigate('map/{0}'.format(this.route), {silent: true});
    }

  });

  var router = new Router();

  return router;

});
