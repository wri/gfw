/**
 * The Subscription module.
 *
 * @return Subscription class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'map/presenters/AnalysisSubscriptionPresenter',
  'handlebars',
  'text!map/templates/analysisSubscription.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var Subscription = Backbone.View.extend({
    el: '#analysis-subscribe',
    template: Handlebars.compile(tpl),

    events: function() {
      return {
        'click .close': '_close',
        'click .send': '_submit'
      }
    },


    initialize: function() {
      this.presenter = new Presenter(this);
    },

    render: function() {
      this.$el.empty().append(this.template());
      $('.backdrop').fadeIn(function(){$('.analysis_subscribe').show()})
    },

    subscribeAlerts: function() {
      this.render();
    },

    _close: function() {
      var self = this;
      $('.backdrop').fadeOut(function(){self.$el.empty()})
    },

    _submit: function(e) {
      e && e.preventDefault()
      var self = this;
      //callback handler for form submit
      this.$el.find('form').submit(function(e)
      {
          var postData = $(this).serializeArray();
          var formURL = $(this).attr("action");
          $.ajax(
          {
              url : formURL,
              type: "POST",
              data : postData,
              success:function(data, textStatus, jqXHR)
              {
                  self._close();
              }
          });
          e.preventDefault(); //STOP default action
      });
      this.$el.find('form').submit(); //Submit  the FORM
        this._close();
      }

  });

  return Subscription;
});
