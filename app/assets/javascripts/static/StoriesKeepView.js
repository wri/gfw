/**
 * The StoriesKeep view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'simplePagination'
], function($,Backbone,underscore,simplePagination) {

  'use strict';

  var StoriesKeepView = Backbone.View.extend({

    el: '#storiesKeepView',

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //CACHE
      this.paginationContainer = $('#pagination-container');

      //VARS
      this.url = '/stayinformed/crowdsourced-stories'

      this.initPaginate();
    },

    initPaginate: function(){
      var total = this.paginationContainer.data('total');
      var perpage = this.paginationContainer.data('perpage');
      var page = this.paginationContainer.data('page');
      // pagination
      this.paginationContainer.pagination({
        items: total,
        itemsOnPage : perpage,
        currentPage : page,
        displayedPages: 3,
        selectOnClick: false,
        prevText: ' ',
        nextText: ' ',
        onPageClick: _.bind(function(pageNumber, event){
          event.preventDefault();
          window.location = this.url + '?page=' + pageNumber;
        }, this )
      });
    }



  });

  return StoriesKeepView;

});

