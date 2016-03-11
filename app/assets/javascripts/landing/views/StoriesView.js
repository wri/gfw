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
      this.url = 'https://gfw-huggin.herokuapp.com/users/1/web_requests/15/keepupdatedgfwrss.json';
      this.items = {};
      mps.publish('Spinner:start');

      //Init Fn
      this._loadStories();
    },

    render: function(){
      this.$el.html(this.template({stories: this.items}));
    },

    _loadStories: function() {
      $.ajax({
        url: this.url,
        success: _.bind(function(data) {
          this.parse(data.items);
        },this),
        error: function(status, error) {
          mps.publish('Spinner:stop');
        }
      });
    },
    parse: function(data) {
      var self = this;
      data = data.slice(0,3);
      this.items = _.map(data,_.bind(function(item) {
        return self.parseItem(item);;
      },this));
      self.render(this.items);
      mps.publish('Spinner:stop');
    },

    parseItem: function(item, slug) {
      if (item.media.length && !!JSON.parse(item.media)[1]) {
        var img = 'http://gfw2stories.s3.amazonaws.com/uploads/' + JSON.parse(item.media)[1]['url'];
      } else {
        var img = '/assets/blog-categories/news.png';
      }
      console.log(img);
      return {
        title: item.title,
        description: item.description,
        link: (item.link.length) ? item.link : (isNaN(item.gfwid)) ? item.gfwid :  '/stories/'+item.gfwid,
        target: false,
        date: item.pubDate,
        avatar: img,
        id: (isNaN(item.gfwid)) ? item.gfwid :  '/stories/'+item.gfwid
      }
    }
  });
  return StoriesView;

});
