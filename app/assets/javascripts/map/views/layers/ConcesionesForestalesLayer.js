/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return WMSLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/WMSLayerClass',
], function(WMSLayerClass) {

  'use strict';

  var concesiones_forestales = WMSLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}'
    }

  });

  return concesiones_forestales;

});
