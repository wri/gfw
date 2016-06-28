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
  'enquire',
  'mps',
  'handlebars',
  'map/router',
  'views/SourceModalView',
  'views/ConfirmModalView',
  // we should merge these views with the ModalClass
  'views/SourceBottomView',
  'views/SourceMobileFriendlyView',

  'map/collections/CountryCollection',  
  'map/presenters/ExperimentsPresenter',
  'map/services/AnalysisService',
  'map/services/CountryService',
  'map/services/DataService',
  'map/views/MapView',
  'map/views/MapControlsView',
  'map/views/TabsView',
  'map/views/analysis/AnalysisResultsView',
  'map/views/LayersNavView',
  'map/views/LegendView',
  'map/views/TimelineView',
  'map/views/NavMobileView',
  'map/views/GuideView',
  'map/views/controls/GuideButtonView',
  'connect/views/UserFormModalView',
  'views/HeaderView',
  'views/FooterView',
  'views/NotificationsView',
  'views/DownloadView',
  '_string'
], function($, _, Class, Backbone, chosen, utils, enquire, mps, Handlebars, Router, SourceModalView, ConfirmModalView, SourceBottomView, SourceMobileFriendlyView, CountryCollection, ExperimentsPresenter, AnalysisService, CountryService, DataService, MapView,
    MapControlsView, TabsView, AnalysisResultsView, LayersNavView, LegendView, TimelineView, NavMobileView, GuideView, GuideButtonView, UserFormModalView, HeaderView, FooterView, NotificationsView, DownloadView) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      var router = new Router(this);
      this._cartodbHack();
      this._handlebarsPlugins()
      this._initViews();

      // // For dev
      // window.router = router;
      // window.mps = mps;
      // window.analysis = AnalysisService;
      // window.countryService = CountryService;
      // window.ds = DataService;
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

      var map = new MapView();

      this.map = map.map;
      this.countries = new CountryCollection();
      
      new MapControlsView(this.map, this.countries);
      new TabsView(this.map, this.countries);
      new AnalysisResultsView(this.map, this.countries);
      new LayersNavView(this.map, this.countries);
      new LegendView(this.map, this.countries);
      new TimelineView(this.map, this.countries);
      new NavMobileView(this.map, this.countries);
      new FooterView(this.map, this.countries);
      new HeaderView(this.map, this.countries);
      new SourceModalView(this.map, this.countries);
      new ConfirmModalView(this.map, this.countries);
      new SourceBottomView(this.map, this.countries);
      new SourceMobileFriendlyView(this.map, this.countries);
      new NotificationsView(this.map, this.countries);
      new GuideView(this.map, this.countries);
      new GuideButtonView(this.map, this.countries);  

      // Init views
      this.countries.fetch().done(function(){
        this._initApp();
      }.bind(this))

      // What is this? Are we already using it?
      $('body').append(new UserFormModalView().el);
    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },

    _handlebarsPlugins: function() {
      Handlebars.registerHelper('firstLetter', function(text) {
        return text.charAt(0).toUpperCase();
      });

      Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
          case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
        }
      });
    }

  });

  new MapPage();

});
