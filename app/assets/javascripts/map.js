/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'utils',
  'router',
  'mps',
  'services/AnalysisService',
  'services/CountryService',
  'services/DataService',
  '_string'
], function ($, _, Class, Backbone, utils, Router, mps, AnalysisService, CountryService, DataService) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      _.bindAll(this, '_setWrapper', '_scrollBottom', '_setLogoPosition');
      this._cartodbHack();
      this._initializeApp();
      this._setWrapper();

      // For dev
      window.router = new Router();
      window.mps = mps;
      window.analysis = AnalysisService;
      window.countryService = CountryService;
      window.ds = DataService;
    },

    /**
     * Initialize the map by strating the history.
     */
    _initializeApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
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
