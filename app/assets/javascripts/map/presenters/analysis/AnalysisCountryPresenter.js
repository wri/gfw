/**
 * The AnalysisCountryPresenter class for the AnalysisToolView.
 *
 * @return AnalysisCountryPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore',
  'backbone',
  'mps',
  'topojson',
  'bluebird',
  'moment',
  'map/services/CountryService',
  'map/services/RegionService',
  'helpers/geojsonUtilsHelper',

], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment, CountryService, RegionService, geojsonUtilsHelper) {

  'use strict';

  var AnalysisCountryPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        iso : {
          country: 'ALL',
          region: null
        },
        isoDisabled: true,

        enabled: true,
        enabledSubscription: true,

        fit_to_geom: false,

        country: null,
        regions: null,
        region: null,

        overlay_stroke_weight: 2
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
      this.status.on('change:iso', this.changeIso.bind(this));
      this.status.on('change:isoDisabled', this.changeIso.bind(this));

      this.status.on('change:regions', this.changeRegions.bind(this));

      this.status.on('change:enabled', this.changeEnabled.bind(this));
      this.status.on('change:enabledSubscription', this.changeEnabledSubscription.bind(this));
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [
      // GLOBAL EVENTS
      {
        'Place/go': function(place) {
          var params = place.params;

          this.status.set({

            // Countries
            iso: {
              country: params.iso.country,
              region: params.iso.region
            },
            isoDisabled: (!!params.dont_analyze) || !(!!params.iso.country && params.iso.country != 'ALL'),

            fit_to_geom: !!params.fit_to_geom
          });
        }
      },

      // GLOBAL ANALYSIS EVENTS
      {
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/shape': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/enabled': function(enabled) {
          this.status.set('enabled', enabled);
        }
      },{
        'Analysis/enabled-subscription': function(enabled) {
          this.status.set('enabledSubscription', enabled);
        }
      },{
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/hideGeojson': function() {
          this.view.hideGeojson();
        }
      },{
        'Analysis/showGeojson': function() {
          this.view.showGeojson();
        }
      },{
        'Analysis/iso': function(iso,isoDisabled) {
          this.status.set('isoDisabled', isoDisabled);

          if(!!iso.country && iso.country !== 'ALL' && !isoDisabled){
            this.status.set({
              iso: iso,
              isoDisabled: isoDisabled
            });
          }
        }
      }
    ],

    /**
     * LISTENERS
     */
    changeIso: function() {
      var iso = this.status.get('iso');
      var isoDisabled = this.status.get('isoDisabled');

      // Draw geojson depending if it's a country or a region
      if(!!iso.country && iso.country !== 'ALL' && !isoDisabled){
        (!!iso.region) ? this.showRegion() : this.showCountry();
      }

      // Get regions
      if (!!iso.country && iso.country != 'ALL') {
        this.getRegions();
        mps.publish('Analysis/iso', [iso, isoDisabled])
      } else {
        mps.publish('Analysis/delete');
      }

      this.view.toggleEnabledButtons();
    },

    changeEnabled: function() {
      this.view.toggleEnabledButtons();
    },

    changeEnabledSubscription: function() {
      this.view.toggleEnabledButtons();
    },

    changeRegions: function() {
      this.view.setSelects();
    },


    /**
     * ACTIONS
     * - showCountry
     * - showRegion
     * - getRegions
     * - deleteAnalysis
     * - notificate
     * - subscribeCountry
     */
    publishAnalysis: function() {
      mps.publish('Analysis/delete');
    },

    showCountry: function() {
      var iso = this.status.get('iso');

      CountryService.show(iso.country)
        .then(function(results,status) {
          var objects = _.findWhere(results.topojson.objects, {
            type: 'MultiPolygon'
          });
          var geojson = topojson.feature(results.topojson,objects),
              geometry = geojson.geometry

          // Draw geojson of country if isoDisabled is equal to true
          this.view.drawGeojson(geometry);

        }.bind(this));
    },

    getRegions: function() {
      var iso = this.status.get('iso');

      RegionService.get(iso.country)
        .then(function(results,status) {
          this.status.set({
            regions: results.rows
          })
        }.bind(this));
    },

    showRegion: function() {
      var iso = this.status.get('iso');

      RegionService.show(iso.country, iso.region)
        .then(function(results,status) {
          var geometry = results.features[0].geometry

          // Draw geojson of country if isoDisabled is equal to true
          this.view.drawGeojson(geometry);
        }.bind(this));
    },

    deleteAnalysis: function() {
      this.status.set({
        iso: {
          country: null,
          region: null
        },
        isoDisabled: true,

        regions: null,
        country: null,
        region: null
      });

      this.view.deleteGeojson();
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },


  });

  return AnalysisCountryPresenter;

});
