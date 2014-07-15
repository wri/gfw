/**
 * The TimelineView class for the Google Map.
 *
 * @return TimelineView class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/TimelinePresenter',
  'views/timeline/UMDLossTimeline',
  'views/timeline/ModisTimeline',
  'views/timeline/FiresTimeline'
], function(Backbone, _, Presenter, UMDLossTimeline, ModisTimeline, FiresTimeline) {

  'use strict';

  var TimelineView = Backbone.View.extend({

    className: 'timeline',

    timelineViews: {
      umd_tree_loss_gain: UMDLossTimeline,
      modis: ModisTimeline,
      fires: FiresTimeline
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.currentTimeline = null;
      this.render();
    },

    render: function() {
      $('.map-container').append(this.el);
      this.$el.hide();
    },

    /**
     * Set multiple timelayers. Maybe we can pass just one baselayers.
     * However, layer will be validated to , at this point, there will
     * be just one baselayer.
     *
     * @param {object} baselasyer
     */
    setTimeline: function(baselayers, date) {
      if (this.currentTimeline) {
        this.currentTimeline.remove();
        this.currentTimeline = null;
      }

      _.each(this.timelineViews, _.bind(function(View, layerSlug) {
        if (baselayers[layerSlug]) {
          this.currentTimeline = new View(baselayers[layerSlug], date);
          this.$el.show();
        }
      }, this));

      if (!this.currentTimeline) {
        this.$el.hide();
      }
    },

    getCurrentDate: function() {
      if (this.currentTimeline) {
        return this.currentTimeline.getCurrentDate();}

      return;
    }
  });

  return TimelineView;
});
