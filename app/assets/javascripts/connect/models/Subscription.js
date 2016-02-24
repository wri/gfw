define([
 'backbone'
], function(Backbone) {

  'use strict';

  var DATASETS = {
    'alerts/forma': 'FORMA',
    'alerts/terra': 'Terra-i',
    'alerts/sad': 'SAD',
    'alerts/quicc': 'QUICC',
    'alerts/treeloss': 'Tree cover loss',
    'alerts/treegain': 'Tree cover gain',
    'alerts/prodes': 'PRODES deforestation',
    'alerts/guyra': 'Gran Chaco deforestation',
    'alerts/landsat': 'Landsat',
    'alerts/glad': 'GLAD Tree Cover Loss Alerts'
  };

  var Subscription = Backbone.Model.extend({
    idAttribute: 'key',

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

    formattedTopic: function() {
      return DATASETS[this.get('topic')] || this.get('topic');
    },

    hasValidEmail: function() {
      var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(this.get('email'));
    }
  });

  return Subscription;

});
