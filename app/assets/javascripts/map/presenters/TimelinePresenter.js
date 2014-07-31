/**
 * The Timeline view presenter.
 *
 * @return TimelinePresenter class
 */
define([
  'Class',
  'underscore',
  'mps',
  'views/timeline/UMDLossTimeline',
  'views/timeline/FormaTimeline',
  'views/timeline/ImazonTimeline',
  'views/timeline/ModisTimeline',
  'views/timeline/FiresTimeline',
], function(Class, _, mps, UMDLossTimeline, FormaTimeline, ImazonTimeline, ModisTimeline,
    FiresTimeline) {

  'use strict';

  var TimelinePresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this.currentTimeline = null;
      this._subscribe();
    },

    timelineViews: {
      umd_tree_loss_gain: UMDLossTimeline,
      forma: FormaTimeline,
      imazon: ImazonTimeline,
      modis: ModisTimeline,
      fires: FiresTimeline
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this._setTimeline(place.layerSpec, place.params);
        // if (!place.params.date) {
        //   mps.publish('Place/update', [{go: false}]);
        // }
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setTimeline(layerSpec);
      }, this));

      mps.subscribe('Map/center-change', _.bind(function(lat, lng){
        this.view.updateLatlng(lat, lng);
      }, this));

      mps.subscribe('AnalysisService/results', _.bind(function() {
        if (this.currentTimeline) {
          this.view.model.set({hidden: false, forceHidden: false});
        }
      }, this));

      mps.subscribe('AnalysisTool/start-drawing', _.bind(function() {
        if (this.currentTimeline) {
          this.view.model.set({hidden: true, forceHidden: true});
        }
      }, this));

      mps.publish('Place/register', [this]);
    },

    _timelineDisabled: function() {
      mps.publish('Timeline/disabled', []);
    },

    _timelineEnabled: function(layerSlug) {
      mps.publish('Timeline/enabled', [layerSlug]);
    },

    /**
     * Add/delete timeline depend on the current active layers.
     *
     * @param {object} layerSpec
     */
    _setTimeline: function(layerSpec, placeParams) {
      var currentDate = null;
      var baselayer = _.intersection(_.pluck(layerSpec.getBaselayers(),
        'slug'), _.keys(this.timelineViews))[0];

      if (this.currentTimeline) {
        if (this.currentTimeline.getName() === baselayer) {return;}
        this._removeTimeline();
      }

      if (!baselayer) {
        this._timelineDisabled();
        return;
      }

      if (!this.currentTimeline && baselayer) {
        this._timelineEnabled(baselayer.slug);
      }

      if (placeParams && placeParams.begin && placeParams.end) {
        currentDate = [placeParams.begin, placeParams.end];
      }

      baselayer = layerSpec.getLayer({slug: baselayer});
      this.view.update(baselayer);
      this.currentTimeline = new this.timelineViews[baselayer.slug](baselayer, currentDate);
      this.view.model.set('hidden', false);
    },

    /**
     * Remove the current timeline view.
     */
    _removeTimeline: function() {
      if (!this.currentTimeline) {return;}
      this.currentTimeline.remove();
      this.currentTimeline = null;
      this.view.model.set('hidden', true);
    },

    /**
     * Called by PlaceService. Return place parameters representing the
     * of the current timeline.
     *
     * @return {object} begin/end params
     */
    getPlaceParams: function() {
      var p = {};
      var date = this.currentTimeline ? this.currentTimeline.getCurrentDate() : [];
      p.begin = date[0] || null;
      p.end = date[1] || null;
      return p;
    }

  });

  return TimelinePresenter;

});
