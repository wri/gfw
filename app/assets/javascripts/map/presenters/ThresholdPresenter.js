/**
 * The ThresholdPresenter class for the ThresholdView.
 *
 * @return ThresholdPresenter class.
 */
define([
  'Class',
  'underscore',
  'backbone',
  'mps'
], function(Class, _, Backbone, mps) {

  'use strict';

  var ThresholdPresenter = Class.extend({

    /*
     * Supported threshold layers.
     */
    supportedLayers: [
      'umd_tree_loss_gain',
      'forest2000'
    ],

    /**
     * Constructs new ThresholdPresenter.
     *
     * @param  {Object} view Instance of ThresholdView
     */
    init: function(view) {
      this.view = view;

      this.status = new (Backbone.Model.extend())({
        layers: [],
        threshold: 10
      });

      this._statusEvents();
      this._subscribe();
      mps.publish('Place/register', [this]);
    },

    /**
     * Subscribe to status model events.
     */
    _statusEvents: function() {
      this.status.on('change:layers', this._setVisibility, this);
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this._setLayers(place.layerSpec);
        this._initThreshold(place.params);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this._setLayers(layerSpec);
      }, this));
    },

    /**
     * Set the threshold visible or hidden deppend on
     * the active layers.
     *
     * @param {Object} layerSpec Place.layerSpec
     * @param {Object} params    Place.params
     */
    _setLayers: function(layerSpec) {
      var layers = _.compact(_.map(layerSpec.getLayers(), _.bind(function(layer) {
        if (_.indexOf(this.supportedLayers, layer.slug) > -1) {
          return layer.slug;
        }
      }, this)));

      this.status.set('layers', layers);
    },

    /**
     * Toggle threshold widget if any supported layer is active.
     */
    _setVisibility: function() {
      this.view.model.set('hidden', this.status.get('layers').length === 0);
    },

    /**
     * Triggered by 'Place/go' event. Set initial threshold.
     *
     * @param  {Object} params Place.params
     */
    _initThreshold: function(params) {
      if (params.threshold) {
        this.status.set('threshold', params.threshold);
      } else {
        this._publishThreshold();
      }
      // render threshold slider position
      // Todo: Just move the handler don't update the whole thing.
      this.view.update(this.status.get('threshold'));
    },

    /**
     * Set status threshold with the passed value.
     *
     * @param {Integer} value Threshold
     */
    setThreshold: function(value) {
      this.status.set('threshold', value);
      this._publishThreshold();
    },

    /**
     * Publish 'Threshold/changed' event with the current threshold
     * and call 'Place/update' to update the url.
     */
    _publishThreshold: function() {
      mps.publish('Threshold/changed', [this.status.get('threshold')]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current threshold value.
     *
     * @return {Object} threshold
     */
    getPlaceParams: function() {
      var p = {};

      if (this.status.get('layers').length > 0) {
        p.threshold = this.status.get('threshold');
      } else {
        p.threshold = null;
      }

      return p;
    }
  });

  return ThresholdPresenter;

});
