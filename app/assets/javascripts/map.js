/* eslint-disable */
/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'bluebird',
  'handlebars',
  'map/router',
  'views/SourceModalView',
  'views/ConfirmModalView',

  // we should merge these views with the ModalClass
  'views/SourceBottomView',
  'views/SourceMobileFriendlyView',

  // Should we get rid of them?
  'services/CountryService',
  'helpers/fallbackDataHelper',

  'map/views/MapView',
  'map/views/MapControlsView',
  'map/views/TabsView',
  'map/views/LayersNavView',
  'map/views/LegendView',
  'map/views/TimelineView',
  'map/views/NavMobileView',
  'map/views/GuideView',
  'map/views/controls/GuideButtonView',
  'map/views/ReactMapMiddleView',
  'views/HeaderView',
  'views/FooterView',
  'views/NotificationsView',
  'views/DownloadView'
], function(
  $,
  _,
  Class,
  Backbone,
  Promise,
  Handlebars,
  Router,
  SourceModalView,
  ConfirmModalView,
  SourceBottomView,
  SourceMobileFriendlyView,
  countryService,
  FallbackDataHelper,
  MapView,
  MapControlsView,
  TabsView,
  LayersNavView,
  LegendView,
  TimelineView,
  NavMobileView,
  GuideView,
  GuideButtonView,
  ReactMapMiddleView,
  HeaderView,
  FooterView,
  NotificationsView,
  DownloadView
) {
  var MapPage = Class.extend({
    $el: $('body'),

    init: function() {
      window.App = {
        Views: {}
      };
      var router = new Router(this);
      this._cartodbHack();
      this._handlebarsPlugins();
      this._googleMapsHelper();
      this._configPromise();
      this._fetchData();
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({ pushState: true });
      }
      window.dispatchEvent(new Event('mapLoaded'));
    },

    _fetchData: function() {
      // I was thinking that, without a map, an array of countries and an array of layers
      // we shouldn't create any view.
      countryService
        .getCountries()
        .then(
          function(results) {
            this.countries = results;
            this._initViews();
          }.bind(this)
        )
        .catch(
          function(e) {
            console.warn(e);
            // Fallback when request is timing out
            this.countries = FallbackDataHelper.getCountryNames();
            this._initViews();
          }.bind(this)
        );
    },
    /**
     * Initialize Application Views.
     * CAUTION: Don't change the order of initanciations if
     * you are not completely sure.
     */
    _initViews: function() {
      var map = new MapView();
      this.map = map.map;

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
      window.App.Views.ReactMapMiddleView = new ReactMapMiddleView(this.map);

      this._initApp();
    },

    /**
     * Cartodb Handlebars hack.
     */
    _cartodbHack: function() {
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars:
          typeof Handlebars === 'undefined' ? null : Handlebars.compile
      });
    },

    _handlebarsPlugins: function() {
      Handlebars.registerHelper('firstLetter', function(text) {
        return text.charAt(0).toUpperCase();
      });

      Handlebars.registerHelper('ifCond', function(v1, operator, v2, options) {
        switch (operator) {
          case '==':
            return v1 == v2 ? options.fn(this) : options.inverse(this);
          case '===':
            return v1 === v2 ? options.fn(this) : options.inverse(this);
          case '!==':
            return v1 !== v2 ? options.fn(this) : options.inverse(this);
          case '<':
            return v1 < v2 ? options.fn(this) : options.inverse(this);
          case '<=':
            return v1 <= v2 ? options.fn(this) : options.inverse(this);
          case '>':
            return v1 > v2 ? options.fn(this) : options.inverse(this);
          case '>=':
            return v1 >= v2 ? options.fn(this) : options.inverse(this);
          case '&&':
            return v1 && v2 ? options.fn(this) : options.inverse(this);
          case '||':
            return v1 || v2 ? options.fn(this) : options.inverse(this);
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
        };
      }
    },

    _configPromise: function() {
      Promise.config({
        // Enable warnings
        warnings: false,
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
