define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'connect/views/MapMiniView',
  'connect/views/MapMiniControlsView',
  'text!connect/templates/subscriptionNew.handlebars',
  'text!connect/templates/subscriptionNewDraw.handlebars',
  'text!connect/templates/subscriptionNewCountry.handlebars'
], function($, Backbone, Handlebars, _, mps, MapMiniView, MapMiniControlsView, tpl, tplDraw, tplCountry) {

  'use strict';

  var SubscriptionNewView = Backbone.View.extend({
    
    status: new (Backbone.Model.extend({
      aoi: null,
    })),

    templates: {
      default: Handlebars.compile(tpl),
      draw: Handlebars.compile(tplDraw),
      country: Handlebars.compile(tplCountry),
    },

    events: {
      'change #aoi': 'onChangeAOI',
    },

    initialize: function() {
      this.listeners();
      this.render();
    },

    listeners: function() {
      this.status.on('change:aoi', this.changeAOI.bind(this));
    },

    render: function() {
      this.$el.html(this.templates.default({}));
      this.cache();
    },

    renderType: function() {
      var aoi = this.status.get('aoi');
      if (!!aoi) {
        this.$formType.html(this.templates[aoi]({}));
        this.cache();
        this.initSubViews();        
      } else {
        this.$formType.html('');
      }
    },

    cache: function() {
      this.$form = this.$el.find('#new-subscription');
      this.$formType = this.$el.find('#new-subscription-content');
    },

    initSubViews: function() {
      var mapView = new MapMiniView();

      new MapMiniControlsView(mapView.map);
    },

    /**
     * CHANGE EVENTS
     * - changeAOI
     */
    changeAOI: function() {
      var aoi = this.status.get('aoi');
      this.renderType();
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
