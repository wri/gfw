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

  var SubscribeModel = Backbone.Model.extend({
    defaults: {
      hidden: true
    }
  });


  var SubscribeView = Backbone.View.extend({

    el: '#analysis-subscribe',

    template: Handlebars.compile(tpl),

    /**
     * Map layer slugs with subscription url topics.
     */
    topics: {
      'forma': 'updates/forma'
    },

    events: {
      'click .close-icon' : 'hide',
      'click #subscribe': 'subscribeAlerts',
    },

    initialize: function(){
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function(){
      this.$el.html(this.template());
      this.cacheVars();
    },

    cacheVars: function(){
      this.$content = this.$el.find('.analysis-subscribe-content');
      this.$steps = this.$el.find('.steps');
    },

    show: function(options){
      this.analysisResource = options.analysisResource;
      this.layer = options.layer;
      this.$el.addClass('active');
      this.$content.addClass('active');
    },

    hide: function(){
      this.$el.removeClass('active');
      this.$content.removeClass('active');
      this.nextStep(0);
    },


    subscribeAlerts: function() {
      var email = this.$el.find('#areaEmail').val();
      var topic = this.topics[this.layer.slug];

      var data = {
        topic: topic,
        email: email
      };

      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + data.topic + ', Email: ' + data.email);

      if (this.analysisResource.iso) {
        data.iso = this.analysisResource.iso;
      } else if (this.analysisResource.geojson) {
        data.geom = JSON.parse(this.analysisResource.geojson);
      }
      if (this.validateEmail(email)) {
        $.ajax({
          type: 'POST',
          url: 'http://gfw-apis.appspot.com/subscribe',
          crossDomain: true,
          data: JSON.stringify(data),
          dataType: 'json',
          success: _.bind(this._successSubscription, this),
          error: _.bind(function(responseData, textStatus, errorThrown) {
            this.remove();
          }, this)
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
      this.nextStep(1);
    },

    nextStep: function(index){
      this.$steps.removeClass('current')
      this.$steps.eq(index).addClass('current');
    }

  });

  return SubscribeView;
});
