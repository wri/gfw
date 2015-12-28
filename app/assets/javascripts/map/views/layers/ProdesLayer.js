  /**
 * The I mazon layer module.
 *
 * @return ImazonLayer class (extends CartoDBLayerClass)
 */
define([
  'moment',
  'uri',
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/prodes.cartocss',
  'map/presenters/layers/ProdesLayerPresenter'
], function(moment, UriTemplate, CartoDBLayerClass, ProdesCartoCSS, Presenter) {

  'use strict';

  var ProdesLayer = CartoDBLayerClass.extend({
    options: {
      sql:  'SELECT cartodb_id, the_geom_webmercator, ano::int as date, \'{tableName}\' as layer, \'{tableName}\' AS name FROM {tableName} ' + 'WHERE ano BETWEEN \'{startYear}\' AND \'{endYear}\'',
      cartocss: ProdesCartoCSS
    },

    init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this.currentDate = options.currentDate || [moment(layer.mindate), moment(layer.maxdate)];
      this._super(layer, options, map);
    },

    /**
     * Used by UMDLoassLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setCurrentDate: function(date) {
      this.currentDate = date;
      this.updateTiles();
    },

    /**
     * Get the CartoDB query.
     *
     * @return {string} CartoDB query
     * @override
     */
    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        startYear: this.currentDate[0].format('YYYY'),
        endYear: this.currentDate[1].format('YYYY')-1
      });
      return query;
    }
  });

  return ProdesLayer;

});
