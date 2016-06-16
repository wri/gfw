define([
  'jquery',
  'underscore',
  'backbone',
  'enquire',
  'lory'
], function($, _, Backbone, enquire, lory) {

  'use strict';

  var SliderView = Backbone.View.extend({

    events: {
      'click .js_slide_navigation li' : 'clickNavigation'
    },

    initialize: function(settings) {
      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);

      if(! !!this.el) {
        return;
      }

      enquire.register("screen and (min-width: 850px)", {
        match: function(){
          this.mobile = false;
          this.initSlider();
        }.bind(this)
      });
      enquire.register("screen and (max-width: 850px)", {
        match: function(){
          this.mobile = true;
          this.initSlider();
        }.bind(this)
      });
    },

    initSlider: function() {
      this.options.slider = (! !!this.options.defaultSlider) ? this.setOptions() : _.extend(this.setOptions(), this.options.defaultSlider);
      this.initNavigation();
      this.initLory();
    },

    cache: function() {
      this.$slider = this.$el.find('.js_slider');
      this.$sliderItems = this.$el.find('.js_slide');
      this.slideCount = this.$el.find('.js_slide').length;

      this.$sliderNavigation = this.$el.find('.js_slide_navigation');
    },

    // Slider plugin
    initLory: function() {
      // init slider
      if (!!this.slider) {
        this.slider.reset();
        this.slider.destroy();
      }

      // set width of each element
      this.$slider[0].addEventListener('before.lory.init', this.setSlideWidth.bind(this));
      this.$slider[0].addEventListener('on.lory.resize', this.setSlideWidth.bind(this));

      this.slider = lory.lory(this.$slider[0], this.options.slider);

      if (!!this.options.slider && !!this.options.slider.autoplay) {
        this.initAutoPlay();
      }
    },

    setOptions: function() {
      this.cache();
      return {
        slidesToScroll: (!!this.mobile) ? 1 : 3,
        infinite: (!!this.mobile) ? 1 : 3,
        slides_per_slide: (!!this.mobile) ? 1 : 3
      }
    },

    setSlideWidth: function() {
      var width = this.$slider.width()/this.options.slider.slides_per_slide;
      this.$sliderItems.width(width);
    },

    initNavigation: function() {
      // var pages = Math.ceil(this.slideCount/this.options.slider.slides_per_slide);
      // var arrayPages =(function(a,b){while(a--)b[a]=a+1;return b})(pages,[]);

      if (this.slideCount < 4 && !this.mobile) {
        this.$sliderNavigation.addClass('_hidden');
        return;
      }

      // this.$sliderNavigation.html(this.navTemplate({pages: null}));
      // this.$sliderNavigationItems = this.$sliderNavigation.find('li');
    },

    initAutoPlay: function() {
      this.options.slider.interval = setInterval(function(){
        this.slider.next();
      }.bind(this), 6000)
    },

    stopAutoPlay: function() {
      clearInterval(this.options.slider.interval);
    },

    // Events
    clickNavigation: function(e) {
      e && e.preventDefault();
      var index = $(e.currentTarget).data('index');
      var direction = $(e.currentTarget).data('direction');

      if (index != undefined) {
        this.slider.slideTo(index*this.options.slider.slides_per_slide)
      } else {
        switch (direction) {
          case 'left':
            this.slider.prev();
          break;
          case 'right':
            this.slider.next();
          break;
        }
      }
    }

  });

  return SliderView;

});
