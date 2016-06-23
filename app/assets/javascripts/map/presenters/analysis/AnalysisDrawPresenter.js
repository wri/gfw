/**
 * The AnalysisDrawPresenter class for the AnalysisToolView.
 *
 * @return AnalysisDrawPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore', 
  'backbone', 
  'mps', 
  'topojson', 
  'bluebird', 
  'moment',
  'helpers/geojsonUtilsHelper',
  'map/helpers/FiresDatesHelper',
  'map/services/CountryService',
  'map/services/RegionService',
  'map/services/GeostoreService'
], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment, geojsonUtilsHelper, FiresDatesHelper, countryService, regionService, GeostoreService) {

  'use strict';

  var AnalysisDrawPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        baselayer: null,
        both: false,
        resource: null, // analysis resource
        date: null,
        threshold: 30, // by default
        iso: null,
        overlay: null, // google.maps.Polygon (user drawn polygon)
        multipolygon: null, // geojson (countries and regions multypolygon)
        disableUpdating: false,
        dont_analyze: false,
      }
    })),

    datasets: {
      'loss': {
        slug: 'umd-loss-gain',
        subscription: true
      },
      'forestgain': {
        slug: 'umd-loss-gain'
      },
      'forma': {
        slug: 'forma-alerts'
      },
      'imazon': {
        slug: 'imazon-alerts',
        subscription: true
      },
      'modis': {
        slug: 'quicc-alerts',
        subscription: true        
      },
      'terrailoss': {
        slug: 'terrai-alerts',
        subscription: true
      },
      'prodes': {
        slug: 'prodes-loss',
        subscription: true
      },
      'guyra': {
        slug: 'guyra-loss',
        subscription: true
      },
      'forest2000': {
        slug: 'umd-loss-gain'
      },
      'viirs_fires_alerts': {
        slug: 'viirs-active-fires',
        subscription: true
      },
      'umd_as_it_happens': {
        slug: 'glad-alerts',
        subscription: true
      },
      'umd_as_it_happens_per': {
        slug: 'glad-alerts',
        subscription: true
      },
      'umd_as_it_happens_cog': {
        slug: 'glad-alerts',
        subscription: true
      },
      'umd_as_it_happens_idn': {
        slug: 'glad-alerts',
        subscription: true
      },
    },

    init: function(view) {
      this.view = view;
      this._super();
      mps.publish('Place/register', [this]);
    },

    /**
     * Used by PlaceService to get the current params.
     *
     * @return {object} iso/geom params
     */
    getPlaceParams: function() {
      // var resource = this.status.get('resource');
      // if (!resource) {return;}
      // var p = {};

      // p.dont_analyze = this.status.get('dont_analyze');

      // if (resource.iso) {
      //   p.iso = {};
      //   p.iso.country = resource.iso;
      //   p.iso.region = resource.id1 ? resource.id1 : null;
      // } else if (resource.geostore) {
      //   p.geostore = resource.geostore;
      // } else if (resource.geojson) {
      //   p.geojson = encodeURIComponent(resource.geojson);
      // } else if (resource.wdpaid) {
      //   p.wdpaid = resource.wdpaid;
      // } else if (resource.use && resource.useid) {
      //   p.use = resource.use;
      //   p.useid = resource.useid;
      // }

      // if (this.status.get('fit_to_geom')) {
      //   p.fit_to_geom = 'true';
      // }

      // if (this.status.get('tab')) {
      //   p.tab = this.status.get('tab');
      // }

      // return p;
    },


    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

    // DRAW
    startDrawing: function() {
      mps.publish('Analysis/start-drawing');
    },

    stopDrawing: function() {
      mps.publish('Analysis/stop-drawing');
    },

    // GLOBAL
    deleteAnalysis: function() {
      mps.publish('Analysis/delete');
    }



  });

  return AnalysisDrawPresenter;

});
