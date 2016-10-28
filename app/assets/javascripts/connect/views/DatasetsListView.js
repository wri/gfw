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
  'helpers/datasetsHelper',
  'map/services/CoverageService',
  'text!connect/templates/subscriptionDatasetsList.handlebars',
], function(_, Handlebars, mps, View, datasetsHelper, CoverageService, datasetTpl) {

  'use strict';

  var SubscriptionDatasetsList = View.extend({
    model: new (Backbone.Model.extend({
    })),

    el: '#datasets-selection',

    templateDatasets: Handlebars.compile(datasetTpl),

    events: {
    },

    initialize: function() {
      if (!this.$el.length) {
        return;
      }

      View.prototype.initialize.apply(this);

      this.cache();
      this.renderDatasetsList();
    },

    _subscriptions: [
      // MPS
      {
        'Datasets/change': function(params) {
          this.changeDatasets(params);
        }
      }
    ],

    listeners: function() {
    },

    cache: function() {
    },


    /**
     * CHANGE EVENTS
    */
    changeDatasets: function(params) {
      var values = _.compact(_.values(params));

      if (values.length) {
        this.$el.html(this.templateDatasets({
          datasets: []
        }));

        CoverageService.get(params)
          .then(function(layers) {
            this.$el.html(this.templateDatasets({
              datasets: datasetsHelper.getFilteredList(layers)
            }));
          }.bind(this))

          .error(function(error) {
            console.log(error);
          }.bind(this));
      } else {
        this.renderDatasetsList();
      }
    },


    /**
     * RENDERS
    */
    renderDatasetsList: function() {
      var datasetsList = datasetsHelper.getListSelected([]);

      this.$el.html(this.templateDatasets({
        datasets: datasetsList
      }));
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
