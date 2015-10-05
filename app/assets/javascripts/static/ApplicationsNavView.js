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
      this.$cutTop = $('#cutTop');
      this.$cutBottom = $('#cutBottom');
      this.$sideBarBox = $('#wrap-applications');
      this.$cloneNav = $('#clone-nav');
      this.padding = 40;
      this.offsets = [];
      this.lastScroll = 0;

      if (this.$window.width() >= 850) {
        this.setListeners();
      }

      //INITS
      mps.publish('Interesting/update',['discussion_forum, how_to, submit_a_story']);

    },

    setListeners: function(){
      this.model.on('change:filters', this.changeFilters, this);
      mps.subscribe('App/render', _.bind(this.initBindings, this));
    },

    initBindings: function() {
      this.$document.off('scroll',_.bind(this.scrollDocument,this));
      this.$window.off('resize',_.bind(this.calculateOffsets,this));

      this.$document.on('scroll',_.bind(this.scrollDocument,this));
      this.$window.on('resize',_.bind(this.calculateOffsets,this));
      this.calculateOffsets();
    },

    calculateOffsets: function(){
      this.offset = this.$cutTop.offset().top + parseInt(this.$el.css('paddingTop'), 10);
      this.offsetBottom = this.$cutBottom.offset().top - this.$el.height();
    },

    scrollDocument: function(e){
      var scrollTop = this.$document.scrollTop();
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
      }

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
