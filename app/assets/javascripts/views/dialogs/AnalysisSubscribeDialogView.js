/**
 * The AnalysisSubscribeDialogView module.
 *
 * @return AnalysisSubscribeDialogView class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'handlebars',
  'text!templates/dialogs/analysis_subscribe.handlebars'
], function(Backbone, _, Handlebars, tpl) {
  'use strict';

  var AnalysisSubscribeDialogView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    events: {
      'click #subscribe': '_subscribeAlerts'
    },

    initialize: function(parent, options) {
      this.parent = parent;
      this.options = options;
      this.$el.html(this.template());
    },

    _subscribeAlerts: function() {
      var email = this.$el.find('#areaEmail').val();

      var data = {
        topic: 'updates/forma',
        email: email
      };

      if (this.options.iso) {
        data.iso = iso.
      }

      $.ajax({
        url: '//gfw-apis.appspot.com/subscribe',
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        data: data,
        success: _.bind(this._successSubscription, this)
      })
    },

    _successSubscription: function(data, textStatus, jqXHR) {
      this.parent.remove();

      if (data.subscribed) {

      }
    }

  });

  return AnalysisSubscribeDialogView;
});
