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
        infowindowTemplate: TPL,
        templateType: 'handlebars',
      });
      this.infowindowsButtons();
      this.infowindow.model.on('change:visibility', _.bind(function(model) {
        if (model.get('visibility')) {
          var analysis = $('#analysis-tab-button').hasClass('disabled');
          $('.cartodb-popup').toggleClass('dont-analyze', analysis);
        }
      }, this));
      this.infowindow.model.on('change', _.bind(function(model) {
        this.infowindowsButtons();
      }, this));

    },

    removeInfowindow: function() {
      if (this.infowindow) {
        this.infowindow.remove();
      }
    },

    infowindowsButtons: function(){
      $('.cartodb-popup').on('click', '.analyze-concession', function () {
        mps.publish('AnalysisTool/analyze-concession', [$(this).data('useid'), $(this).data('use'), $(this).data('wdpaid')]);

        ($(this).data('wdpaid')) ? ga('send', 'event', 'Map', 'Analysis', 'Analyze Protected Area' + $(this).data('wdpaid')) : null;

        ($(this).data('useid')) ? ga('send', 'event', 'Map', 'Analysis', 'Analyze ' + $(this).data('use').toUpperCase() + ' ' + $(this).data('useid')) : null;

      });
      $('.cartodb-popup').on('click', '.subscription-concession', function () {
        mps.publish('Subscription/analyze-concession', [$(this).data('useid'), $(this).data('use'), $(this).data('wdpaid')]);

        ($(this).data('wdpaid')) ? ga('send', 'event', 'Map', 'Subscribe', 'Analyze Protected Area' + $(this).data('wdpaid')) : null;

        ($(this).data('useid')) ? ga('send', 'event', 'Map', 'Subscribe', 'Analyze ' + $(this).data('use').toUpperCase() + ' ' + $(this).data('useid')) : null;

      });
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
