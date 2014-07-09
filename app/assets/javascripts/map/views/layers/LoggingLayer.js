/**
 * The Logging layer module.
 *
 * @return LoggingLayer class (extends CartoDBLayerClass)
 */
define([
  'views/layers/class/CartoDBLayerClass',
], function(CartoDBLayerClass) {

  'use strict';

  var LoggingLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, company, country, permit_num, nat_origin, area_ha, name, \'%(tableName)s\' AS layer' +
        ' FROM %(tableName)s',
      infowindow: true,
      interactivity: 'name, company, country, permit_num, nat_origin, area_ha'
    }

  });

  return LoggingLayer;

});
