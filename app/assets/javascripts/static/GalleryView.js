/**
 * The Interesting view.
 */
define([
  'jquery',
  'backbone',
  'handlebars',
  'mps',
  'chosen',
  'simplePagination',
  'static/helpers/galleryHelper',
  'text!static/templates/gallery.handlebars',
], function($,Backbone,Handlebars,mps,chosen,simplePagination,galleryHelper,tpl) {

  'use strict';

  var GalleryCollection = Backbone.Collection.extend({

    comparator: function(item) {
      return parseInt(item.get("order"))
    },

    getPaginatedCollection: function(currentPage,itemsOnPage,filter) {
      var filteredCollection = this.customFilter(filter);
      return filteredCollection.slice(currentPage*itemsOnPage, (currentPage*itemsOnPage) + itemsOnPage)
    },

    getCount: function(filter) {
      var filteredCollection = this.customFilter(filter);
      return filteredCollection.length;
    },

    customFilter: function(_filter) {
      if (_filter != 'all') {
        return _.invoke(this.where({filter: _filter}), 'toJSON');
      }
      return this.toJSON();
    },

  });


  var GalleryView = Backbone.View.extend({

    el: '#galleryView',

    template: Handlebars.compile(tpl),

    model: new (Backbone.Model.extend({
      defaults: {
        currentPage: 0,
        itemsOnPage: 5,
        filter: 'all'
      }
    })),

    events: {
      'change #gallery-filter' : 'changeFilter'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.setListeners();

      // Fetch collection
      this.collection = new GalleryCollection();
      this.collection.reset(galleryHelper)
      this.render(false);
    },

    setListeners: function() {
      this.model.on('change:currentPage', this.render.bind(this));
      this.model.on('change:filter', this.render.bind(this));
    },

    render: function(dont_scroll) {
      if (!!dont_scroll) {
        this.scrollToTop();
      }

      this.$el.html(this.template({
        gallery: this.collection.getPaginatedCollection(this.model.get('currentPage'),this.model.get('itemsOnPage'),this.model.get('filter')),
        gallery_length: this.collection.getCount(this.model.get('filter'))
      }));

      this.cache();

      this.initPaginate();
      this.initChosen();
    },

    cache: function() {
      this.$paginator = this.$el.find('#gallery-paginator');
      this.$filters = this.$el.find('#gallery-filter');
    },

    // Inits after render
    initPaginate: function(){
      // pagination
      this.$paginator.pagination({
        items: this.collection.getCount(this.model.get('filter')),
        itemsOnPage: this.model.get('itemsOnPage'),
        currentPage: this.model.get('currentPage') + 1,
        displayedPages: 3,
        edges: 1,
        selectOnClick: false,
        prevText: '<svg><use xlink:href="#shape-arrow-left"></use></svg>',
        nextText: '<svg><use xlink:href="#shape-arrow-right"></use></svg>',
        onInit: function() {
          var len = this.collection.getCount(this.model.get('filter'));
          this.$paginator.toggleClass('-hidden', (len <= this.model.get('itemsOnPage')));
        }.bind(this),

        onPageClick: _.bind(function(page, e){
          e && e.preventDefault();
          this.$paginator.pagination('drawPage', page);
          this.model.set('currentPage', page-1);
        }, this )
      });
    },

    initChosen: function() {
      this.$filters.val(this.model.get('filter'));

      // chosen
      this.$filters.chosen({
        disable_search: true
      });
    },

    scrollToTop: function() {
      $("html, body").animate({
        scrollTop: this.$el.offset().top
      }, 250)
    },

    changeFilter: function(e) {
      this.model.set('currentPage', 0, { silent:true })
      this.model.set('filter', $(e.currentTarget).val());
    }

  });

  return GalleryView;

});
