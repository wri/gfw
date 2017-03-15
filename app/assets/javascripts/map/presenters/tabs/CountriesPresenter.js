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
  'services/CountryService',
  'helpers/geojsonUtilsHelper',

], function(_, mps, topojson, PresenterClass, layerSpecService, CountryService, geojsonUtilsHelper) {

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
        var layerSpec = place.layerSpec;

        if(!!params.iso.country && params.iso.country !== 'ALL'){
          this.status.set('iso', params.iso);
          this.view.setCountry(params.iso);
          this.view._toggleSelected(layerSpec.getLayers());
        }
      }
    },{
      'Country/update': function(iso) {
        this.status.set('iso', iso);
        this.view.setCountry(iso);
      }
    },{
      'Country/layers': function(layers) {
        this.view.setLayers(layers);
      }
    },{
      'LayerNav/change': function(layerSpec) {
        this.view._toggleSelected(layerSpec.getLayers());
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

      if(!!iso && !!iso.country && iso.country !== 'ALL'){
        CountryService.showCountry({ iso: iso.country }, _.bind(function(results) {
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
     * Country bounds
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    countryMore: function() {
      var iso = this.status.get('iso');

      if(!!iso && !!iso.country && iso.country !== 'ALL'){
        CountryService.showCountry({ iso: iso.country }, _.bind(function(results) {
          var is_more = (!!results.indepth);
          var is_idn = (!!iso && !!iso.country && iso.country == 'IDN');

          if (is_more) {
            this.view.more({
              name: results.name,
              url: results.indepth,
              is_idn: is_idn
            });
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


  });

  return LayersCountryPresenter;
});
