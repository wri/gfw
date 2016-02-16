define([
  'backbone', 'handlebars', 'underscore', 'moment', 'mps', 'map/utils', 'simplePagination',
  'connect/collections/Subscriptions',
  'connect/views/SubscriptionListItemView',
  'text!connect/templates/subscriptionList.handlebars'
], function(Backbone, Handlebars, _, moment, mps, utils, simplePagination, Subscriptions, SubscriptionListItemView, tpl) {

  'use strict';

  var SubscriptionListModel = Backbone.Model.extend({
    defaults: {
      perpage: 10,
      page: 1
    }
  });


  var SubscriptionListView = Backbone.View.extend({
    template: Handlebars.compile(tpl),

    initialize: function() {
      this.model = new SubscriptionListModel();
      this.subscriptions = new Subscriptions();
      this.listenTo(this.subscriptions, 'sync remove', this.render);
      this.subscriptions.fetch();

      this.render();
    },

    render: function() {
      var calledAfterSync = arguments.length > 0;
      this.$el.html(this.template({
        showSpinner: !calledAfterSync && this.subscriptions.length === 0,
        subscriptions: this.subscriptions.toJSON()
      }));

      var $tableBody = this.$('#my-gfw-subscriptions-table-body');
      var paginatedSubscriptions = this.getPaginateSubscriptions();
      if (!!paginatedSubscriptions.length) {
        _.each(paginatedSubscriptions, function(subscription) {
          var view = new SubscriptionListItemView({
            subscription: subscription
          });
          $tableBody.append(view.el);
        });
        if (this.subscriptions.length/this.model.get('perpage') > 1) {
          this.initPaginate();
        }
      }
    },

    show: function() {
      var urlParams = _.parseUrl();
      if (urlParams.subscription_confirmed === 'true') {
        mps.publish('Notification/open', ['my-gfw-subscription-confirmed']);
      }
    },

    initPaginate: function(){
      var options = this.getPaginateOptions();
      // pagination
      this.$paginationContainer = $('#my-gfw-subscriptions-pagination');
      this.$paginationContainer.pagination(options);
    },

    getPaginateSubscriptions: function() {
      var start = this.model.get('perpage') * (this.model.get('page') - 1);
      var end = this.model.get('perpage') * (this.model.get('page') - 1) + this.model.get('perpage');
      return this.subscriptions.slice(start, end);
    },

    getPaginateOptions: function() {
      return {
        items: this.subscriptions.toJSON().length,
        itemsOnPage : this.model.get('perpage'),
        currentPage : this.model.get('page'),
        displayedPages: 3,
        selectOnClick: false,
        prevText: ' ',
        nextText: ' ',
        onPageClick: function(pageNumber, event){
          event.preventDefault();
          this.model.set('page', pageNumber);
          this.$paginationContainer.pagination('drawPage', pageNumber);
          this.render();
        }.bind(this)        
      }
    }

  });

  return SubscriptionListView;

});
