  /**
 * The Imazon layer module.
 *
 * @return ImazonLayer class (extends CartoDBLayerClass)
 */
define([
  'moment',
  'uri',
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/forma.cartocss',
  'map/presenters/layers/ImazonLayerPresenter'
], function(moment, UriTemplate, CartoDBLayerClass, FormaCartoCSS, Presenter) {

  'use strict';

  var ImazonLayer = CartoDBLayerClass.extend({
    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, to_char(date,\'YYYYMMDD\')::int as date, data_type AS layer, data_type AS name FROM {tableName} ' +
        'WHERE date BETWEEN to_date(\'{startYear}-{startMonth}\',\'YYYY-MM\') AND to_date(\'{endYear}-{endMonth}\',\'YYYY-MM\')',
      cartocss: FormaCartoCSS
    },

    init: function(layer, options, map) {
      this.options.cartocss = FormaCartoCSS.replace(/#date_to_change/g,moment(layer.maxdate).subtract(2, 'months').utc().format('YYYYMMDD'));
      this.presenter = new Presenter(this);
      this.currentDate = options.currentDate || [(layer.mindate), (layer.maxdate)];
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
        startMonth: this.currentDate[0].format('MM'),
        startYear: this.currentDate[0].format('YYYY'),
        endMonth: this.currentDate[1].format('MM'),
        endYear: this.currentDate[1].format('YYYY')
      });
      return query;
    }
  });

  return ImazonLayer;

});
