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

    /**
     * Map layer slugs with subscription url topics.
     */
    topics: {
      'forma': 'updates/forma'
    },

    events: {
      'click #subscribe': '_subscribeAlerts',
      'click .next': 'nextStep',
      'click .back': 'previousStep'
    },

    /**
     * Initialize the DialogView.
     *
     * @param  {Object} parent           DialogView public methods
     * @param  {Object} analysisResource The analysis resource.
     */
    initialize: function(parent, options) {
      _.extend(this, parent);
      this.analysisResource = options.analysisResource;
      this.layer = options.layer;
      this.$el.html(this.template());
    },

    _subscribeAlerts: function() {
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
    },

    _successSubscription: function(data, textStatus, jqXHR) {
      this.nextStep();
    }

  });

  return AnalysisSubscribeDialogView;
});
