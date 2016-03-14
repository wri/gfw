/**
 * The Feed view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'mps',
  'handlebars',
  'text!landing/templates/feed.handlebars',

], function($, Backbone, _, mps, Handlebars, tpl) {

  'use strict';

  var FeedView = Backbone.View.extend({

    el: '#feedView',

    template: Handlebars.compile(tpl),

    initialize: function() {
      this.loadFeed();
    },

    render: function() {
      this.$el.html(this.template({feed: this.feedlist}));
    },

    loadFeed: function() {
      $.ajax({
        url: 'https://gfw-huggin.herokuapp.com/users/1/web_requests/14/feedviewrss.json',
        type:'GET',
        success: _.bind(function(data){
          this.parse(data.items);
        },this)
      })
    },


    parse: function(data) {
      data = data.slice(0,6);
      this.feedlist = _.map(data,_.bind(function(item) {
        return this.parseItem(item);
      },this));

      this.render();

    },

    parseItem: function(item) {
        return {
          author: item.title,
          createDate: this.parseDate(item.pubDate),
          description: item.description.substring(0,40),
          link: item.link,
          target: true,
          avatar: (item.gfwid.length > 0)? 'https://maps.googleapis.com/maps/api/staticmap?center=48.149567,-55.063267&zoom=2&size=80x80' : '/assets/logos/google.svg'
        }
    },

    parseDate: function(date) {
      var moment = new Date(date);
      return moment.getTime();
    }


  });
  return FeedView;

});
