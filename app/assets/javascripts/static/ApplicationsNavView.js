/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'mps'
], function($,Backbone,mps) {

  'use strict';

  var ApplicationsNavModel = Backbone.Model.extend({
    defaults: {
      filters: []
    }
  })


  var ApplicationsNavView = Backbone.View.extend({

    el: '#applicationsNavView',

    events: {
      'click .app-filter' : 'onFilter',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }

      this.model = new ApplicationsNavModel();

      this.$window = $(window);
      this.$document = $(document);
      this.$htmlbody = $('html,body');
      this.$cut = $('#cut');
      this.$sideBarBox = $('#wrap-applications');
      this.$cloneNav = $('#clone-nav');
      this.$linksparents = this.$el.find('li');
      this.$links = this.$el.find('a');
      this.padding = 40;
      this.offsets = [];
      this.offsetsIndex = 0;
      this.lastScroll = 0;

      if (this.$window.width() >= 850) {
        this.setListeners();
      }

      //INITS
      mps.publish('Interesting/update',['discussion_forum, how_to, submit_a_story']);

    },

    setListeners: function(){
      this.model.on('change:filters', this.changeFilters, this);
      mps.subscribe('App/render', _.bind(function(){
        this.$document.on('scroll',_.bind(this.scrollDocument,this));
        this.$window.on('resize',_.bind(this.calculateOffsets,this));
        this.calculateOffsets();
      }, this ));
    },

    calculateOffsets: function(){
      this.offset = this.$el.offset().top + parseInt(this.$el.css('paddingTop'), 10);
      this.offsetBottom = this.$cut.offset().top - this.$el.height();

      _.each(this.$links, _.bind(function(link, i){
        var id = $(link).attr('href');
        this.offsets[i] = $(id).offset().top - this.$el.height() - this.padding;
      }, this ));
    },

    scrollDocument: function(e){
      var scrollTop = this.$document.scrollTop();
      var index = this.offsetsIndex;
      if (scrollTop > this.offset) {
        this.$sideBarBox.addClass('fixed');
        this.firstFixed = false;
        this.$cloneNav.height(this.$el.height());
        if(scrollTop < this.offsetBottom) {
          this.$el.removeClass('bottom').addClass('fixed');
        }else{
          this.$el.removeClass('fixed').addClass('bottom');
        }
      }else{
        this.$el.removeClass('fixed bottom');
        this.$cloneNav.height(0);
        this.$sideBarBox.removeClass('fixed');
        this.firstFixed = true;
        this.offsetsIndex = 0;
      }

      if (scrollTop > this.lastScroll) {
        if (scrollTop > this.offsets[this.offsetsIndex+1]) {
          this.offsetsIndex++;
        }
      }else{
        if (scrollTop < this.offsets[this.offsetsIndex]) {
          (this.offsetsIndex === 0) ? this.offsetsIndex = 0 : this.offsetsIndex--;
        }
      }
      this.$links.removeClass('current');
      this.$linksparents.eq(this.offsetsIndex).children('a').addClass('current');
      this.lastScroll = scrollTop;
    },

    onFilter: function(e) {
      var filters = _.clone(this.model.get('filters'));
      var filter = $(e.currentTarget).data('filter');
      if (_.contains(filters, filter)) {
        filters = _.without(filters, filter);
      } else {
        filters.push(filter);
      }
      $(e.currentTarget).toggleClass('is-active');
      this.model.set('filters',filters);
    },

    changeFilters: function () {
      mps.publish('App/filters', [this.model.get('filters')]);
    }

  });

  return ApplicationsNavView;

});
