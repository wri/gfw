define([
  'backbone',
  'uri',

], function(Backbone, UriTemplate) {

  'use strict';

  var MAP_URL = '/map/3/0/0/{iso}/grayscale/{baselayers}{?fit_to_geom,geostore,wdpaid,use,useid}';

  var DATASETS = {
    'umd-loss-gain': {
      title: 'Tree cover loss',
      long_title: 'annual tree cover loss data',
      sub_title: 'annual, 30m, global, Hansen/UMD/Google/USGS/NASA',
      layerSlug: ['loss','gain'],
      slug: 'umd-loss-gain'
    },
    'terrai-alerts': {
      title: 'Terra-i Alerts',
      long_title: 'monthly Terra-i tree cover loss alerts',
      sub_title: 'monthly, 250m, Latin America, CIAT',
      layerSlug: ['terrailoss'],
      slug: 'terrai-alerts'
    },
    'imazon-alerts': {
      title: 'SAD Alerts',
      long_title: 'monthly SAD tree cover loss alerts',
      sub_title: 'monthly, 250m, Brazilian Amazon, Imazon',
      layerSlug: ['imazon'],
      slug: 'imazon-alerts'
    },
    'prodes-loss': {
      title: 'PRODES deforestation',
      long_title: 'annual PRODES deforestation data',
      sub_title: 'annual, 30m, Brazilian Amazon, INPE',
      layerSlug: ['prodes'],
      slug: 'prodes-loss'
    },
    'guira-loss': {
      title: 'Gran Chaco deforestation',
      long_title: 'monthly Gran Chaco deforestation data',
      sub_title: 'monthly, 30m, Gran Chaco, Guyra',
      layerSlug: ['guyra'],
      slug: 'guira-loss'
    },
    'glad-alerts': {
      title: 'GLAD Tree Cover Loss Alerts',
      long_title: 'weekly GLAD tree cover loss alerts',
      sub_title: 'weekly, 30m, select countries, UMD/GLAD',
      layerSlug: ['umd_as_it_happens'],
      slug: 'glad-alerts'
    },
    'viirs-active-fires': {
      title: 'VIIRS Active fires',
      long_title: 'daily VIIRS active fires alerts',
      sub_title: 'daily, 375 m, global, NASA',
      layerSlug: ['viirs_fires_alerts'],
      slug: 'viirs-active-fires'
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
        var topic = DATASETS[layerName];
        if (!!topic) {
          topic.viewOnMapUrl = this.getViewOnMapURL(topic.layerSlug);
        }
        return topic;
      }.bind(this));
    },

    getViewOnMapURL: function(baselayers) {
      var subscription = this.toJSON();
      var iso = _.compact(_.values(subscription.params.iso)).join('-') || 'ALL';
      var mapObject = {
        iso: iso,
        baselayers: baselayers,
        fit_to_geom: true,
        geostore: (!!subscription.params.geostore) ? subscription.params.geostore : null,
        wdpaid: (!!subscription.params.wdpaid) ? subscription.params.wdpaid : null,
        use: (!!subscription.params.use) ? subscription.params.use : null,
        useid: (!!subscription.params.useid) ? subscription.params.useid : null,
      }
      return new UriTemplate(MAP_URL).fillFromObject(mapObject);
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
