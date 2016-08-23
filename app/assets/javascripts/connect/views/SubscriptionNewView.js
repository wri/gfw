define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'text!connect/templates/subscriptionNew.handlebars'
], function($, Backbone, Handlebars, _, mps, tpl) {

  'use strict';

  var SubscriptionNewView = Backbone.View.extend({
    
    status: new (Backbone.Model.extend({
      aoi: null
    })),

    template: Handlebars.compile(tpl),

    events: {
      'change #aoi': 'onChangeAOI'
    },

    initialize: function() {
      this.listeners();
      this.render();
    },

    listeners: function() {
      this.status.on('change:aoi', this.changeAOI.bind(this));
    },

    render: function() {
      this.$el.html(this.template({}));
      this.cache();
    },

    cache: function() {
      this.$form = this.$el.find('#new-subscription');
    },

    /**
     * CHANGE EVENTS
     * - changeAOI
     */
    changeAOI: function() {
      var aoi = this.status.get('aoi');
      console.log(aoi);
    },


    /**
     * UI EVENTS
     * - onChangeAOI
     */
    onChangeAOI: function(e) {
      e && e.preventDefault();
      this.status.set('aoi', $(e.currentTarget).val());
    }
  });

  return SubscriptionNewView;

});
