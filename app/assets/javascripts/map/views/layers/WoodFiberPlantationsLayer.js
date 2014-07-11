/**
 * The WoodFiberPlantations layer module.
 *
 * @return WoodFiberPlantationsLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var WoodFiberPlantationsLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, type, area_ha, \'{tableName}\' AS layer FROM {tableName}',
      infowindow: true,
      interactivity: 'type, area_ha'
    }

  });

  return WoodFiberPlantationsLayer;

});
