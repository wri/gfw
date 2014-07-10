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
      sql: 'SELECT the_geom_webmercator, type, area_ha, \'%(tableName)s\' AS layer' +
        ' FROM %(tableName)s',
      infowindow: true,
      interactivity: 'type, area_ha'
    }

  });

  return WoodFiberPlantationsLayer;

});
