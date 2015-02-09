/**
 * The StoriesKeep view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'mps',
  'simplePagination',
  'text!static/templates/storiesKeep.handlebars',
], function($,Backbone,underscore,Handlebars,mps,simplePagination, storiesTPL) {

  'use strict';

  var StoriesKeepModel = Backbone.Model.extend({
    defaults: {
      total: null,
      perpage: null,
      page: null
    },
  })


  var StoriesKeepView = Backbone.View.extend({

    el: '#storiesKeepView',

    template: Handlebars.compile(storiesTPL),

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      //CACHE
      this.$htmlbody = $('html, body');
      this.$sideBar = $('#sidebarNavView');
      this.$sourcesBox = $('#sources-box');
      this.$container = $('#crowdsourced-stories');
      this.$spinner = $('#sources-spinner');
      this.$listContainer = $('#storiesKeepList');
      this.$paginationContainer = $('#pagination-container');

      //VARS
      this.model = new StoriesKeepModel({
        total: this.$paginationContainer.data('total'),
        perpage: this.$paginationContainer.data('perpage'),
        page: this.$paginationContainer.data('page')
      });

      this.initPaginate();
    },

    initPaginate: function(){
      // pagination
      this.$paginationContainer.pagination({
        items: this.model.get('total'),
        itemsOnPage : this.model.get('perpage'),
        currentPage : this.model.get('page'),
        displayedPages: 3,
        selectOnClick: false,
        prevText: ' ',
        nextText: ' ',
        onPageClick: _.bind(function(pageNumber, event){
          event.preventDefault();
          this.$paginationContainer.pagination('drawPage', pageNumber);
          this.$spinner.addClass('start');
          this.$container.addClass('start');
          ($(window).width() >= 850 ) ? this.$htmlbody.animate({ scrollTop: this.$sideBar.offset().top }, 500) : this.$sourcesBox.animate({ scrollTop: 0 }, 500);
          this.loadAjaxStories(pageNumber);
          mps.publish('SourceStatic/Silentupdate',[{section: 'crowdsourced-stories', page: pageNumber}]);

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
          perpage: this.model.get('perpage')
        },
        success: _.bind(function(data){
          this.parse(data);
        }, this ),
        error: function(err){
          console.log(err);
        }
      })
    },

    parse: function(data){
      this.data = _.map(data, _.bind(function(item){
        var img = (! item.media.length) ? null : item.media[item.media.length -1].preview_url;
        var detail = (item.details.length > 295) ? item.details.substr(0, 295)+'...' : item.details;
        return {
          id: item.id,
          title: item.title,
          details: detail,
          link: '/stories/'+item.id,
          map: (img) ? 'http://gfw2stories.s3.amazonaws.com/uploads/' + img : 'https://maps.googleapis.com/maps/api/staticmap?center=' + item.lat + ',' + item.lng + '&zoom=2&size=80x80',
        }
      }, this ));

      this.render();
    },

    render: function(){
      this.$spinner.removeClass('start');
      this.$container.removeClass('start');
      this.$listContainer.html(this.template({ stories : this.data }));
      mps.publish('SubItem/change');
    }

  });

  return StoriesKeepView;

});

