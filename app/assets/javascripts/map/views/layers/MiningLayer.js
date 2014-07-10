/**
 * The Mining layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var MiningLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, company, country, area_ha, name, \'%(tableName)s\' AS layer' +
        ' FROM %(tableName)s',
      infowindow: true,
      interactivity: 'name, company, country, area_ha'
    }

  });

  return MiningLayer;

});
