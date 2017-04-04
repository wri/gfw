/**
 * The Spinner view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'services/NewsService',
  'landing/views/SliderView',
  'text!landing/templates/c-home-news-item.handlebars',
  'text!landing/templates/c-home-news-slider-dots.handlebars'
], function($, Backbone, _, Handlebars, newsService, SliderView, newsItemTpl, newsSliderDotsTpl) {

  'use strict';

  Handlebars.registerHelper('for', function(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr)
      accum += block.fn(i);
    return accum;
  });
  Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  var NewsView = Backbone.View.extend({

    el: '.c-home-news',

    events: {
      'click .js-home-news-item-linker': '_onClickItem',
      'click .js-home-news-mygfw-button': '_onClickMygfwButton'
    },

    newsItemTpl: Handlebars.compile(newsItemTpl),
    newsSliderDotsTpl: Handlebars.compile(newsSliderDotsTpl),

    initialize: function () {
      this._cache();
      this._loadNews();
    },

    _cache: function () {
      this.$slider = this.$el.find('.js_slider');
      this.$slides = this.$el.find('.js_slides');
      this.$sliderDots = this.$el.find('.js_slider_dots');
    },

    _initSlider: function () {
      new SliderView({
        el: this.$slider,
        sliderOptions: {
          slideSpeed: 500
        }
      });
    },

    _loadNews: function () {
      newsService.getNews().then(function(results) {
        this.$slides.html('');
        _.each(results, function(item) {
          this.$slides.append(this.newsItemTpl({
            name: item.name,
            description: item.description,
            link: item.link
          }));
        }.bind(this));
        this.$sliderDots.html(this.newsSliderDotsTpl({
          count: results.length
        }));

        this._initSlider();
      }.bind(this));
    },

    _onClickItem: function (e) {
      var trackLabel = $(e.currentTarget).attr('href');
      ga('send', 'event', 'Home', 'New on gfw', trackLabel);
    },

    _onClickMygfwButton: function () {
      ga('send', 'event', 'Home', 'Go to my_gfw', 'click');
    },

  });

  return NewsView;

});