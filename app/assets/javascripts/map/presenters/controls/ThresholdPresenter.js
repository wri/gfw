/**
 * The ThresholdPresenter class for the ThresholdView.
 *
 * @return ThresholdPresenter class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'map/presenters/PresenterClass'
], function(_, Backbone, mps, PresenterClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layers: [],
      threshold: 30
    }
  });

  var ThresholdPresenter = PresenterClass.extend({

    /*
     * Supported threshold layers.
     */
    supportedLayers: [
      'loss',
      'loss_by_driver',
      'forestgain',
      'forest2000',
      'forest2010'
    ],

    /**
     * Constructs new ThresholdPresenter.
     *
     * @param  {Object} view Instance of ThresholdView
     */
    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._statusEvents();
      this._super();
      mps.publish('Place/register', [this]);
    },

    /**
     * Subscribe to status model events.
     */
    _statusEvents: function() {
      this.status.on('change:layers', this._setVisibility, this);
    },

    _subscriptions: [{
      'Place/go': function(place) {
        this._setLayers(place.layerSpec.getLayers());
        this._initThreshold(place.params);
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this._setLayers(layerSpec.getLayers());
      }
    },{
      'ThresholdControls/show': function() {
        if (this.view.model.get('hidden')) {
          this.view.model.set('hidden',false);
        }else{
          this.view.model.set('hidden',true);
        }
      },
    }],

    /**
     * Set the threshold visible or hidden deppend on
     * the active layers.
     *
     * @param {Object} layers Layers object
     * @param {Object} params Place.params
     */
    _setLayers: function(layers) {
      layers = _.compact(_.map(layers, _.bind(function(layer) {
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
      if (this.status.get('layers').length > 0) {
        this.view.toggleVisibility(false);
      } else {
        this.view.toggleVisibility(true);
      }
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
      this.view.updatePresenter(this.status.get('threshold'));
    },

    /**
     * Set status threshold with the passed value.
     *
     * @param {Integer} value Threshold
     */
    setThreshold: function(value) {
      this.status.set('threshold', value);
      ga('send', 'event', 'Map', 'Settings', 'Threshold: ' + value);
      this._publishThreshold();
    },

    /**
     * Publish 'Threshold/update' event with the current threshold
     * and call 'Place/update' to update the url.
     */
    _publishThreshold: function() {
      mps.publish('Threshold/update', [this.status.get('threshold')]);
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
    },

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
    },

  });

  return ThresholdPresenter;

});
