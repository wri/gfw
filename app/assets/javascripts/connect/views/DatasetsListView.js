/**
 * The SubscriptionDatasetsList view.
 *
 * @return SubscriptionDatasetsList view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'core/View',
  'text!connect/templates/subscriptionDatasetsList.handlebars',
], function(_, Handlebars, mps, View, datasetTpl) {

  'use strict';

  var SubscriptionDatasetsList = View.extend({
    model: new (Backbone.Model.extend({
    })),

    el: '#datasets-list',

    templateDatasets: Handlebars.compile(datasetTpl),

    events: {
    },

    initialize: function() {
      // console.log('lalala dataset');
      // console.log(this.$el);
      // if (!this.$el.length) {
      //   console.log('bye', this.$el.length);
      //   return;
      // }

      View.prototype.initialize.apply(this);

      this.cache();
      this.renderDatasetsList();
    },

    listeners: function() {
    },

    cache: function() {
      this.$datasetsField = this.$el.find('#datasets-field');
    },


    /**
     * CHANGE EVENTS
    */
    changeCountry: function() {
    },

    changeLayers: function() {
    },

    changeLayerSelectId: function() {
    },


    /**
     * RENDERS
    */
    renderDatasetsList: function() {
      console.log('render');
      // this.$datasetsField.html('lala');
      console.log(this.datasetsField);
      // this.$datasetsField.html(this.templateDatasets({
      //   id: 'select-layers'
      // }));

      // this.$datasetsField.html('lalala');
      //
      // console.log('hola', this.$datasetsField);
    },

    renderCountries: function() {
    },


    /**
     * UI EVENTS
     * - onChangeCountry
     * - onChangeLayer
    */
    onChangeCountry: function(e) {
      e && e.preventDefault();

    },

    onChangeLayer: function(e) {
      e && e.preventDefault();

    }
  });

  return SubscriptionDatasetsList;

});
