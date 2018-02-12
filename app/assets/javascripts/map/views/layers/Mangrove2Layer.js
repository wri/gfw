/**
 * The Mangrove 2 layer module.
 *
 * @return Mangrove 2 class (extends CartoDBLayerClass)
 */
define([
  'underscore',
  'moment',
  'uri',
  'mps',
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/mangrove_2.cartocss',
  'map/presenters/layers/Mangrove2LayerPresenter',
  'map/services/MangroveDateService'
], function(_, moment, UriTemplate, mps, CartoDBLayerClass,
  Mangrove2Carto, Presenter, MangroveDateService) {

  'use strict';

  var SLUG = 'mangrove_2';
  var FILTERS = ['Cover', 'Gain', 'Loss'];

  var Mangrove2 = CartoDBLayerClass.extend({
    options: {
      sql: "SELECT * FROM {tableName} WHERE year = {year} {filters}",
      interactivity: '',
      cartocss: Mangrove2Carto,
      infowindow: false
    },

    init: function(layer, options, map) {
      this.presenter = new Presenter(this, SLUG);
      this._super(layer, options, map);

      var currentDate = options.currentDate ||
        [moment.utc(), moment.utc()];
      this.setCurrentDate(MangroveDateService.getRangeForDates(currentDate));
      this.setFilters();
    },

    getQuery: function() {
      var query = new UriTemplate(this.options.sql)
        .fillFromObject({
          tableName: this.layer.table_name,
          year: moment(this.currentDate[0]).year(),
          filters: this.getFilters()
        });

      return decodeURIComponent(query);
    },

    setFilters: function() {
      if (!this.presenter.status.attributes.filters) {
        this.presenter.status.set('layerOptions', _.clone(FILTERS));
        mps.publish('LayerNav/changeLayerOptions', [_.clone(FILTERS)]);
        mps.publish('LayerOptions/update', [_.clone(FILTERS)]);
        mps.publish('Place/update', [{go: false}]);
      }
    },

    getFilters: function() {
      var filters = this.presenter.status.get('layerOptions');
      var queryFilters = '';

      if (filters && filters.length) {
        queryFilters += 'AND';
        filters.forEach(function(value, key) {
          queryFilters += ' change=\''+ value +'\'';

          if (key < (filters.length - 1)) {
            queryFilters += ' OR';
          }
        });
      } else {
        queryFilters = 'AND change is null';
      }
      return queryFilters;
    },

    /**
     * Used by Mangrove2Presenter to set the dates for the tile.
     *
     * @param {Array} date 2D array of moment dates [begin, end]
     */
    setCurrentDate: function(date) {
      this.currentDate = date;
    }
  });

  return Mangrove2;
});
