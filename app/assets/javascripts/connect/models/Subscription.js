define([
 'backbone'
], function(Backbone) {

  'use strict';

  var DATASETS = {
    'alerts/terra': {
      title: 'Terra-i',
      long_title: 'monthly Terra-i tree cover loss alerts',
      sub_title: 'monthly, 250m, Latin America, CIAT'
    },
    'alerts/sad': {
      title: 'SAD',
      long_title: 'monthly SAD tree cover loss alerts',
      sub_title: 'monthly, 250m, Brazilian Amazon, Imazon'
    },
    'alerts/quicc': {
      title: 'QUICC',
      long_title: 'quarterly QUICC tree cover loss alerts',
      sub_title: 'quarterly, 5km, &lt;37 degrees north, NASA'
    },
    'alerts/treeloss': {
      title: 'Tree cover loss',
      long_title: 'annual tree cover loss data',
      sub_title: 'annual, 30m, global, Hansen/UMD/Google/USGS/NASA'
    },
    'alerts/treegain': {
      title: 'Tree cover gain',
      long_title: '12-year tree cover gain data',
      sub_title: '12 years, 30m, global, Hansen/UMD/Google/USGS/NASA'
    },
    'alerts/prodes': {
      title: 'PRODES deforestation',
      long_title: 'annual PRODES deforestation data',
      sub_title: 'annual, 30m, Brazilian Amazon, INPE'
    },
    'alerts/guyra': {
      title: 'Gran Chaco deforestation',
      long_title: 'monthly Gran Chaco deforestation data',
      sub_title: 'monthly, 30m, Gran Chaco, Guyra'
    },
    'alerts/glad': {
      title: 'GLAD Tree Cover Loss Alerts',
      long_title: 'weekly GLAD tree cover loss alerts',
      sub_title: 'weekly, 30m, select countries, UMD/GLAD'
    },
    'alerts/viirs': {
      title: 'VIIRS Active fires',
      long_title: 'daily VIIRS active fires alerts',
      sub_title: 'daily, 375 m, global, NASA'
    }
  };

  var Subscription = Backbone.Model.extend({
    idAttribute: 'key',
    type: 'subscription',

    urlRoot: window.gfw.config.GFW_API_HOST + '/v2/subscriptions',

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

    formattedTopic: function(options) {
      return DATASETS[this.get('topic')];
    },

    hasValidEmail: function() {
      var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(this.get('email'));
    }
  });

  return Subscription;

});
