define([
 'backbone'
], function(Backbone) {

  'use strict';

  var DATASETS = {
    'umd-loss-gain': {
      title: 'Tree cover loss',
      long_title: 'annual tree cover loss data',
      sub_title: 'annual, 30m, global, Hansen/UMD/Google/USGS/NASA'
    },
    'terrai-alerts': {
      title: 'Terra-i alerts',
      long_title: 'monthly Terra-i tree cover loss alerts',
      sub_title: 'monthly, 250m, Latin America, CIAT'
    },
    'imazon-alerts': {
      title: 'SAD aleerts',
      long_title: 'monthly SAD tree cover loss alerts',
      sub_title: 'monthly, 250m, Brazilian Amazon, Imazon'
    },
    'quicc-alerts': {
      title: 'QUICC alerts',
      long_title: 'quarterly QUICC tree cover loss alerts',
      sub_title: 'quarterly, 5km, &lt;37 degrees north, NASA'
    },
    'prodes-loss': {
      title: 'PRODES deforestation',
      long_title: 'annual PRODES deforestation data',
      sub_title: 'annual, 30m, Brazilian Amazon, INPE'
    },
    'guira-loss': {
      title: 'Gran Chaco deforestation',
      long_title: 'monthly Gran Chaco deforestation data',
      sub_title: 'monthly, 30m, Gran Chaco, Guyra'
    },
    'glad-alerts': {
      title: 'GLAD Tree Cover Loss Alerts',
      long_title: 'weekly GLAD tree cover loss alerts',
      sub_title: 'weekly, 30m, select countries, UMD/GLAD'
    },
    'viirs-active-fires': {
      title: 'VIIRS Active fires',
      long_title: 'daily VIIRS active fires alerts',
      sub_title: 'daily, 375 m, global, NASA'
    }
  };

  var Subscription = Backbone.Model.extend({
    type: 'subscription',

    urlRoot: window.gfw.config.GFW_API_HOST_NEW_API + '/subscriptions',

    sync: function(method, model, options) {
      options || (options = {});

      if (!options.crossDomain) {
        options.crossDomain = true;
      }

      if (!options.xhrFields) {
        options.xhrFields = {withCredentials:true};
      }

      return Backbone.sync.call(this, method, model, options);
    },

    formattedTopic: function() {
      return DATASETS[this.get('datasets')[0]];
    },

    formattedTopics: function() {
      return this.get('datasets').map(function(layerName) {
        return DATASETS[layerName].title;
      }).join(', ');
    },

    parse: function(response) {
      var attributes = {};
      // if the fetch is directly to a detail the response will have the attributes
      // within data but if not the model will take directly the attributes
      if (response.data !== undefined) {
        attributes = response.data.attributes;
        attributes.id = response.data.id;
      } else {
        attributes = response.attributes;
        attributes.id = response.id;
      }
      return attributes;
    },

    hasValidEmail: function() {
      var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(this.get('resource').content);
    }
  });

  return Subscription;

});
