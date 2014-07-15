/**
 * Module for executing async HTTP requests.
 *
 */
define([
  'Class',
  'mps',
  'store',
  'moment',
  'amplify',
  'underscore'
], function (Class, mps, store, moment, amplify, _) {

  'use strict';

  var DataService = Class.extend({

    // Added for Jasmine testing to bypass cache and use 'json' dataType
    test: false,

    init: function() {    
    },

    define: function(id, config) {
      var cache = config.cache;
      var duration = cache && cache.duration ? cache.duration : 1;
      var unit = cache && cache.unit ? cache.unit : 'week';
      var expires = this._getDuration(duration, unit);

      if (cache) {
        cache.expires = expires;
      }

      amplify.request.define(id, 'ajax', config);
    },
  
    request: function(config) {
      amplify.request(config);
    },

    /**
     * Async HTTP request to supplied URL and optional data.
     *
     * @param  {string} url The URL.
     * @param  {object} data The URL query parameters.
     * @param  {function} successCb The success callback function.
     * @param  {function} errorCb The error callback function
     * @return {object} The jqXHR object handle.
     */
    spy: function(url, data, successCb, errorCb, cache) {
      var jqxhr = null;
      var val = null;
      var dataType = url.contains('cartodb.com') ? 'jsonp' : 'json';

      cache = cache === undefined ? true : cache;

      if (!this.test && cache && store.enabled) {
        // TODO: Key should be made from url+data
        val = store.get(url);
        if (val) {
          successCb(val);
          return;
        }
      }

      $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        success: function(response) {
          if (successCb) {
            if (!this.test && cache && store.enabled) {
              store.set(url, response);
            }
            successCb(response);
          }
        },
        error: function(jqxhr, status, error) {
          if (errorCb) {
            errorCb(jqxhr.responseText, status, error);
          }
        },
        contentType: 'application/json',
        dataType: this.test ? 'json' : dataType
      });
      return jqxhr;
    },

    /**
     * Get duration in milliseconds from supplied number and unit.
     * 
     * @param  {string} ttl The ttl string 'number:unit'.
     * @return {moment.Duration} The duration object 
     */
    _getDuration: function(number, unit) {
      var units = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months',
        'years'];

      // Check for valid unit
      if (_.indexOf(units, unit) === -1) {
        return null;
      }

      // Check valid number
      if (!number) {
        return null;
      }

      return moment.duration(number, unit).asMilliseconds();
    }
  });

  var service = new DataService();

  return service;
});
