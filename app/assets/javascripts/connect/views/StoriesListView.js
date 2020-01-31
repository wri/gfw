define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'map/utils',
  'simplePagination',
  'connect/collections/Stories',
  'connect/views/StoriesListItemView',
  'text!connect/templates/storiesList.handlebars'
], function(
  $,
  Backbone,
  Handlebars,
  _,
  mps,
  utils,
  simplePagination,
  Stories,
  StoriesListItemView,
  tpl
) {

  'use strict';

  var StoriesListModel = Backbone.Model.extend({
    defaults: {
      perpage: 10,
      page: 1
    }
  });

  var StoriesListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),

    initialize: function(router, user) {
      this.user = user;
      this.model = new StoriesListModel();
      this.stories = new Stories();
      this.listenTo(this.stories, 'sync remove', this.render);
      this.stories.fetch();

      this.render();
    },

    render: function() {
      var calledAfterSync = arguments.length > 0;
      this.$el.html(this.template({
        showSpinner: !calledAfterSync && this.stories.length === 0,
        stories: this.stories.toJSON()
      }));

      var $tableBody = this.$('#my-gfw-stories-table-body');
      var paginatedStories = this.getPaginatedStories();
      if (!!paginatedStories.length) {
        _.each(paginatedStories, function(story) {
          var view = new StoriesListItemView({
            story: story,
            user: this.user
          });
          $tableBody.append(view.el);
        }.bind(this));
        if (this.stories.length/this.model.get('perpage') > 1) {
          this.initPaginate();
        }
      } else {
        if (this.model.get('page') != 1) {
          this.model.set('page', this.model.get('page') - 1);
          this.render();
        }
      }
    },

    //show: function() {
      //var urlParams = _.parseUrl();
      //if (urlParams.subscription_confirmed === 'true') {
        //mps.publish('Notification/open', ['notification-my-gfw-subscription-confirmed']);
      //}

      //if (urlParams.subscription_confirmation_sent === 'true') {
        //mps.publish('Notification/open', ['notification-my-gfw-subscription-confirmation-sent']);
      //}

      //if (urlParams.unsubscribed === 'true') {
        //mps.publish('Notification/open', ['notification-my-gfw-subscription-deleted']);
      //}

      //if (urlParams.migration_successful === 'true') {
        //mps.publish('Notification/open', ['notification-my-gfw-subscription-migrated']);
      //}

      //if (urlParams.migration_id !== undefined) {
        //window.location = window.gfw.config.GFW_API_OLD + '/v2/migrations/' +
          //urlParams.migration_id + '/migrate';
      //}
    //},

    initPaginate: function(){
      var options = this.getPaginateOptions();
      this.$paginationContainer = $('#my-gfw-stories-pagination');
      this.$paginationContainer.pagination(options);
    },

    getPaginatedStories: function() {
      var start = this.model.get('perpage') * (this.model.get('page') - 1);
      var end = this.model.get('perpage') * (this.model.get('page') - 1) + this.model.get('perpage');
      return this.stories.slice(start, end);
    },

    getPaginateOptions: function() {
      return {
        items: this.stories.toJSON().length,
        itemsOnPage : this.model.get('perpage'),
        currentPage : this.model.get('page'),
        displayedPages: 3,
        selectOnClick: false,
        prevText: '<svg><use xlink:href="#shape-arrow-left"></use></svg>',
        nextText: '<svg><use xlink:href="#shape-arrow-right"></use></svg>',
        onPageClick: function(pageNumber, event){
          event.preventDefault();
          this.model.set('page', pageNumber);
          this.$paginationContainer.pagination('drawPage', pageNumber);
          this.render();
          window.scrollTo(0,0);
        }.bind(this)
      };
    }

  });

  return StoriesListView;

});
