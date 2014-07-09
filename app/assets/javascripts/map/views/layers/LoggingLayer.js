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
      sql: 'SELECT the_geom_webmercator, company, country, permit_num, nat_origin, area_ha, name AS title, \'logging_all_merged\' AS name' +
        ' FROM logging_all_merged',
      infowindow: true,
      interactivity: 'title, company, country, permit_num, nat_origin, area_ha'
    }

  });

  return LoggingLayer;

});
