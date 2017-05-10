/**
 * Forma activity layer module.
 *
 * @return FormaActivity class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'moment',
  'uri',
  'abstract/layer/CartoDBLayerClass',
  'map/presenters/layers/FormaActivityLayerPresenter',
  'map/helpers/timelineDatesHelper',
  'text!map/cartocss/FormaActivity.cartocss'
], function(_, moment, UriTemplate, CartoDBLayerClass, Presenter, DatesHelper, FormaDailyCartocss) {

  'use strict';

  var FormaActivityLayer = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT cartodb_id, the_geom_webmercator, \'{tableName}\' as tablename,\'{tableName}\' AS layer, COALESCE(to_char(acq_date, \'DD Mon, YYYY\')) as acq_date FROM {tableName} WHERE acq_date >= \'{year}-{month}-{day}\'',
      infowindow: false,
      analysis: false,
      cartocss: FormaDailyCartocss,
      interactivity: 'cartodb_id'
    },

    init: function(layer, options, map) {
      _.bindAll(this, 'setCurrentDate');
      this.presenter = new Presenter(this);

      // Default to 24 hours
      var currentDate = options.currentDate ||
        [moment().subtract(24, 'hours'), moment()];
      this.setCurrentDate(DatesHelper.getRangeForDates(currentDate));

      this._super(layer, options, map);
    },

    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        year: moment(this.currentDate[0]).year(),
        month: moment(this.currentDate[0]).format('MM'),
        day: moment(this.currentDate[0]).format('DD')
      });

      return query;
    },

    /**
     * Used by FiresLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setCurrentDate: function(date) {
      this.currentDate = date;
    }
  });

  return FormaActivityLayer;

});
