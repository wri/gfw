/**
 * Map layers slug with layer files. (Simplified version)
 */
define([
  // Layer views
  'map/views/layers/LossLayer',
  'map/views/layers/ForestGainLayer',
  'map/views/layers/GladLayer',
  'map/views/layers/TerraiCanvasLayer'
], function(
  // Layer Views
  LossLayer,
  ForestGainLayer,
  GladLayer,
  TerraiCanvasLayer
) {

  'use strict';

  var layersHelper = {
    loss: {
      view: LossLayer
    },
    forestgain: {
      view: ForestGainLayer
    },
    umd_as_it_happens: {
      view: GladLayer,
    },
    terrailoss :{
      view: TerraiCanvasLayer,
    }
  };

  return layersHelper;

});
