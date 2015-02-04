/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return WMSLayer class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/concesiones_peru.cartocss',
  'text!map/cartocss/concesiones_peruTypes.cartocss'
], function(CartoDBLayerClass,concesiones_forestalesCartoCSS, concesiones_forestalesTypesCartoCSS) {

  'use strict';

  if ($('#map').hasClass('peru_forest_type')) {
    concesiones_forestalesCartoCSS = concesiones_forestalesTypesCartoCSS;
  }
  var concesiones_forestales = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT *, \'{tableName}\' AS layer, \'{tableName}\' AS name FROM {tableName}',
      cartocss: concesiones_forestalesCartoCSS
    }

  });

  return concesiones_forestales;

});
