/**
 * The RSPO Oil Palm layer module.
 *
 * @return rpso class (extends CartoDBLayerClass)
 */
define([
    'abstract/layer/CartoDBLayerClass',
    'text!map/cartocss/rspo.cartocss'
  ], function(CartoDBLayerClass, rspoCartoCSS) {

    'use strict';

    var RSPOLayer = CartoDBLayerClass.extend({

      options: {
        sql: 'SELECT cartodb_id, the_geom_webmercator, \'{tableName}\' as tablename, _group as group, company, membership, rspo_cert, \'{tableName}\' AS layer FROM {tableName}',
        infowindow: true,
        interactivity: 'cartodb_id, tablename, group, company, membership, rspo_cert',
        analysis: false,
        cartocss: rspoCartoCSS
      }


    });

    return RSPOLayer;

  });