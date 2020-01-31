define([
 'backbone', 'moment', 'underscore',
 'stories/collections/MediaCollection'
], function(
  Backbone, moment, _,
  MediaCollection
) {

  'use strict';

  var Story = Backbone.Model.extend({
    urlRoot: window.gfw.config.GFW_API + '/story/',

    defaults: {
      media: new MediaCollection()
    },

    initialize: function(params) {
      this.edit = params && params.edit || null;
    },

    parse: function(response) {
      var attributes;
      if (response.data) {
        attributes = response.data.attributes;
        attributes.id = response.data.id;
      } else {
        attributes = response.attributes;
        attributes.id = response.id;
      }

      if (this.edit && attributes.media) {
        attributes.media = new MediaCollection(attributes.media);
      }

      return attributes;
    },

    toJSON: function() {
      var json = _.clone(this.attributes);

      for(var attr in json) {
        if((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
          json[attr] = json[attr].toJSON();
        }
      }

      return json;
    },

    addMedia: function(media) {
      var mediaCollection = this.get('media');
      mediaCollection.append(media);
    },

    formattedDate: function() {
      var date = moment(this.get('date'));
      return date.format('MMMM DD, YYYY');
    },

    hasLocation: function() {
      return _.isNumber(this.get('lat')) && _.isNumber(this.get('lng'));
    },

    sync: function(method, model, options) {
      options || (options = {});

      if (!options.crossDomain) {
        options.crossDomain = true;
      }

      if (!options.xhrFields) {
        options.xhrFields = {withCredentials:true};
      }

      return Backbone.sync.call(this, method, model, options);
    }

  });

  return Story;

});
