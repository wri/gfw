require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  'countries/router'
], function($, _, Class, Backbone, Router) {
  'use strict';

  var CountryPage = Class.extend({
    init: function() {
      this.router = new Router(this);
      this._initApp();
    },

    _initApp: function() {
      this.router.startHistory()
    }
  });

  new CountryPage();
});
