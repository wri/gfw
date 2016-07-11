define([
  'Class', 'uri', 'moment', 'underscore',
  'map/services/DataService'
], function (Class, UriTemplate, moment, _, ds) {

  'use strict';

  var REQUEST_ID = 'GladDateService:fetchDates';

  var URL_TEMPLATE = window.gfw.config.GFW_API_HOST + "/forest-change/{layer}/latest";

  var GladDateService = Class.extend({

    init: function(options) {
      this.options = options || {};
      this._defineRequests();
    },

    _defineRequests: function() {
      var endOfDay = moment().endOf('day'),
          secondsToEndOfDay = endOfDay.diff(moment()) / 1000;

      var config = {
        cache: {type: 'persist', duration: secondsToEndOfDay, unit: 'seconds'},
        url: this._getUrl(),
        type: 'GET'
      };

      ds.define(REQUEST_ID, config);
    },

    _getUrl: function() {
      return new UriTemplate(URL_TEMPLATE).fillFromObject({
        layer: this.options.layer});
    },

    fetchDates: function() {
      var deferred = new $.Deferred();

      var onSuccess = function(result) {
        deferred.resolve(_.pick(result, 'max_date', 'counts'));
      };

      var config = {
        resourceId: REQUEST_ID,
        success: onSuccess,
        error: deferred.reject
      };

      ds.request(config);

      return deferred.promise();
    }

  });

  return GladDateService;

});
