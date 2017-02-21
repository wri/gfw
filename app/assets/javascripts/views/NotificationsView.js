/**
 * The NotificationsView view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'presenters/NotificationsPresenter',
], function($,Backbone, _, Presenter) {

  'use strict';

  var NotificationsModel = Backbone.Model.extend({
    defaults: {
      hidden: true,
    }
  });

  var NotificationsView = Backbone.View.extend({

    el: '#notifications',

    events: {
      'mouseover' : 'onEnter',
      'mouseout' : 'onLeave',
      'click .close': 'hide',
      'click .action': 'triggerAction',
    },

    initialize: function() {
      // Model
      this.presenter = new Presenter(this);
      this.model = new NotificationsModel();

      // Init
      this.cacheVars();
      this.model.on("change:hidden", this._toggle, this);
    },

    cacheVars: function(){
      this.timeout = null;
      this.$notifContent = this.$el.find('.content');
    },

    _toggle: function() {
      if (this.model.get('hidden')) {
        this.$el.removeClass('active');
      }else{
        this.$el.addClass('active');
        clearTimeout(this.timeout);
        this.timeout = setTimeout(_.bind( function(){
          this.hide();
        } , this ), 5000);
      }
    },

    hide: function(e) {
      e && e.preventDefault();
      clearTimeout(this.timeout);
      this.model.set('hidden', true);
    },

    show: function(source) {
      var $notif = $('#'+source);
      // Add class of notification to this.$el
      this.$el.removeClass('success warning info error').addClass($notif.data('type'));
      // Add content to notification content
      this.$notifContent.html($notif.clone().html());
      this.$notifContent.prepend('<svg><use xlink:href="#icon-'+$notif.data('type')+'"></use></svg>');
      //Active notifications
      this.model.set('hidden', false);
    },

    showCustom: function(info, type) {
      // Add class of notification to this.$el
      this.$el.removeClass('success warning info error').addClass(type);
      // Add content to notification content
      this.$notifContent.html(info);
      this.$notifContent.prepend('<svg><use xlink:href="#icon-'+type+'"></use></svg>');
      //Active notifications
      this.model.set('hidden', false);
    },

    triggerAction: function(e){
      var action = $(e.currentTarget).data('action');
      var options = $(e.currentTarget).data('options') || {};
      this.presenter.publishAction(action, options)
      this.hide();
    },

    onEnter: function(){
      clearTimeout(this.timeout);
    },

    onLeave: function(){
      clearTimeout(this.timeout);
      this.timeout = setTimeout(_.bind( function(){
        this.hide();
      } , this ), 5000);
    }


  });
  return NotificationsView;
});
