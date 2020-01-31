define([
  'backbone', 
  'underscore',
  'stories/models/MediaModel'
], function(Backbone, _, Media) {

  'use strict';

  var Media = Backbone.Collection.extend({
    model: Media,

    tail: function() {
      return _.last(this.sortBy('order'));
    },

    move: function(orderedArray) {
      this.each(function(model) {
        var url = model.get('embedUrl') || model.get('previewUrl');
        var index = _.indexOf(orderedArray, url);

        model.set('order', index);
      });
    },

    append: function(media) {
      if (this.tail() !== undefined) {
        media.set('order', this.tail().get('order') + 1);
      }

      this.add(media);
    }

  });

  return Media;

});
