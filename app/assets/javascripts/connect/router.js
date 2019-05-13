/* eslint-disable */
define(
  [
    'jquery',
    'backbone',
    'underscore',
    'mps',
    'urijs/URI',
    'models/UserModel',
    'connect/views/UserFormView',
    'connect/views/SubscriptionListView',
    'connect/views/SubscriptionNewView',
    'connect/views/LoginView',
    'connect/views/SubHeaderView',
    'views/NotificationsView',
    'views/SourceModalView'
  ],
  function(
    $,
    Backbone,
    _,
    mps,
    URI,
    User,
    UserFormView,
    SubscriptionListView,
    SubscriptionNewView,
    LoginView,
    SubHeaderView,
    NotificationsView,
    SourceModalView
  ) {
    'use strict';

    var Router = Backbone.Router.extend({
      $el: $('.my-gfw-container'),

      status: new (Backbone.Model.extend({
        page: null,
        views: []
      }))(),

      params: new (Backbone.Model.extend())(),

      routes: {
        '': 'profilePage',
        my_gfw: 'profilePage',
        'my_gfw/login': 'loginPage',
        'my_gfw/subscriptions': 'subscriptionsPage',
        'my_gfw/subscriptions/new(?*query)': 'subscriptionsNewPage'
      },

      routeViews: {
        login: LoginView,
        profile: UserFormView,
        subscriptions: SubscriptionListView,
        'subscriptions/new': SubscriptionNewView
      },

      initialize: function() {
        // Setting listeners
        this.initCommonViews();
        this.setSubscriptions();
        this.setEvents();
      },

      setEvents: function() {
        this.status.on('change:page', this.changePage.bind(this));
        this.params.on('change', this.updateUrl, this);
      },

      setSubscriptions: function() {
        mps.subscribe('Router/change', this.setParams.bind(this));
      },

      startHistory: function() {
        if (!Backbone.History.started) {
          Backbone.history.start({
            pushState: true
          });
        }
      },

      /**
       * Setting new params and update it
       * @param {Object} params
       */
      setParams: function(params) {
        this.params.clear({ silent: true }).set(params);
      },

      /**
       * Namespace to get current params
       */
      getParams: function() {
        return this.params.attributes;
      },

      /**
       * Get current fragment url
       * @return {[type]} [description]
       */
      getCurrent: function() {
        var Router = this,
          fragment = Backbone.history.getFragment(),
          routes = _.pairs(Router.routes),
          route = null,
          matched;

        matched = _.find(routes, function(handler) {
          route = _.isRegExp(handler[0])
            ? handler[0]
            : Router._routeToRegExp(handler[0]);
          return route.test(fragment);
        });

        if (matched) {
          // NEW: Extracts the params using the internal
          // function _extractParameters
          // params = Router._extractParameters(route, fragment);
          route = matched[1];
        }

        return route;
      },

      /**
       * Change URL with current params
       */
      updateUrl: function() {
        var uri = new URI();
        var params = _.omit(this.getParams(), 'vars', 'defaults', 'isUpload');
        uri.query(this._serializeParams(params));
        this.navigate(uri.path().slice(1) + uri.search(), { trigger: false });
        mps.publish('Router/params', [params]);
      },

      /**
       * Transform URL string params to object
       * @param  {String} paramsQuery
       * @return {Object}
       * @example https://medialize.github.io/URI.js/docs.html
       */
      _unserializeParams: function(paramsQuery) {
        var params = {};
        if (typeof paramsQuery === 'string' && paramsQuery.length) {
          var uri = new URI();
          uri.query(paramsQuery);
          params = uri.search(true);
        }
        return params;
      },

      /**
       * Transform object params to URL string
       * @param  {Object} params
       * @return {String}
       * @example https://medialize.github.io/URI.js/docs.html
       */
      _serializeParams: function(params) {
        var uri = new URI();

        if (params.params) {
          var currentParams = _.omit(params, 'params');
          var mainParams = {};

          _.each(currentParams, function(value, key) {
            if (value) {
              mainParams[key] = value;
            }
          });

          _.each(params.params, function(value, key) {
            if (!_.isObject(value) && value) {
              mainParams[key] = value;
            } else if (_.isObject(value)) {
              _.each(value, function(objectValue, objectKey) {
                if (objectValue) {
                  mainParams[objectKey] = objectValue;
                }
              });
            }
          });

          uri.search(mainParams);
        } else {
          uri.search(params);
        }
        return uri.search();
      },

      navigateTo: function(route, options) {
        this.navigate(route, options);
      },

      // This function is from Backbone and it will be executed everytime a route change
      execute: function(callback, args, name) {
        if (!this.alreadyLoggedIn) {
          this.user = new User();
          this.user
            .fetch()
            .then(
              function() {
                this.alreadyLoggedIn = true;
                if (callback) {
                  callback.apply(this, args);
                }
              }.bind(this)
            )

            .fail(
              function() {
                var currentPage = this.getCurrent();

                if (currentPage === 'subscriptionsNewPage') {
                  this.alreadyLoggedIn = false;
                  this.subscriptionsNewPage();
                } else {
                  this.loginPage();
                }
              }.bind(this)
            );
        } else {
          if (callback) {
            callback.apply(this, args);
          }
        }
      },

      /**
       * CHANGES
       * - changePage
       */
      changePage: function() {
        var page = this.status.get('page');

        // Set active
        this.subHeaderView.setPage(page);

        // Remove existing views
        _.each(
          this.status.get('views'),
          function(view) {
            view.remove();
          }.bind(this)
        );

        // Add new view
        var view = new this.routeViews[page](this, this.user, this.getParams());
        this.$el.html(view.el);
        view.delegateEvents();

        if (view.show !== undefined) {
          view.show();
        }
      },

      /**
       * ROUTE PAGES
       * - profilePage
       * - subscriptionsPage
       * - loginPage
       */
      initCommonViews: function() {
        this.subHeaderView = new SubHeaderView({
          el: '#my-gfw-profile-nav',
          router: this
        });

        new SourceModalView();
        new NotificationsView();
      },

      profilePage: function() {
        this.status.set('page', 'profile');
      },

      loginPage: function() {
        this.status.set('page', 'login');
      },

      subscriptionsPage: function() {
        this.status.set('page', 'subscriptions');
      },

      subscriptionsNewPage: function(params) {
        var uri = new URI();
        var newParams = uri.search(true);

        if (this.alreadyLoggedIn) {
          this.setParams(newParams);
        }
        this.status.set('page', 'subscriptions/new');
      }
    });

    return Router;
  }
);
