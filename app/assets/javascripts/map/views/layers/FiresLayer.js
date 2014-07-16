/**
 * The Fires layer module.
 *
 * @return FiresLayer class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'moment',
  'uri',
  'views/layers/class/CartoDBLayerClass',
  'presenters/FiresLayerPresenter',
  'text!cartocss/global_7d.cartocss'
], function(_, moment, UriTemplate, CartoDBLayerClass, Presenter, global7dCartoCSS) {

  'use strict';

  var FiresLayer = CartoDBLayerClass.extend({
    // todo=> add hour so it doesn't caches
    options: {
      sql: 'SELECT * FROM {tableName} WHERE acq_date > \'{year}-{month}-{day}\' AND CAST(confidence AS INT) > 30',
      cartocss: global7dCartoCSS,
      interactivity: 'acq_time, acq_date, confidence, brightness, longitude, latitude',
      infowindow: true
    },

    init: function(layer, map) {
      _.bindAll(this, 'setTimelineDate');
      this.presenter = new Presenter(this);
      this._super(layer, map);
      this.timelineDate = [moment(), moment()];
    },

    getQuery: function() {
      var query = new UriTemplate(this.options.sql).fillFromObject({
        tableName: this.layer.table_name,
        year: this.timelineDate[0].year(),
        month: this.timelineDate[0].format('MM'),
        day: this.timelineDate[0].format('DD')
      });

      return query;
    },

    /**
     * Used by FiresLayerPresenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setTimelineDate: function(date) {
      this.timelineDate = date;
    }
  });

  return FiresLayer;
});
