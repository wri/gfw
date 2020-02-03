/**
 * The StoriesKeep view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
], function($,Backbone,underscore) {

  'use strict';

  var StoriesLatestView = Backbone.View.extend({

    el: '#storiesLatestView',

    model: new (Backbone.Model.extend({
      defaults: {
        active: null
      },
    })),

    events: {
      'click #storiesLatestNavigationView li' : 'onClickNavigation'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.cache();
      this.listeners();

      this.model.set('active', 0);
    },

    cache: function() {
      this.$storiesList = $('#storiesLatestListView');
      this.$storiesNavigation = $('#storiesLatestNavigationView');
    },

    listeners: function() {
      this.model.on('change:active', this.changeActive.bind(this));
    },

    render: function(){
      this.$storiesList.html(this.template({ stories : this.collection.toJSON() }));
    },

    /**
     * Listeners
     */
    changeActive: function() {
      var active = this.model.get('active');
      // Navigation
      this.$storiesNavigation.children('li').toggleClass('-active', false);
      this.$storiesNavigation.children('li').eq(active).toggleClass('-active', true);

      // Slider
      this.$storiesList.children('li').toggleClass('-active', false);
      this.$storiesList.children('li').eq(active).toggleClass('-active', true);
    },

    onClickNavigation: function(e) {
      var active = this.$storiesNavigation.children('li').index($(e.currentTarget));
      this.model.set('active', active);     
    }

  });

  return StoriesLatestView;

});

