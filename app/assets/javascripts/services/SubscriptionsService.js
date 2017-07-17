define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var POST_REQUEST_SUBSCRIPTIONS_ID = 'SubscriptionsService:testWebhook';

  var APIURL = window.gfw.config.GFW_API_HOST_PROD;

  var APIURLS = {
    'testWebhook': '/subscriptions/check-hook',
  };

  var SubscriptionsService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    testWebhook: function(webhookURL) {
      var url = new UriTemplate(APIURLS.testWebhook);

      this.defineRequest(POST_REQUEST_SUBSCRIPTIONS_ID,
        url, { content: webhookURL });

      var requestConfig = {
        resourceId: POST_REQUEST_SUBSCRIPTIONS_ID
      };

      this.abortRequest(POST_REQUEST_SUBSCRIPTIONS_ID);
      this.currentRequest[POST_REQUEST_SUBSCRIPTIONS_ID] = ds.request(requestConfig);
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
