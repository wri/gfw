/**
 * The Cartodb map layer module.
 * @return CartoDBLayerClass (extends LayerClass).
 */
define([
  'underscore',
  'uri',
  'abstract/layer/OverlayLayerClass',
  'text!map/cartocss/style.cartocss',
  'text!map/templates/infowindow.handlebars'
], function(_, UriTemplate, OverlayLayerClass, CARTOCSS, TPL) {

  'use strict';

  var CartoDBLayerClass = OverlayLayerClass.extend({

    defaults: {
      user_name: 'wri-01',
      type: 'cartodb',
      sql: null,
      cartocss: CARTOCSS,
      interactivity: 'cartodb_id, name',
      infowindow: false,
      cartodb_logo: false,
      analysis: false
    },

    queryTemplate: 'SELECT cartodb_id||\':\' ||\'{tableName}\' as cartodb_id, the_geom_webmercator,' +
      '\'{tableName}\' AS layer, {analysis} AS analysis, name FROM {tableName}',

    _getLayer: function() {
      var deferred = new $.Deferred();

      var cartodbOptions = {
        name: this.name,
        type: this.options.type,
        cartodb_logo: this.options.cartodb_logo,
        user_name: this.options.user_name,
        sublayers: [{
          sql: this.getQuery(),
          cartocss: this.options.cartocss,
          interactivity: this.options.interactivity
        }]
      };

      cartodb.createLayer(this.map, cartodbOptions)
        .on('done',
          _.bind(function(layer) {
            this.cdbLayer = layer;
            deferred.resolve(this.cdbLayer);
          }, this)
        );

      return deferred.promise();
    },

    updateTiles: function() {
      if (this.cdbLayer) {
        this.cdbLayer.setQuery(this.getQuery());
      }
    },

    /**
     * Create a CartodDB infowindow object
     * and add to CartoDB layer
     *
     * @return {object}
     */
    setInfowindow: function() {
      this.infowindow = cdb.vis.Vis.addInfowindow(this.map, this.cdbLayer.getSubLayer(0), this.options.interactivity, {
        infowindowTemplate: TPL,
        templateType: 'handlebars',
      });
      this.infowindow.model.on('change:visibility', function(model) {
        if (model.get('visibility')) {
          var analysis = $('#analysis-tab-button').hasClass('disabled');
          $('.cartodb-popup').toggleClass('dont-analyze', analysis);
        }
      });
    },

    removeInfowindow: function() {
      if (this.infowindow) {
        this.infowindow.remove();
      }
    },

    /**
     * Get the CartoDB query. If it isn't set on this.options,
     * it gets the default query from this._queryTemplate.
     *
     * @return {string} CartoDB query
     */
    getQuery: function() {
      return new UriTemplate(this.options.sql || this.queryTemplate)
        .fillFromObject({tableName: this.layer.table_name, analysis: this.options.analysis});
    }

  });

  return CartoDBLayerClass;
});
