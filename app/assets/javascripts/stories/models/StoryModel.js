define([
 'backbone', 'moment', 'underscore',
 'stories/collections/MediaCollection'
], function(
  Backbone, moment, _,
  MediaCollection
) {

  'use strict';

  var Story = Backbone.Model.extend({
    urlRoot: window.gfw.config.GFW_API_HOST_NEW_API + '/story/',

    defaults: {
      media: new MediaCollection()
    },

    parse: function(response) {
      var attributes;
      if (response.data) {
        attributes = response.data.attributes;
      } else {
        attributes = response.attributes;
      }

      attributes.id = response.id;

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
    }
  });

  return Story;

});
