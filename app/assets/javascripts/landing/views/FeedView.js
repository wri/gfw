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
        url: 'https://pipes.yahoo.com/pipes/pipe.run?_id=d79b5dd252a71b6930d4756e801468c4&_render=json',
        type:'GET',
        success: _.bind(function(data){
          this.parse(data.value.items);
        },this)
      })
    },


    parse: function(data) {
      this.feedlist = _.map(data,_.bind(function(item) {
        var result = null;
        if(item.cartodb_id) {
          result = this.parseItem(item,'story');
        } else if(item.disqus) {
          result = this.parseItem(item,'disqus');
        } else if(item.google) {
          result = this.parseItem(item,'google');
        } else if(item.guid) {
          result = this.parseItem(item,'blog');
        } else {
          result = item;
        }
        return result;
      },this));

      this.feedlist = _.first(this.feedlist.sort(_.bind(function(a,b){
        return b.createDate - a.createDate;
      },this)),6);

      this.render();

    },

    parseItem: function(item,slug) {
      switch(slug){
        case 'story':
          return {
            author: item.author,
            createDate: this.parseDate(item.pubDate),
            description: 'added a new story',
            link: '/stories/'+item.cartodb_id,
            target: false,
            avatar: 'https://maps.googleapis.com/maps/api/staticmap?center=' + item.the_geom.coordinates[1] + ',' + item.the_geom.coordinates[0] + '&zoom=2&size=80x80',
            type: slug
          }
        break;
        case 'disqus':
          return {
            author: item.author.name,
            createDate: this.parseDate(item.pubDate),
            description: 'added a comment',
            link: 'https://disqus.com/home/forum/gfw20/recent/',
            target:true,
            avatar: item.author.avatar.small.permalink,
            type: slug
          }
        break;
        case 'blog':
          return {
            author: item['dc:creator'],
            createDate: this.parseDate(item.pubDate),
            description: 'added a new post in blog',
            link: item.link,
            target:true,
            type: slug
          }
        break;
        case 'google':
          return {
            author: item.author,
            createDate: this.parseDate(item.pubDate),
            description: 'commented on Google Groups',
            link: item.link,
            target:true,
            type: slug
          }
        break;
      }
    },

    parseDate: function(date) {
      var moment = new Date(date);
      return moment.getTime();
    }


  });
  return FeedView;

});
