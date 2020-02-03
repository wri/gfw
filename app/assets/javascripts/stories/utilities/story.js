define([
  'underscore'
], function(_) {

  'use strict';

  return {
    decorateWithIconUrl: function(story) {
      var media = story.media;

      // It seems that this !_.isEmpty(media[media.length-1].previewUrl) is not correct
      if (media && media.length > 0 && !_.isEmpty(media[media.length-1].previewUrl)) {
        var url = media[media.length-1].previewUrl;
        story.image = 'https://gfw2stories.s3.amazonaws.com/uploads/' + url;
      } else {
        story.image = 'https://maps.googleapis.com/maps/api/staticmap?center=' + story.lat + ',' + story.lng + '&zoom=3&size=266x266';
      }

      return story;
    }
  };

});