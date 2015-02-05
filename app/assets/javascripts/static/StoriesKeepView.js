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

  var StoriesKeepModel = Backbone.Model.extend({
    defaults: {
      total: null,
      perpage: null,
      page: null
    },
    initialize: function(options){

    }
  })


  var StoriesKeepView = Backbone.View.extend({

    el: '#storiesKeepView',

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //CACHE
      this.paginationContainer = $('#pagination-container');

      //VARS
      this.model = new StoriesKeepModel();
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
          // window.location = this.url + '?page=' + pageNumber;
          this.paginationContainer.pagination('drawPage', pageNumber);
          this.loadAjaxStories(pageNumber)

        }, this )
      });
    },

    loadAjaxStories: function(page){
      $.ajax({
        url: '/stayinformed-stories.json',
        type: 'GET',
        dataType: 'json',
        data: {
          for_stay: true,
          page: page,
          perpage: 5
        },
        success: function(data){
          console.log(data);
        },
        error: function(){
          console.log('adios');
        }
      })
    }

  });

  return StoriesKeepView;

});

