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
  'topojson',
  'qtip',
  'scrollit',
  'views/HeaderView',
  'views/FooterView',
  'views/SourceMobileFriendlyView',
  'views/SourceWindowView',
  'connect/UserForm'
], function($, _, Class, Backbone, Handlebars, mps, topojson, qtip, scrollit, HeaderView, FooterView, SourceMobileFriendlyView,SourceWindowView, UserForm) {
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
      alert('test')
      //shared
      new HeaderView();
      new FooterView();
      new SourceMobileFriendlyView();
      new SourceWindowView();

      new UserForm();
    }

    }
  });

  new ConnectPage();

});
