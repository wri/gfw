/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends Class).
 */
define([
  'Class',
  'underscore',
  '_string',
  'uri',
  'text!cartocss/style.cartocss',
  'text!templates/infowindow.handlebars'
], function(Class, _, _string, UriTemplate, CARTOCSS, tpl) {

  'use strict';

  var CartoDBLayerClass = Class.extend({

    default: {
      user_name: 'wri-01',
      type: 'cartodb',
      sql: null,
      cartocss: CARTOCSS,
      interactivity: 'cartodb_id, name',
      infowindow: false
    },

    queryTemplate: "SELECT cartodb_id||':' ||'{tableName}' as cartodb_id, the_geom_webmercator," +
      "'{tableName}' AS layer, name FROM {tableName}",

    init: function(layer, map) {
      this.layer = layer;
      this.map = map;
      this.name = layer.slug;
      this.options = _.extend({}, this.default, this.options || {});
    },

    getLayer: function() {
      var deferred = new $.Deferred();

      var cartodbOptions = {
        name: this.name,
        type: this.options.type,
        user_name: this.options.user_name,
        sublayers: [{
          sql: this.getQuery(),
          cartocss: this.options.cartocss,
          interactivity: this.options.interactivity
        }]
      };

      cartodb.createLayer(this.map, cartodbOptions)
      .done(
        _.bind(function(layer) {
          this.cdbLayer = layer;

          if (this.options.infowindow) {
            this.setInfowindow();
          }

          deferred.resolve(this.cdbLayer);
        }, this)
      ).error(function(err) {
        throw err;
      });

      return deferred.promise();
    },

    updateTiles: function() {
      this.cdbLayer.setQuery(this.getQuery());
    },

    /**
     * Create a CartodDB infowindow object
     * and add to CartoDB layer
     *
     * @return {object}
     */
    setInfowindow: function() {
      this.infowindow = cdb.vis.Vis.addInfowindow(this.map, this.cdbLayer.getSubLayer(0), this.options.interactivity, {
        infowindowTemplate: tpl,
        templateType: 'handlebars'
      });
    },

    /**
     * Get the CartoDB query. If it isn't set on this.options,
     * it gets the default query from this._queryTemplate.
     *
     * @return {string} CartoDB query
     */
    getQuery: function() {
      return _.str.sprintf(this.options.sql, { tableName: this.layer.table_name }) ||
        new UriTemplate(this.queryTemplate).fillFromObject({tableName: this.layer.table_name});
    }

  });

  return CartoDBLayerClass;
});
