define([
  'backbone', 'underscore',
  'stories/models/MediaModel'
], function(Backbone, _, Media) {

  'use strict';

  var Media = Backbone.Collection.extend({
    model: Media,

    tail: function() {
      return _.last(this.sortBy('order'));
    },

    move: function(previous, next) {
      if (previous === next) { return; }

      if (next > previous) {
        this.each(function(model) {
          if (model.get('order') > previous && model.get('order') <= next) {
            model.set('order', model.get('order') - 1);
          }
        });
      } else {
        this.each(function(model) {
          if (model.get('order') < previous && model.get('order') >= next) {
            model.set('order', model.get('order') + 1);
          }
        });
      }

      var model = this.where({order: previous})[0];
      model.set('order', next);
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
