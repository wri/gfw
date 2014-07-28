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
      // Current timeline view
      this.current = null;
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
        this._setTimeline(place.params.layerSpec);
        if (!place.params.date) {
          mps.publish('Place/update', [{go: false}]);
        }
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setTimeline(layerSpec);
      }, this));

      mps.subscribe('Map/center-change', _.bind(function(lat, lng){
        this.view.updateLatlng(lat, lng);
      }, this));

      // Show timeline when stop drawing analysis
      mps.subscribe('AnalysisTool/stop-drawing', _.bind(function() {
        if (this.current) {
          this.view.model.set({hidden: false, forceHidden: false});
        }
      }, this));

      // Hide timeline when start drawding analysis
      mps.subscribe('AnalysisTool/start-drawing', _.bind(function() {
        if (this.current) {
          this.view.model.set({hidden: true, forceHidden: true});
        }
      }, this));
    },

    _setTimeline: function(layerSpec) {
      var baselayer = _.intersection(_.pluck(layerSpec.getBaselayers(),
        'slug'), _.keys(this.timelineViews))[0];

      if (this.current) {
        if (this.current.getName() === baselayer) {return;}
        this._removeTimeline();
      }

      if (!baselayer) {
        mps.publish('Timeline/disabled', []);
        return;
      }

      if (!this.current && baselayer) {
        mps.publish('Timeline/enabled', []);
      }

      baselayer = layerSpec.getLayer({slug: baselayer});
      this.view.update(baselayer);
      this.current = new this.timelineViews[baselayer.slug](baselayer);
      this.view.model.set('hidden', false);
    },

    /**
     * Remove the current Timeline
     */
    _removeTimeline: function() {
      if (!this.current) {return;}
      this.current.remove();
      this.current = null;
      this.view.model.set('hidden', true);
      return !!!this.current;
    }
  });

  return TimelinePresenter;

});
