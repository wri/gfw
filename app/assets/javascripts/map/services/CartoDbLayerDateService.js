define([
  'Class', 'uri', 'bluebird', 'moment',
  'map/services/DataService'
], function (Class, UriTemplate, Promise, moment, ds) {

  'use strict';

  var REQUEST_ID = 'CartoDbLayerDateService:fetchLayerDates';
  var URL = 'https://wri-01.carto.com/api/v2/sql{?q}';

  var CartoDbLayerDateService = Class.extend({

    init: function(options) {
      this.dateAttribute = options.dateAttribute;
      this.table = options.table;

      this._defineRequests();
    },

    _defineRequests: function() {
      var sql = 'SELECT MIN('+this.dateAttribute+') AS min_date, MAX('+this.dateAttribute+') AS max_date FROM '+this.table,
          url = new UriTemplate(URL).fillFromObject({q: sql});

      var endOfDay = moment().endOf('day'),
          secondsToEndOfDay = endOfDay.diff(moment()) / 1000;

      ds.define(REQUEST_ID, {
        cache: {type: 'persist', duration: secondsToEndOfDay, unit: 'seconds'},
        url: url,
        type: 'GET'
      });
    },

    fetchLayerConfig: function() {
      return new Promise(function(resolve, reject) {

      var onSuccess = function(response) {
        resolve(response.rows[0]);
      };

      var requestConfig = {
        resourceId: REQUEST_ID,
        success: onSuccess,
        error: reject
      };

      ds.request(requestConfig);

      });
    }

  });

  return CartoDbLayerDateService;

});
