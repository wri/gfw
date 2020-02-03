define([
  'backbone',
  'uri',
  'helpers/datasetsHelper',

], function(Backbone, UriTemplate, datasetsHelper) {

  'use strict';

  var MAP_URL = '/map/3/0/0/{iso}/grayscale/{baselayers}/{layerId}{?fit_to_geom,geostore,wdpaid,use,useid}';

  var DATASETS = datasetsHelper.getList();;

  var Subscription = Backbone.Model.extend({
    type: 'subscription',

    urlRoot: window.gfw.config.GFW_API + '/subscriptions',

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
          topic.viewOnMapUrl = this.getViewOnMapURL(topic);
        }
        return topic;
      }.bind(this));
    },

    getViewOnMapURL: function(topic) {
      var subscription = this.toJSON();
      var iso = _.compact(_.values({
        country: subscription.params.iso.country,
        region: subscription.params.iso.region,
      })).join('-') || 'ALL';

      var mapObject = {
        iso: iso,
        baselayers: !topic.layer_id ? topic.layerSlug : 'none',
        fit_to_geom: true,
        layerId: topic.layer_id || null,
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
      var valid = false;
      var content = this.get('resource') && this.get('resource').content || null;

      if (content) {
        var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        valid = emailRegex.test(content);
      }
      return valid;
    }
  });

  return Subscription;

});
