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
  'services/CountryService',

], function(_, mps, topojson, PresenterClass, layerSpecService, geojsonUtilsHelper, CountryService) {

  'use strict';

  var LayersCountryPresenter = PresenterClass.extend({

    status: new (Backbone.Model.extend({
      defaults: {
        iso: {
          country: 'ALL',
          region: null
        },
        isoDisabled: true
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
      mps.publish('Place/register', [this]);
    },

    getPlaceParams: function() {
      var p = {};
      p.iso = this.status.get('iso');
      return p;
    },

    listeners: function() {
      this.status.on('change:iso', this.countryAtlas.bind(this));
      // this.status.on('change:iso', this.countryBounds.bind(this));
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

        this.status.set('isoDisabled', (!!params.dont_analyze) || !(!!params.iso.country && params.iso.country != 'ALL'))
      }
    },{
      'Country/update': function(iso) {
        var currentIso = iso;
        var previousIso = this.status.get('iso');

        // Reset country layers only when the country are different or null
        if (!!previousIso && (currentIso.country != previousIso.country || ! !!currentIso.country)) {
          this.view.resetCountryLayers();
        }

        this.view.setCountry(iso);
        this.status.set('iso', _.clone(iso));
      }
    },{
      'Country/layers': function(layers) {
        this.view.setLayers(layers);
      }
    },{
      'Country/bounds': function() {
        this.countryBounds();
      }
    },{
      'Analysis/iso': function(iso,isoDisabled) {
        this.status.set('isoDisabled', isoDisabled);

        var currentIso = iso;
        var previousIso = this.status.get('iso');

        if(!!iso.country && iso.country !== 'ALL' && !isoDisabled){

          if (!!previousIso && (currentIso.country != previousIso.country || ! !!currentIso.country)) {
            this.view.resetCountryLayers();
          }

          this.view.setCountry(iso);
          this.status.set({
            iso: iso,
            isoDisabled: isoDisabled
          });
        }
      }
    },{
      'Analysis/delete': function(options) {
        var iso = this.status.get('iso');
        if(!!iso.country && iso.country !== 'ALL'){
          this.status.set({
            iso: {
              country: iso.country,
              region: null
            }
          });
        }

      }
    },{
      'Analysis/enabled': function(boolean) {
        this.view.setAnalysisButtonStatus(boolean);
      }
    },{
      'Subscribe/enabled': function(boolean) {
        this.view.setSubscribeButtonStatus(boolean);
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
      mps.publish('Country/update', [iso]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Country bounds
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    countryBounds: function() {
      var iso = this.status.get('iso');

      if(!!iso.country && iso.country !== 'ALL'){
        CountryService.showCountry({ iso: iso.country })
          .then(function(results,status) {
            var objects = _.findWhere(results.topojson.objects, {
              type: 'MultiPolygon'
            });
            var geojson = topojson.feature(results.topojson,objects),
                bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson)

            // Get bounds and fit to them
            if (!!bounds) {
              mps.publish('Map/fit-bounds', [bounds]);
            }

          }.bind(this));
      }
    },

    /**
     * Country atlas
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    countryAtlas: function() {
      var iso = this.status.get('iso');

      if(!!iso && !!iso.country && iso.country !== 'ALL'){
        CountryService.showCountry({ iso: iso.country }, _.bind(function(results) {
          var is_more = (!!results.indepth);
          var is_idn = (!!iso && !!iso.country && iso.country == 'IDN');

          if (is_more) {
            this.view.renderAtlas({
              name: results.name,
              url: results.indepth,
              is_idn: is_idn
            });
          }

        },this));
      }
    },

    /**
     * Analyze iso
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    analyzeIso: function() {
      var iso = this.status.get('iso');
      mps.publish('Analysis/iso', [iso]);
      mps.publish('Tab/open', ['#analysis-tab-button']);
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
