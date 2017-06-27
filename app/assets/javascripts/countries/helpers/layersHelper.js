/**
 * Map layers slug with layer files. (Simplified version)
 */
define([
  // Layer views
  'map/views/layers/LossLayer',
  'map/views/layers/ForestGainLayer',
  'map/views/layers/GladLayer',
  'map/views/layers/TerraiCanvasLayer',
  'map/views/layers/Forest2000Layer',
  'map/views/layers/ViirsLayer'
], function(
  // Layer Views
  LossLayer,
  ForestGainLayer,
  GladLayer,
  TerraiCanvasLayer,
  Forest2000,
  ViirsLayer
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
    },
    forest2000 :{
      view: Forest2000,
    },
    viirs_fires_alerts :{
      view: ViirsLayer,
    }
  };

  return layersHelper;

});
