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
      hres: ''
    }
  });

  var HighresolutionPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    },

    /**
     * Set status hres with the passed value.
     *
     * @param {string} value hres
     */
    setHres: function(value) {
      this.status.set('hres', value);
      this._publishHres();
    },

    /**
     * Publish 'hres/changed' event with the current hres
     * and call 'Place/update' to update the url.
     */
    _publishHres: function() {
      mps.publish('Hres/changed', [this.status.get('hres')]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current hres value.
     *
     * @return {Object} high-resolution
     */
    getPlaceParams: function() {
      return {hres: this.status.get('hres')};
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
