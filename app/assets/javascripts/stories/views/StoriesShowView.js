define([
  'mps',
  'backbone',
  'handlebars',
  'underscore',
  'stories/models/StoryModel',
  'views/InterestingView',
  'stories/views/CarrouselStoriesView',
  'stories/views/MoreStoriesView',
  'stories/views/StoriesNewConfirmationView',
  'text!stories/templates/story.handlebars',
  'text!stories/templates/youtubeEmbed.handlebars',
  'text!stories/templates/imageEmbed.handlebars'
], function(
  mps, Backbone, Handlebars, _,
  Story, InterestingView, CarrouselStoriesView, MoreStoriesView, StoriesNewConfirmationView,
  tpl, youtubeTpl, imageTpl
) {

  'use strict';

  var youtubeEmbed = function(url) {
    var template = Handlebars.compile(youtubeTpl),
        youtubeId;

    var shortUrlRegex = new RegExp('youtu\\.be\\/([^\\?]*)'),
        urlRegex = new RegExp('^.*((v\\/)|(embed\\/)|(watch\\?))\\??v?=?([^\\&\\?]*).*');

    if (shortUrlRegex.test(url)) {
      youtubeId = shortUrlRegex.exec(url)[1];
    }

    if (urlRegex.test(url)) {
      youtubeId = urlRegex.exec(url)[5];
    }

    return template({youtube_id: youtubeId});
  };

  var imageEmbed = function(url) {
    var template = Handlebars.compile(imageTpl);
    return template({url: url});
  };

  var StoriesShowView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      var storyId = params.id;
      this.params = params.opts;
      this.story = new Story({id: storyId});
      this.cache();
      this.confirmationView();
      this.story.fetch().done(function(){
        this.render();
      }.bind(this));
    },

    cache: function() {
      this.$container = $('body');
    },

    render: function() {
      this.$el.html(this.template({
        currentUrl: window.location.href,
        story: this.story.toJSON(),
        media: this.getMedia(),
        map: this.getMap(),
        formattedDate: this.story.formattedDate()
      }));

      new CarrouselStoriesView({ el: '#carrousel-stories' });
      new InterestingView();
      mps.publish('Interesting/update',['discussion_forum, how_to, submit_a_story']);

      var title = this.story.get('title') || '';
      document.title = title + ' | Global Forest Watch';

      var moreStoriesView = new MoreStoriesView();
      this.$('.more-stories-section').html(moreStoriesView.render().el);

      return this;
    },

    getMap: function() {
      var coords = this.story.get('lat') + ',' + this.story.get('lng'),
          marker = '&markers=icon:'+window.gfw.config.AWS_HOST+'/marker_exclamation.png%7C'+coords;

      return 'https://maps.google.com/maps/api/staticmap?center='+coords+'&zoom=5&size=1600x500'+marker+'&maptype=terrain&sensor=false&scale=2';
    },

    getMedia: function() {
      var media = _.sortBy(this.story.get('media'), 'order');
      if (_.isEmpty(media)) { return []; }

      return media.map(function(item) {
        var mediaItem = {};

        if (!_.isEmpty(item.embedUrl)) {
          mediaItem.embed = youtubeEmbed(item.embedUrl);
        }

        if (!_.isEmpty(item.previewUrl)) {
          mediaItem.embed = imageEmbed(window.gfw.config.AWS_HOST + '/' + item.previewUrl);
        }

        return mediaItem;
      });
    },

    confirmationView: function() {
      if (this.params && this.params.newStory) {
        this.confimationView = new StoriesNewConfirmationView();
        this.$container.append(this.confimationView.render({}).el);
      }
    }

  });

  return StoriesShowView;

});