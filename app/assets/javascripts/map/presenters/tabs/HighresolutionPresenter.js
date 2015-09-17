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

  var HighresolutionPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
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
