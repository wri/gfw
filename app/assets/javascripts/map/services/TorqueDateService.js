define([
  'Class', 'uri', 'moment',
  'map/services/DataService'
], function (Class, UriTemplate, moment, ds) {

  'use strict';

  var REQUEST_ID = 'TorqueDateService:fetchDates';

  var TorqueDateService = Class.extend({

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
        type: 'POST',
        dataType: 'jsonp'
      };

      ds.define(REQUEST_ID, config);
    },

    _getUrl: function() {
      var template = 'https://wri-01.carto.com/api/v2/sql{?q}',
          sql = ['SELECT DISTINCT date',
                 'FROM ' + this.options.table_name,
                 'ORDER BY date DESC'].join(" "),
          url = new UriTemplate(template).fillFromObject({q: sql});

      return url;
    },

    fetchDates: function(layer) {
      var deferred = new $.Deferred();

      var onSuccess = function(result) {
        var dates = result.rows.map(function(row) {
          return (new Date(row.date)).getTime();
        });

        deferred.resolve(dates);
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

  return TorqueDateService;

});
