define([
  'underscore'
], function(_) {

  'use strict';

  return {
    decorateWithIconUrl: function(story) {
      var media = story.media;
      if (media.length > 0 && !_.isEmpty(media[media.length-1].previewUrl)) {
        var url = media[media.length-1].previewUrl;
        story.image = 'http://gfw2stories.s3.amazonaws.com/uploads/' + url;
      } else {
        story.image = 'https://maps.googleapis.com/maps/api/staticmap?center=' + story.lat + ',' + story.lng + '&zoom=2&size=80x80';
      }

      return story;
    }
  };

});
