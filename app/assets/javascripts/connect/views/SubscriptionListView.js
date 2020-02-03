define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'core/View',
  'mps',
  'map/utils',
  'simplePagination',
  'connect/collections/Subscriptions',
  'connect/views/SubscriptionListItemView',
  'connect/views/SubscriptionNewConfirmationView',
  'text!connect/templates/subscriptionList.handlebars'
], function($,
  Backbone,
  Handlebars,
  _,
  View,
  mps,
  utils,
  simplePagination,
  Subscriptions,
  SubscriptionListItemView,
  SubscriptionNewConfirmationView,
  tpl) {

  'use strict';

  var SubscriptionListModel = Backbone.Model.extend({
    defaults: {
      perpage: 10,
      page: 1
    }
  });


  var SubscriptionListView = View.extend({
    template: Handlebars.compile(tpl),

    initialize: function(router, user) {
      View.prototype.initialize.apply(this);

      this.user = user;
      this.model = new SubscriptionListModel();
      this.subscriptions = new Subscriptions();
      this.listenTo(this.subscriptions, 'sync remove', this.render);
      this.subscriptions.fetch();

      this.render();
    },

    _subscriptions: [
      // MPS
      {
        'Subscriptions/new': function(subscription) {
          this.confirmationView(subscription);
        }
      }
    ],

    cache: function() {
      this.$container = $('.my-gfw-container');
    },

    render: function() {
      var calledAfterSync = arguments.length > 0;
      this.$el.html(this.template({
        showSpinner: !calledAfterSync && this.subscriptions.length === 0,
        subscriptions: this.subscriptions.toJSON()
      }));

      var $tableBody = this.$('#subscriptions-list');
      var paginatedSubscriptions = this.getPaginateSubscriptions();
      if (!!paginatedSubscriptions.length) {
        _.each(paginatedSubscriptions, function(subscription) {
          var view = new SubscriptionListItemView({
            subscription: subscription,
            user: this.user
          });
          $tableBody.append(view.el);
        }.bind(this));
        if (this.subscriptions.length/this.model.get('perpage') > 1) {
          this.initPaginate();
        }
      } else {
        if (this.model.get('page') != 1) {
          this.model.set('page', this.model.get('page') - 1);
          this.render();
        }
      }
      this.cache();
    },

    renderList: function() {

    },

    show: function() {
      var urlParams = _.parseUrl();
      if (urlParams.subscription_confirmed === 'true') {
        mps.publish('Notification/open', ['notification-my-gfw-subscription-confirmed']);
      }

      if (urlParams.subscription_confirmation_sent === 'true') {
        mps.publish('Notification/open', ['notification-my-gfw-subscription-confirmation-sent']);
      }

      if (urlParams.unsubscribed === 'true' || urlParams.unsubscription_confirmed === 'true') {
        mps.publish('Notification/open', ['notification-my-gfw-subscription-deleted']);
      }

      if (urlParams.migration_successful === 'true') {
        mps.publish('Notification/open', ['notification-my-gfw-subscription-migrated']);
      }

      if (urlParams.migration_id !== undefined) {
        window.location = window.gfw.config.GFW_API_OLD + '/v2/migrations/' +
          urlParams.migration_id + '/migrate';
      }
    },

    initPaginate: function(){
      var options = this.getPaginateOptions();
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
    },

    confirmationView: function(subscription) {
      this.confimationView = new SubscriptionNewConfirmationView();
      this.$container.append(this.confimationView.render({
        uploadedData: subscription.isUpload
      }).el);
    }

  });

  return SubscriptionListView;

});
