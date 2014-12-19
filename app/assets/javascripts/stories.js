/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'mps',
  'jqueryujs',
  'jqueryui',
  'jquery_migrate',
  'jquery_fileupload',
  'geojson',
  'views/HeaderView',
  'views/FooterView',
  'stories/views/StoriesEditView',
  'stories/views/CarrouselStoriesView',
  'handlebars',
  '_string',
], function($, _, Class, Backbone, mps, jqueryujs, jqueryui, jquery_migrate, jquery_fileupload, geojson, HeaderView, FooterView, StoriesEditView, CarrouselStoriesView, Handlebars) {
  'use strict';

  var StoriesPage = Class.extend({

    $el: $('body'),

    init: function() {
      this._initViews();
    },

    /**
     * Initialize Landing Views.
     */
    _initViews: function() {
      //shared
      new HeaderView();
      new FooterView();
      new StoriesEditView();
      new CarrouselStoriesView();
    }
  });

  new StoriesPage();

});