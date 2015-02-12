/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'chosen',
  'map/utils',
  'mps',
  'map/router',
  'map/presenters/ExperimentsPresenter',
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
  'map/views/ToggleWidgetsView',
  'views/HeaderView',
  'views/FooterView',
  'views/DialogView',
  '_string'
], function($, _, Class, Backbone, chosen, utils, mps, Router,ExperimentsPresenter, AnalysisService, CountryService, DataService,
    LayersNavView, MapView, LegendView, ThresholdView, SearchboxView, MaptypeView, TimelineView,
    AnalysisToolView, AnalysisResultsView, ShareView, ToggleWidgetsView,HeaderView, FooterView, DialogView) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      var router = new Router(this);
      this._cartodbHack();
      this._initViews();
      this._initApp();

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
     * CAUTION: Don't change the order of initanciations if
     * you are not completely sure.
     */
    _initViews: function() {
      // Google Experiments
      new ExperimentsPresenter();


      var mapView = new MapView();

      new LayersNavView();
      new LegendView();
      new MaptypeView();
      new SearchboxView();
      new ThresholdView();
      new AnalysisToolView(mapView.map);
      new TimelineView();
      new AnalysisResultsView();
      new ShareView();
      new FooterView();
      new HeaderView();
      new DialogView();
      new ToggleWidgetsView();

      // TODO => This is temporary!!! We will use the refactored
      // and awesome DialogView later.
      window.infowindow();
    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },

  });

  new MapPage();

});
