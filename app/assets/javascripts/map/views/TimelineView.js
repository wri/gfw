/**
 * The TimelineView class for the Google Map.
 *
 * @return TimelineView class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/TimelinePresenter',
  'views/timeline/class/TimelineClass'
], function(Backbone, _, Presenter, TimelineClass) {

  'use strict';

  var TimelineView = Backbone.View.extend({

    timelineOpts: {
      umd_tree_loss_gain: {

      },
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.timelines = {};
    },

    setTimeline: function(layerSpec) {
      var activeLayers = {};

      _.each(layerSpec, function(category) {
        activeLayers = _.extend(activeLayers, category);
      });

      // remove timelines
      _.each(this.timelines, _.bind(function(timeline, name){
        if (!activeLayers[name]) {
          timeline.remove();
          delete this.timelines[name];
        }
      }, this));

      // render timelines
      _.each(this.timelineOpts, _.bind(function(opts, layer){
        if (activeLayers[layer] && !this.timelines[layer]) {
          this.timelines[layer] = new TimelineClass(opts);
        }
      }, this));
    }

  });

  return TimelineView;
});