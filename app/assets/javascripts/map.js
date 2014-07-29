/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'router',
  'utils',
  'mps',
  'services/AnalysisService',
  'services/CountryService',
  'services/DataService',
  '_string'
], function ($, _, Class, Backbone, router, utils, mps, AnalysisService, CountryService, DataService) {

  'use strict';

  var MapPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._cartodbHack();
      this._setFixedLogo();
      this._initializeApp();

      // For dev
      window.router = router;
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

    /**
     * Set/unset fixed logo when scrolling bottom/top.
     */
    _setFixedLogo: function() {
      var $logo = this.$el.find('.header-nav__logo');
      var $window = $(window);

      function setScroll(e) {
        var element = (e) ? e.currentTarget : window;
        if (element.pageYOffset > 10) {
          $logo.addClass('is-fixed');
        } else {
          $logo.removeClass('is-fixed');
        }
      }

      setScroll();
      $window.on('scroll', setScroll);

      setTimeout(function() {
        $window.scrollTop(75);
      }, 100);
    }

  });

  new MapPage();

});
