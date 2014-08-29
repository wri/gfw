/**
 * Module for executing async HTTP requests and caching responses.
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

    /**
     * Constructs a new instance of DataService.
     *
     * @return {DataService} instance
     */
    init: function() {
    },

    /**
     * Define a data service with supplied id and config object.
     *
     * The config object has:
     *   cache - The cache configuration object (optional)
     *   url - The service URL (required)
     *   type - The HTTP request method to use (default POST)
     *   dataType - The return data type (default JSON)
     *
     * The config.cache object has:
     *   type - The cache type (e.g., localStorage)
     *   duration - The cache duration (e.g., 1)
     *   unit - The cache duration unit (e.g., day)
     *
     * @param  {string} id The service id
     * @param  {object} config The service config object
     */
    define: function(id, config) {
      var cache = config.cache;
      var duration = cache && cache.duration ? cache.duration : 1;
      var unit = cache && cache.unit ? cache.unit : 'weeks';
      var expires = this._getDuration(duration, unit);

      if (cache) {
        cache.expires = expires;
      }

      amplify.request.define(id, 'ajax', config);
    },

    /**
     * Request asynchronously data from the service.
     *
     * The config object has:
     *   resourceId - The service id that was defined.
     *   data - The data object with service parameters.
     *   success - The success callback function.
     *   error - The error callback function.
     *
     * @param  {object} config The service configuration.
     */
    request: function(config) {
      return amplify.request(config);
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
