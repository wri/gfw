/**
 * The Timeline view presenter.
 *
 * @return TimelinePresenter class
 */
define([
  'underscore',
  'mps',
  'backbone',
  'map/presenters/PresenterClass',
  'map/helpers/layersHelper'
], function(_, mps, Backbone, PresenterClass, layersHelper) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      timeline: null, // the current timeline view instance
      begin: null,
      end: null,
      baselayer: null
    }
  });

  var TimelinePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    _subscriptions: [{
      'Place/go': function(place) {
        this._handleNewLayers(place.layerSpec.getBaselayers(),
          [place.params.begin, place.params.end]);

        if (!place.params.begin) {
          mps.publish('Place/update', [{go: false}]);
        }
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this._handleNewLayers(layerSpec.getBaselayers());
      }
    }, {
      'Map/center-change': function(lat, lng) {
        this.view.updateLatlng(lat, lng);
      }
    }, {
      'AnalysisTool/stop-drawing': function() {
        if (this.status.get('timeline')) {
          this.view.model.set({hidden: false});
        }
        this.view.model.set('forceHidden', false);
      }
    }, {
      'AnalysisTool/start-drawing': function() {
        if (this.status.get('timeline')) {
          this.view.model.set({hidden: true});
        }
        this.view.model.set('forceHidden', true);
      }
    }, {
      'Timeline/toggle': function(boolean) {
        this.view.toggleMobile(boolean);
      }
    }, {
      'Layers/toggle': function(toggle) {
        this.view.toggleMobile(false);
      }
    }, {
      'Analysis/toggle': function(boolean) {
        this.view.toggleMobile(false);
      }
    },{
      'Overlay/toggle' : function(bool){
        this.view.toggleMobile(false);
      }
    }],

    /**
     * Add/delete timeline depend on the current active layers.
     *
     * @param {object} layerSpec
     */
    _handleNewLayers: function(baselayers, date) {
      var date;
      var currentTimeline = this.status.get('timeline');
      var baselayer = _.values(_.omit(
        baselayers, ['forestgain', 'forest2000' ,'nothing']))[0];

      if (!baselayer) {
        date = undefined;
        this._timelineDisabled();
        this._removeTimeline();
        return;
      }

      if (currentTimeline) {
        if (currentTimeline.getName() === baselayer.slug) {
          date = [this.status.get('begin') , this.status.get('end')];
          // Return if the timeline is already active.
          return;
        }
        // Remove current timeline.
        date = date;
        this._removeTimeline();
      }


      if (!currentTimeline && baselayer) {
        this._timelineEnabled(baselayer.slug);
      }
      // var date = this.setDate(date);

      this._addTimeline(baselayer, date);
    },

    /**
     * Render a timeline view if it exists for
     * the supplied layer.
     *
     * @param {Object} layer Layer object
     * @param {Object} date  Date [begin, end]
     */
    _addTimeline: function(layer, date) {
      var TimelineView = layersHelper[layer.slug].timelineView;
      var timeline;

      if (!TimelineView) {
        return;
      }

      this.view.update(layer);
      timeline = new TimelineView(layer, date);
      this.status.set('timeline', timeline);

      if (timeline.getCurrentDate !== undefined) {
        var dateRange = timeline.getCurrentDate();
        mps.publish('Timeline/date-change', [timeline.getName(), dateRange]);
      }

      this.view.model.set('hidden', false);
    },

    /**
     * Remove the current timeline view.
     */
    _removeTimeline: function() {
      var timeline = this.status.get('timeline');
      if (!timeline) {return;}

      if (timeline.presenter && timeline.presenter.unsubscribe) {
        timeline.presenter.unsubscribe();
      }

      if (timeline.stopAnimation) {
        timeline.stopAnimation();
      }

      timeline.remove();
      this.status.set('timeline', null);
      // this.status.set('begin', null);
      // this.status.set('end', null);

      this.view.model.set('hidden', true);
    },

    _timelineDisabled: function() {
      mps.publish('Timeline/disabled');
    },

    _timelineEnabled: function(layerSlug) {
      mps.publish('Timeline/enabled', [layerSlug]);
    },

    /**
     * Called by PlaceService. Return place parameters representing the
     * of the current timeline.
     *
     * @return {object} begin/end params
     */
    getPlaceParams: function() {
      var p = {};
      var timeline = this.status.get('timeline');
      var date = [null, null];

      if (timeline) {
        date = timeline.getCurrentDate();
      }

      p.begin = date[0];
      p.end = date[1];

      this.status.set('begin', p.begin);
      this.status.set('end', p.end);

      return p;
    }

  });

  return TimelinePresenter;

});
