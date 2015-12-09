/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'handlebars',
  'mps',
  'views/HeaderView',
  'views/FooterView',
  'views/SourceMobileFriendlyView',
  'views/SourceWindowView',
  'views/FeedbackModalView',
  'connect/views/UserFormView'
], function($, _, Class, Backbone, Handlebars, mps, HeaderView, FooterView, SourceMobileFriendlyView,SourceWindowView, FeedbackModalView, UserFormView) {
  'use strict';

  var ConnectPage = Class.extend({

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
      new SourceMobileFriendlyView();
      new SourceWindowView();
      new FeedbackModalView();

      new UserFormView();
    }
  });

  new ConnectPage();

});
