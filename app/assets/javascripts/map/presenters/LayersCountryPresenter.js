/**
 * The LayersCountryPresenter class for the LayersNavView.
 *
 * @return LayersCountryPresenter class.
 */
define([
  'underscore',
  'mps',
  'topojson',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService',
  'helpers/geojsonUtilsHelper',
  'map/services/CountryService',

], function(_, mps, topojson, PresenterClass, layerSpecService, geojsonUtilsHelper, countryService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      iso: null
    }
  });

  var LayersCountryPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
      this.status = new StatusModel();
      mps.publish('Place/register', [this]);
    },

    getPlaceParams: function() {
      var p = {};
      p.iso = this.status.get('iso');
      return p;
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        var params = place.params;
        if(!!params.iso.country && params.iso.country !== 'ALL'){
          this.view.setCountry(params.iso);
          this.status.set('iso', params.iso);
        }
      }
    },{
      'Country/update': function(iso) {
        this.view.resetCountryLayers()
        this.view.setCountry(iso);
        this.status.set('iso', _.clone(iso));
      }
    },{
      'Country/layers': function(layers) {
        this.view.setLayers(layers);
      }
    }],

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

    /**
     * Publish a a Country/update.
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    publishIso: function(iso) {
      this.status.set('iso', iso);
      this.status.set('dont_analyze', true);        
      mps.publish('Country/update', [iso]);
      mps.publish('Place/update', [{go: false}]);

      // Fit country bounds
      this.countryBounds();
    },

    /**
     * Country bounds
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    countryBounds: function() {
      var iso = this.status.get('iso');

      if(!!iso.country && iso.country !== 'ALL'){
        countryService.execute(iso.country, _.bind(function(results) {
          var objects = _.findWhere(results.topojson.objects, {
            type: 'MultiPolygon'
          });
          var geojson = topojson.feature(results.topojson,objects);

          var bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
          if (!!bounds) {
            mps.publish('Map/fit-bounds', [bounds]);
          }
        },this));
      }
    },

    /**
     * Publish a a LayerNav/change.
     *
     * @param  {object} layerSpec
     */
    _toggleLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];

      layerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    },

    _removeLayer: function(layer) {
      // Get current active layers from layerspec
      var currentLayers = layerSpecService._getLayers();

      if (!!layer.wrappers) {
        // Check if any of the wrapped layers is active and toggle it
        _.each(layer.wrappers, function(wrap_layer) {
          if (!!currentLayers[wrap_layer.slug]) {
            this._toggleLayer(wrap_layer.slug);
          }
        }.bind(this));
      } else {
        // Check if any of the regular layers is active and toggle it
        if (!!currentLayers[layer.slug]) {
          this._toggleLayer(layer.slug);
        }        
      }
    },

  });

  return LayersCountryPresenter;
});
