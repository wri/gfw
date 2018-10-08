/**
 * The RSPO Oil Palm layer module.
 *
 * @return rpso class (extends CartoDBLayerClass)
 */
define(
  ['abstract/layer/CartoDBLayerClass', 'text!map/cartocss/rspo.cartocss'],
  function(CartoDBLayerClass, rspoCartoCSS) {
    var RSPOLayer = CartoDBLayerClass.extend({
      options: {
        sql:
          "SELECT cartodb_id, the_geom_webmercator, '{tableName}' as tablename, _group as group, company, membership, rspo_cert, plantation, '{tableName}' AS layer, {analysis} AS analysis FROM {tableName}",
        infowindow: true,
        interactivity:
          'cartodb_id, tablename, group, company, plantation, membership, rspo_cert, analysis',
        analysis: true,
        cartocss: rspoCartoCSS
      }
    });

    return RSPOLayer;
  }
);
