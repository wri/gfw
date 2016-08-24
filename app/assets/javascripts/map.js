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
  'bluebird',
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

  // Should we get rid of them?
  'map/services/CountryService',
  'map/services/DataService',
  //
  'map/views/MapView',
  'map/views/MapControlsView',
  'map/views/TabsView',
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
], function($, _, Class, Backbone, chosen, utils, enquire, mps, Promise, Handlebars, Router, SourceModalView, ConfirmModalView, SourceBottomView, SourceMobileFriendlyView, CountryCollection, ExperimentsPresenter, AnalysisService, countryService, DataService, MapView,
    MapControlsView, TabsView, LayersNavView, LegendView, TimelineView, NavMobileView, GuideView, GuideButtonView, UserFormModalView, HeaderView, FooterView, NotificationsView, DownloadView) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      var router = new Router(this);
      this._cartodbHack();
      this._handlebarsPlugins();
      this._googleMapsHelper();
      this._configPromise();
      this._initViews();
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

      // I was thinking that, without a map, an array of countries and an array of layers
      // we shouldn't create any view.
      countryService.get().then(function(results) {
        this.map = map.map;
        this.countries = _.where(results.countries, {
          enabled: true
        });

        new MapControlsView(this.map, this.countries);
        new TabsView(this.map, this.countries);
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

        this._initApp();

      }.bind(this));


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
    },

    _googleMapsHelper: function() {
      if (!google.maps.Polygon.prototype.getBounds) {
        google.maps.Polygon.prototype.getBounds = function() {
          var bounds = new google.maps.LatLngBounds();
          var paths = this.getPaths();
          var path;        
          for (var i = 0; i < paths.getLength(); i++) {
            path = paths.getAt(i);
            for (var ii = 0; ii < path.getLength(); ii++) {
              bounds.extend(path.getAt(ii));
            }
          }
          return bounds;
        }
      }
    },

    _configPromise: function() {
      Promise.config({
          // Enable warnings
          warnings: true,
          // Enable long stack traces
          longStackTraces: true,
          // Enable cancellation
          cancellation: true,
          // Enable monitoring
          monitoring: true
      });
    }

  });

  new MapPage();

});
