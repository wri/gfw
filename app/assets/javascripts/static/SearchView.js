/**
 * The Carrousel view.
 */
define([
  'jquery',
  'backbone',
  'mps'
], function($,Backbone,mps) {

  'use strict';

  var VideoView = Backbone.View.extend({

    el: '#searchView',

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //CACHE
      this.paginationContainer = $('#pagination-container');
      
      //VARS
      this.url = '/search'

      this.initPaginate();
    },

    initPaginate: function(){
      var total = this.paginationContainer.data('total');
      var perpage = this.paginationContainer.data('perpage');
      var page = this.paginationContainer.data('page');
      var query = this.paginationContainer.data('query');
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
          window.location = this.url + '?query=' + query + '&page=' + pageNumber;
        }, this )
      });      
    }

  });

  return VideoView;

});