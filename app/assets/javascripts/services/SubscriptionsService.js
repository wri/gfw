define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var POST_REQUEST_SUBSCRIPTIONS_ID = 'SubscriptionsService:testWebhook';

  var APIURL = window.gfw.config.GFW_API;

  var APIURLS = {
    'testWebhook': '/subscriptions/check-hook',
  };

  var SubscriptionsService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    testWebhook: function(webhookURL, dataset) {
      var url = new UriTemplate(APIURLS.testWebhook);
      var requestId = POST_REQUEST_SUBSCRIPTIONS_ID + '_' + dataset;

      this.defineRequest(requestId,
        url, { content: webhookURL, slug: dataset });

      var requestConfig = {
        resourceId: requestId
      };

      this.abortRequest(requestId);
      this.currentRequest[requestId] = ds.request(requestConfig);
    },

    defineRequest: function (id, url, data) {
      ds.define(id, {
        url: APIURL + url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data)
      });
    },

    /**
     * Abort the current request if it exists.
     */
    abortRequest: function(request) {
      if (this.currentRequest && this.currentRequest[request]) {
        this.currentRequest[request].abort();
        this.currentRequest[request] = null;
      }
    }

  });

  return new SubscriptionsService();

});
