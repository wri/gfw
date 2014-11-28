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

    render: function(){
      this.$el.html(this.template({feed: this.feedlist}));
    },

    loadFeed: function(){
      $.ajax({
        url: 'https://pipes.yahoo.com/pipes/pipe.run?_id=5bc0b70181e4954888ddc8fb05598fa2&_render=json',
        type:'GET',
        success: _.bind(function(data){
          this.parse(data.value.items);
        },this)
      })
    },


    parse: function(data){
      this.feedlist = _.map(data,_.bind(function(item){
        var result = null;
        if(item.cartodb_id){
          result = this.parseItem(item,'story');
        }else if(item.feed){
          result = this.parseItem(item,'disqus');
        }else if(item.guid){
          result = this.parseItem(item,'blog');
        }else{
          result = item;
        }
        return result;
      },this));
      this.feedlist = _.first(this.feedlist.sort(_.bind(function(a,b){
        return b.createDate - a.createDate;
      },this)),6);

      this.render();

    },

    parseItem: function(item,slug){
      switch(slug){
        case 'story':
          return {
            author: item.author,
            createDate: this.parseDate(item.pubDate),
            description: 'added a new story',
            link: '/stories/'+item.cartodb_id,
            target: false,
            type: slug
          }
        break;
        case 'disqus':
          return {
            author: item.author,
            createDate: this.parseDate(item.pubDate),
            description: 'added a comment',
            link: item.link,
            target:true,
            type: slug
          }
        break;
        case 'blog':
          return{
            author: item['dc:creator'],
            createDate: this.parseDate(item.pubDate),
            description: 'added a new post in blog',
            link: item.link,
            target:true,
            type: slug
          }
        break;
      }
    },

    parseDate: function(date){
      var moment = new Date(date);
      return moment.getTime();
    }


  });
  return FeedView;

});