require([
  'jquery', 'underscore', 'backbone',
  'connect/views/UserFormView',
  'connect/views/SubscriptionListView'
], function($, _, Backbone, UserFormView, SubscriptionListView) {

  'use strict';

  var ConnectView = Backbone.View.extend({
    el: '#my-gfw',

    events: {
      'click .tabs h3'  : '_toggleTab'
    },

    initialize: function() {
      this.subViews = {};
      this.availableViews = {
        profile: UserFormView,
        subscriptions: SubscriptionListView
      };

      this.render();
    },

    render: function() {
      if (_.isEmpty(this.subViews)) {
        this._showView('profile');
      }

      return this;
    },

    _toggleTab: function(e) {
      var $el = $(e.target);
      if ($el.hasClass('current')) { return; }
      this.$('.tabs h3').removeClass('current');
      $el.addClass('current');

      var selectedTab = $el.data('tab');
      this._showView(selectedTab);
    },

    _showView: function(viewName) {
      if (this.subViews[viewName] === undefined) {
        this.subViews[viewName] = new this.availableViews[viewName]();
        this.subViews[viewName].render();
      }
      this.$('#current-tab').html(this.subViews[viewName].el);
      this.subViews[viewName].delegateEvents();
    }
  });

  new ConnectView();

});
