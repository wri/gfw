define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'text!countries/templates/widgets/nearRealTimeAlerts.handlebars'
], function($, Backbone, _, Handlebar, tpl) {

  'use strict';

  var NearRealTimeAlertsView = Backbone.View.extend({
    el: '#widget-near-real-time-alerts',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

      this.render();
    },

    render: function() {
      this.$el.html(this.template({}));
    }
  });
  return NearRealTimeAlertsView;

});
