/**
 * The HighresolutionPresenter class for the Highresolution view.
 *
 * @return HighresolutionPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService'
], function(_, mps, PresenterClass, layerSpecService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layers: [],
      hresolution: ''
    }
  });

  var HighresolutionPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    _subscriptions: [{
      'Place/go': function(place) {
        this.status.set('hresolution', place.params.hresolution);
      }
    }],

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    },

    updateLayer: function(name) {
      mps.publish('Layer/update', [name]);
    },

    /**
     * Set status hresolution with the passed value.
     *
     * @param {string} value hresolution
     */
    setHres: function(value) {
      this.status.set('hresolution', value);
      sessionStorage.setItem('high-resolution', value);
      this._publishHres();
    },

    /**
     * Publish 'hresolution/changed' event with the current hresolution
     * and call 'Place/update' to update the url.
     */
    _publishHres: function() {
      mps.publish('hresolution/changed', [this.status.get('hresolution')]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current hresolution value.
     *
     * @return {Object} high-resolution
     */
    getPlaceParams: function() {
      return {hresolution: this.status.get('hresolution')};
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];

      layerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    },
  });

  return HighresolutionPresenter;
});
