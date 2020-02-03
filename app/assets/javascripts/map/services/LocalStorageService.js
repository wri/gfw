/**
 * Service module caching for HTML5 Local Storage.
 *
 */
define([
  'Class',
  'mps',
  'store'
], function (Class, mps, store) {

  'use strict';

  var LocalStorageService = Class.extend({

    // Added for Jasmine testing to bypass cache and use 'json' dataType
    test: false,

    init: function() {
      mps.subscribe('LocalStorage/clear', function() {
        store.clear();
      });
    }
  });

  var service = new LocalStorageService();

  return service;
});
