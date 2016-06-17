/**
 * The StoriesKeep view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'simplePagination',
  'text!stories/templates/storiesList.handlebars',
], function($,Backbone,underscore,Handlebars,simplePagination, storiesTPL) {

  'use strict';

  var StoriesListView = Backbone.View.extend({

    el: '#storiesListView',

    model: new (Backbone.Model.extend({
      defaults: {
        total: null,
        perpage: null,
        page: null
      },
    })),

    collection: new (Backbone.Collection.extend({
      url: '/stayinformed-stories.json',

      parse: function(response) {
        return _.map(response, function(story){
          var img = (! story.media.length) ? null : story.media[story.media.length -1].preview_url;
          var detail = (story.details.length > 295) ? story.details.substr(0, 295)+'...' : story.details;
          return {
            id: story.id,
            title: story.title,
            details: detail,
            link: '/stories/'+story.id,
            map: (img) ? 'http://gfw2stories.s3.amazonaws.com/uploads/' + img : 'https://maps.googleapis.com/maps/api/staticmap?center=' + story.lat + ',' + story.lng + '&zoom=2&size=80x80',
          }
        });
      }
    })),

    template: Handlebars.compile(storiesTPL),

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.cache();
      this.listeners();

      /**
       * Inits
       */
      // Init model
      this.model.set({
        total: this.$storiesPagination.data('total'),
        perpage: this.$storiesPagination.data('perpage'),
        page: this.$storiesPagination.data('page')
      }, { silent: true });

      // Init pagination
      this.pagination();
    },

    cache: function() {
      this.$htmlbody = $('html, body');
      this.$storiesList = $('#storiesList');
      this.$storiesSpinner = $('#storiesSpinner');
      this.$storiesPagination = $('#storiesPagination');
      this.$storiesResetPosition = $('#storiesResetPosition');
    },

    listeners: function() {
      this.model.on('change:page', this.changePage.bind(this));
    },

    render: function(){
      this.$storiesList.html(this.template({ stories : this.collection.toJSON() }));
    },

    /**
     * Listeners
     */
    changePage: function() {
      this.$htmlbody.animate({ scrollTop: this.$storiesResetPosition.offset().top }, 500);
      this.$storiesSpinner.toggleClass('-start', true);
      this.collection.fetch({
        data: {
          for_stay: true,
          page: this.model.get('page'),
          perpage: this.model.get('perpage')
        },

        success: function () {
          this.$storiesSpinner.toggleClass('-start', false);
          this.render();
        }.bind(this),
        
        error: function (e) {
          this.$storiesSpinner.toggleClass('-start', false);
          alert(' Service request failure: ' + e);
        }.bind(this),
        
      })
    },

    /**
     * Pagination
     */
    pagination: function(){
      // We are using simple-pagination plugin
      this.$storiesPagination.pagination({
        items: this.model.get('total'),
        itemsOnPage : this.model.get('perpage'),
        currentPage : this.model.get('page'),
        displayedPages: 3,
        edges: 1,        
        selectOnClick: false,
        prevText: '<svg><use xlink:href="#shape-arrow-left"></use></svg>',
        nextText: '<svg><use xlink:href="#shape-arrow-right"></use></svg>',
        onPageClick: function(page, e){
          e && e.preventDefault();
          this.$storiesPagination.pagination('drawPage', page);
          this.model.set('page', page);
        }.bind(this)
      });
    },

  });

  return StoriesListView;

});

