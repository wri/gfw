/**
 * The Fires layer module.
 *
 * @return FiresLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'moment',
  'uri',
  'abstract/layer/CartoDBLayerClass',
  'map/presenters/layers/FiresLayerPresenter',
  'text!map/cartocss/global_7d.cartocss'
], function(_, moment, UriTemplate, CartoDBLayerClass, Presenter, global7dCartoCSS) {

  'use strict';

  var FiresLayer = CartoDBLayerClass.extend({
    options: {
      sql: 'SELECT the_geom_webmercator, acq_time,  COALESCE(to_char(acq_date, \'DD Mon, YYYY\')) as acq_date, confidence, brightness, longitude, latitude FROM global_7d WHERE acq_date > \'{year}-{month}-{day}\' AND CAST(confidence AS INT) > 30',
      cartocss: global7dCartoCSS,
      interactivity: 'acq_time, acq_date, confidence, brightness, longitude, latitude',
      infowindow: true
    },

    init: function(layer, options, map) {
      _.bindAll(this, 'setCurrentDate');
      this.presenter = new Presenter(this);

      // Default to 48 hours
      this.setCurrentDate(options.currentDate ||
        [moment().subtract(48, 'hours'), moment().subtract(24, 'hours')]);

      this._super(layer, options, map);
    },

    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        year: this.currentDate[0].year(),
        month: this.currentDate[0].format('MM'),
        day: this.currentDate[0].format('DD')
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

  return FiresLayer;
});
