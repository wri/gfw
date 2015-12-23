/**
 * The SubscribeView module.
 *
 * @return SubscribeView class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'handlebars',
  'map/presenters/tabs/SubscribePresenter',
  'text!map/templates/tabs/subscribe.handlebars'
], function(Backbone, _, Handlebars, Presenter, tpl) {
  'use strict';

  var getCookie = function(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) { return parts.pop().split(';').shift(); }
  };

  var User = Backbone.Model.extend({
    url: window.gfw.config.GFW_API_HOST + '/user/session',

    loadFromCookie: function() {
      var authCookie = getCookie('_eauth');

      if (authCookie !== undefined) {
        this.set('cookie', authCookie);
        this.fetch({
          xhrFields: {
            withCredentials: true
          }
        });
      }
    }
  });

  var SubscribeView = Backbone.View.extend({

    el: '#analysis-subscribe',

    template: Handlebars.compile(tpl),

    events: {
      'click .close-icon' : 'hide',
      'click #subscribe': 'subscribeAlerts',
    },

    initialize: function(){
      this.presenter = new Presenter(this);

      this.user = new User();
      this.listenTo(this.user, 'sync', this.render);
      this.user.loadFromCookie();

      this.render();
    },

    render: function(){
      this.$el.html(this.template({
        email: this.user.get('email')
      }));

      this.cacheVars();

      return this;
    },

    cacheVars: function(){
      this.$content = this.$el.find('.analysis-subscribe-content');
      this.$steps = this.$el.find('.steps');
    },

    show: function(options){
      this.analysisResource = options.analysisResource;
      this.$el.addClass('active');
      this.$content.addClass('active');
    },

    hide: function(){
      this.$el.removeClass('active');
      this.$content.removeClass('active');
      this.nextStep(0);
      this.presenter.hide();
    },

    subscribeAlerts: function() {
      var email = this.$el.find('#areaEmail').val();
      var topic = 'Subscribe to alerts';

      var data = {
        topic: topic,
        email: email
      };

      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + data.topic + ', Email: ' + data.email);

      if (this.analysisResource.type === 'geojson') {
        data.geom = JSON.parse(this.analysisResource.geojson);
      }else{
        data.geom = (this.analysisResource.geom) ? this.analysisResource.geom.geometry : this.presenter.geom_for_subscription;
      }

      if (this.validateEmail(email)) {
        $.ajax({
          type: 'POST',
          url: window.gfw.config.GFW_API_HOST + 'subscribe',
          crossDomain: true,
          xhrFields: { withCredentials: true },
          data: JSON.stringify(data),
          dataType: 'json',
          success: _.bind(this._successSubscription, this),
          error: this.remove.bind(this)
        });
      }else{
        this.presenter.notificate('email-incorrect');
      }
    },

    validateEmail: function(email){
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    _successSubscription: function(data, textStatus, jqXHR) {
      this.presenter.subscribeEnd();
      this.nextStep(1);
    },

    nextStep: function(index){
      this.$steps.removeClass('current')
      this.$steps.eq(index).addClass('current');
    }

  });

  return SubscribeView;
});
