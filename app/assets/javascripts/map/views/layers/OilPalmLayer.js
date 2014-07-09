/**
 * The OilPalm layer module.
 *
 * @return OilPalmLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var OilPalmLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, type, country, area_ha, \'%(tableName)s\' AS layer' +
        ' FROM %(tableName)s',
      infowindow: true,
      interactivity: 'country, type, area_ha'
    }

  });

  return OilPalmLayer;

});
