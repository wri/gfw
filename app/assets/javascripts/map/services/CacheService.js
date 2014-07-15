/**
 * Service module used for caching on the client with TTL support.
 * 
 * @return {CacheService} Instance of CacheService
 */
define([
  'Class',
  'underscore',
  'mps',
  'store',
  'moment'
], function (Class, _, mps, store, moment) {

  'use strict';

  var CacheService = Class.extend({

    /**
     * Initializes the service.
     * 
     * @return {CacheService} 
     */
    init: function() {
      // TODO: Check latest deploy, clear cache if needed.
    },

    /**
     * Set a cache item with supplied key, value, and optional TTL (default 1
     * week).
     * 
     * @param {string} key Cache item key.
     * @param {object} value Cache item value.
     * @param {[type]} ttl   [description]
     */
    set: function(key, value, ttl) {
      var now = moment();
      var duration = this._getDuration(ttl) || moment.duration(1, 'week');
      var expires = now.valueOf() + duration.asMilliseconds();
      var entry = null;

      entry = {data: value, expires: expires};
      store.set(key, entry);
    },

    /**
     * Get a cached item from supplied key.
     * 
     * @param  {string} key The cached item key.
     * @return {object} The cached item if it exists.
     */
    get: function(key) {
      var now = moment();
      var entry = store.get(key);

      if (entry) {
        if (now.asValue() < entry.expires) {  // Not expired yet.
          return entry.value;
        } else {
          this.remove(key);  // Expired, removed from cache.
        }
      }
    },

    /**
     * Remove cached item by key.
     * 
     * @param  {string} key The cached item key
     */
    remove: function(key) {
      store.remove(key);
    },

    /**
     * Clear all cached entries.
     */
    clear: function() {
      store.clear();
    },

    /**
     * Parse supplied ttl string 'number:unit' and return values.
     * 
     * @param  {string} ttl The ttl string 'number:unit'.
     * @return {object} The ttl object with number and unit keys.
     */
    _parseTTL: function(ttl) {
      var tokens = null;

      try {
        tokens = ttl.split(':');
        return {number: _.toNumber(tokens[0]), unit: tokens[1]};
      } catch(err) {
        return {};
      }
    },

    /**
     * Get duration from supplied ttl 'number:unit' string.
     * 
     * @param  {string} ttl The ttl string 'number:unit'.
     * @return {moment.Duration} The duration object 
     */
    _getDuration: function(ttl) {
      var parsed = this._parseTTL(ttl);
      var number = parsed.number;
      var unit = parsed.unit;
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

      return moment.duration(number, unit);
    }
  });

  var service = new CacheService(); 

  return service;
});
