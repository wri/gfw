require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'chosen',
  'map/utils',
  'mps',
  'bluebird',
  'handlebars',
  'connect/router',
  'connect/views/UserFormView',
  'connect/views/SubscriptionListView',
  'connect/views/StoriesListView',
  'connect/views/LoginView',
  'views/NotificationsView'
], function($, _, Class, Backbone, chosen, utils, mps, Promise, Handlebars, Router, UserFormView, SubscriptionListView, StoriesListView, LoginView, NotificationsView) {

  'use strict';

  var ConnectPage = Class.extend({

    el: $('.my-gfw-container'),

    init: function() {
      this.router = new Router(this);
      this.listeners();
      this._cartodbHack();
      this._handlebarsPlugins();
      this._googleMapsHelper();
      this._configPromise();
      this._initApp();
    },

    listeners: function() {
      this.router.on('route:myProfilePage', this.myProfilePage.bind(this));
      this.router.on('route:mySubscriptionsPage', this.mySubscriptionsPage.bind(this));
      this.router.on('route:myStoriesPage', this.myStoriesPage.bind(this));
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({
          root: '/my_gfw',
          pushState: true
        });
      }
    },

    /**
     * ROUTE PAGES
     * - myProfilePage
     * - mySubscriptionsPage
     * - myStoriesPage
     */
    myProfilePage: function() {
      // Remove if it exists
      if (!!this.userFormView) {
        this.userFormView.remove();
      }
      this.userFormView = new UserFormView();
      this.userFormView.render();

      this.el.html(this.userFormView.el);
      this.userFormView.delegateEvents();

      if (this.userFormView.show !== undefined) {
        this.userFormView.show();
      }
    },

    mySubscriptionsPage: function() {
      console.log(arguments);
      // Remove if it exists
      if (!!this.subscriptionListView) {
        this.subscriptionListView.remove();
      }
      this.subscriptionListView = new SubscriptionListView();
      this.subscriptionListView.render();

      this.el.html(this.subscriptionListView.el);
      this.subscriptionListView.delegateEvents();

      if (this.subscriptionListView.show !== undefined) {
        this.subscriptionListView.show();
      }
    },

    myStoriesPage: function() {
      // Remove if it exists
      if (!!this.storiesListView) {
        this.storiesListView.remove();
      }
      this.storiesListView = new StoriesListView();
      this.storiesListView.render();

      this.el.html(this.storiesListView.el);
      this.storiesListView.delegateEvents();

      if (this.storiesListView.show !== undefined) {
        this.storiesListView.show();
      }
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

  new ConnectPage();
});
