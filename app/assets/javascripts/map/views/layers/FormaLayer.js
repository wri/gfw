/**
 * The Forma layer module for use on canvas.
 *
 * @return FormaLayer class (extends CanvasLayerClass)
 */
define([
  'views/layers/class/CanvasJSONLayerClass',
], function(CanvasJSONLayerClass) {

  'use strict';

  var FormaLayer = CanvasJSONLayerClass.extend({});

  return FormaLayer;

});
