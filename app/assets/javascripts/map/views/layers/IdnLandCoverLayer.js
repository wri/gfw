/**
 *
 *
 * @return
 */
define(
  [
    'abstract/layer/CartoDBLayerClass',
    'text!map/cartocss/idn_land_cover.cartocss'
  ],
  (CartoDBLayerClass, IdnLandCoverCartoCSS) => {
    const IdnLandCoverLayer = CartoDBLayerClass.extend({
      options: {
        sql:
          "SELECT cartodb_id, the_geom_webmercator, desc_in, '{tableName}' AS tablename, {analysis} AS analysis, '{tableName}' AS layer FROM {tableName}",
        infowindow: false,
        cartocss: IdnLandCoverCartoCSS,
        interactivity: 'cartodb_id, tablename',
        analysis: false
      }
    });

    return IdnLandCoverLayer;
  }
);
