/**
 * The Stories view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'handlebars',
  'text!landing/templates/stories.handlebars'
], function($, Backbone, _, mps, Handlebars, tpl) {

  'use strict';

  var StoriesModel = Backbone.Model.extend({
    defaults:{
      stories: null,
    }
  });



  var StoriesView = Backbone.View.extend({

    el: '#storiesView',

    template: Handlebars.compile(tpl),

    initialize: function() {

      //Init Vars
      this.url = 'https://pipes.yahoo.com/pipes/pipe.run?_id=7157ffabdeb1eefc621e8306f56039b9&_render=json';
      this.items = {};
      mps.publish('Spinner:start');

      //Init Fn
      this._loadStories();
    },

    render: function(){
      this.$el.html(this.template({stories: this.items}));
    },

    _loadStories: function(){
      $.ajax({
        url: this.url,
        success: _.bind(function(data) {
          this.parse(data.value.items);
        },this),
        error: function(status, error) {
          mps.publish('Spinner:stop');
        }
      });
    },
    parse: function(data) {
      var self = this;
      this.items = _.map(data,_.bind(function(item) {
        var result = null;
        if (item.link) {
          //check if it's a blog post
          result = self.parseItem(item,'post');
        } else {
          // user story here
          result = self.parseItem(item,'story');
        }
        return result;
      },this));
      self.render(this.items);
      mps.publish('Spinner:stop');
    },

    parseItem: function(item, slug) {
      if (slug === 'story') {
        var img = item.media[item.media.length -1].preview_url;
        return {
          title: item.title,
          description: item.details,
          link: '/stories/'+item.cartodb_id,
          target: false,
          map: (img) ? 'http://gfw2stories.s3.amazonaws.com/uploads/' + img : 'https://maps.googleapis.com/maps/api/staticmap?center=' + item.the_geom.coordinates[0] + ',' + item.the_geom.coordinates[1] + '&zoom=2&size=80x80',
          type: slug
        }
      } else {
        return {
          title: item.title,
          description: item.description,
          link: item.link,
          target:true,
          avatar: item.category[0].replace(' ','-'),
          type: slug
        }
      }
    }
  });
  return StoriesView;

});
