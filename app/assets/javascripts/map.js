/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'utils',
  'mps',
  'map/router',
  'map/services/AnalysisService',
  'map/services/CountryService',
  'map/services/DataService',
  'map/views/LayersNavView',
  'map/views/MapView',
  'map/views/LegendView',
  'map/views/ThresholdView',
  'map/views/SearchboxView',
  'map/views/MaptypeView',
  'map/views/TimelineView',
  'map/views/AnalysisToolView',
  'map/views/AnalysisResultsView',
  'map/views/ShareView',
  '_string'
], function($, _, Class, Backbone, utils, mps, Router, AnalysisService, CountryService, DataService,
    LayersNavView, MapView, LegendView, ThresholdView, SearchboxView, MaptypeView, TimelineView,
    AnalysisToolView, AnalysisResultsView, ShareView) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      _.bindAll(this, '_scrollBottom', '_setLogoPosition');

      var router = new Router();
      this._cartodbHack();
      this._initViews();
      this._initApp();
      this._setWrapper();

      // For dev
      window.router = router;
      window.mps = mps;
      window.analysis = AnalysisService;
      window.countryService = CountryService;
      window.ds = DataService;
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
    },

    /**
     * Initialize Application Views.
     */
    _initViews: function() {
      var mapView = new MapView();
      new LayersNavView();
      new LegendView();
      new MaptypeView();
      new SearchboxView();
      new ThresholdView();
      new TimelineView();
      new AnalysisResultsView();
      new AnalysisToolView(mapView.map);
      new ShareView();
    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },

    _setWrapper: function() {
      this.$window = $(window);
      this.$logo = this.$el.find('.brand');

      this.$window.on('scroll', this._setLogoPosition);
      this.$window.on('resize', this._scrollBottom);

      _.debounce(this._scrollBottom, 100)();
      _.debounce(this._scrollBottom, 1200)(); // for safety
      this._setLogoPosition();
    },

    /**
     * Scroll to bottom.
     */
    _scrollBottom: function() {
      this.$window.scrollTop(116);
    },

    /**
     * Toggle layer class is-fixed.
     *
     * @param {object} e Window event
     */
    _setLogoPosition: function(e) {
      var element = (e) ? e.currentTarget : window;
      if (element.pageYOffset > 48) {
        this.$logo.addClass('is-fixed');
      } else {
        this.$logo.removeClass('is-fixed');
      }
    }

  });

  new MapPage();

});
