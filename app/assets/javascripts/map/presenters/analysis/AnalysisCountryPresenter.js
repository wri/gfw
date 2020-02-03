/* eslint-disable */
/**
 * The AnalysisCountryPresenter class for the AnalysisToolView.
 *
 * @return AnalysisCountryPresenter class.
 */
define(
  [
    'map/presenters/PresenterClass',
    'underscore',
    'backbone',
    'mps',
    'topojson',
    'bluebird',
    'moment',
    'services/CountryService',
    'helpers/geojsonUtilsHelper'
  ],
  function(
    PresenterClass,
    _,
    Backbone,
    mps,
    topojson,
    Promise,
    moment,
    CountryService,
    geojsonUtilsHelper
  ) {
    'use strict';

    var AnalysisCountryPresenter = PresenterClass.extend({
      status: new (Backbone.Model.extend({
        defaults: {
          iso: {
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
          layers: [],

          overlay_stroke_weight: 2
        }
      }))(),

      init: function(view, map, countries) {
        this.repeat = 0;
        this.map = map;
        this.countries = countries;
        this.view = view;
        this._super();
        this.listeners();
      },

      listeners: function() {
        this.status.on('change:iso', this.changeIso.bind(this));
        this.status.on('change:isoDisabled', this.changeIso.bind(this));

        this.status.on('change:regions', this.changeRegions.bind(this));
        this.status.on('change:subRegions', this.changeRegions.bind(this));

        this.status.on('change:layers', this.changeLayers.bind(this));

        this.status.on('change:enabled', this.changeEnabled.bind(this));
        this.status.on(
          'change:enabledSubscription',
          this.changeEnabledSubscription.bind(this)
        );
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
                region: params.iso.region,
                subRegion: params.iso.subRegion
              },
              isoDisabled:
                !!params.dont_analyze ||
                !(!!params.iso.country && params.iso.country != 'ALL'),
              fit_to_geom: !!params.fit_to_geom,
              layers: params.baselayers
            });
          }
        },
        // Temp: to disable the regions selector
        // for GLAD and terra-i
        {
          'LayerNav/change': function(layerSpec) {
            this.status.set({
              layers: _.clone(layerSpec.attributes)
            });
          }
        },

        // GLOBAL ANALYSIS EVENTS
        {
          'Analysis/delete': function() {
            this.deleteAnalysis();
          }
        },
        {
          'Analysis/shape': function() {
            this.deleteAnalysis();
          }
        },
        {
          'Analysis/enabled': function(enabled) {
            this.status.set('enabled', enabled);
          }
        },
        {
          'Analysis/enabled-subscription': function(enabled) {
            this.status.set('enabledSubscription', enabled);
          }
        },
        {
          'Analysis/delete': function() {
            this.deleteAnalysis();
          }
        },
        {
          'Analysis/hideGeojson': function() {
            this.view.hideGeojson();
          }
        },
        {
          'Analysis/showGeojson': function() {
            this.view.showGeojson();
          }
        },
        {
          'Analysis/iso': function(iso, isoDisabled) {
            this.status.set('isoDisabled', isoDisabled);

            if (!!iso.country && iso.country !== 'ALL' && !isoDisabled) {
              this.status.set({
                iso: iso,
                isoDisabled: isoDisabled
              });
            }
          }
        },
        {
          'Zoom/in': function(params) {
            this.zoomBounds(params);
          }
        }
      ],

      /**
       * LISTENERS
       */

      zoomBounds: function(params) {
        var p = { type: 'MultiPolygon', coordinates: [[[]]] };
        var paramsLength = params.coordinates[0].length;
        var bounds = new google.maps.LatLngBounds();
        var coords = p.coordinates;
        var paths = [];
        for (var i = 0; i < paramsLength; i++) {
          p.coordinates[0][0].push([
            params.coordinates[0][i][0],
            params.coordinates[0][i][1]
          ]);
        }
        for (var i = 0; i < coords.length; i++) {
          for (var j = 0; j < coords[i].length; j++) {
            var path = [];
            for (var k = 0; k < coords[i][j].length; k++) {
              var ll = new google.maps.LatLng(
                coords[i][j][k][1],
                coords[i][j][k][0]
              );
              path.push(ll);
              bounds.extend(ll);
            }
            paths.push(path);
          }
        }
        this.map.fitBounds(bounds);
        $('.cartodb-infowindow').css('display', 'none');
      },

      changeIso: function() {
        var iso = this.status.get('iso');
        var isoDisabled = this.status.get('isoDisabled');
        // Draw geojson depending if it's a country or a region
        if (!!iso.country && iso.country !== 'ALL' && !isoDisabled) {
          if (iso.subRegion) {
            this.showSubRegion();
          } else if (iso.region) {
            this.showRegion();
          } else {
            this.showCountry();
          }
        }

        // Get regions
        if (!!iso.country && iso.country != 'ALL') {
          this.getRegions();
          if (!!iso.region) {
            this.getSubRegions();
          }
          mps.publish('Analysis/iso', [iso, isoDisabled]);
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

      changeLayers: function() {
        this.view.render();
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
        CountryService.showCountry({ iso: iso.country }).then(
          function(results) {
            var geometry = JSON.parse(results.geojson);

            // Draw geojson of country if isoDisabled is equal to true
            this.view.drawGeojson(geometry);
          }.bind(this)
        );
      },

      getRegions: function() {
        var iso = this.status.get('iso');

        CountryService.getRegionsList({ iso: iso.country }).then(
          function(results) {
            this.status.set({
              regions: results
            });
          }.bind(this)
        );
      },

      showRegion: function() {
        var iso = this.status.get('iso');

        CountryService.showRegion({
          iso: iso.country,
          region: iso.region
        }).then(
          function(results) {
            var geometry = JSON.parse(results.geojson);

            // Draw geojson of country if isoDisabled is equal to true
            this.view.drawGeojson(geometry);
          }.bind(this)
        );
      },

      getSubRegions: function() {
        var iso = this.status.get('iso');
        CountryService.getSubRegionsList({
          iso: iso.country,
          region: iso.region
        }).then(
          function(results) {
            this.status.set({
              subRegions: results
            });
          }.bind(this)
        );
      },

      showSubRegion: function() {
        var iso = this.status.get('iso');

        CountryService.showSubRegion({
          iso: iso.country,
          region: iso.region,
          subRegion: iso.subRegion
        }).then(
          function(results) {
            var geometry = JSON.parse(results.geojson);

            // Draw geojson of country if isoDisabled is equal to true
            this.view.drawGeojson(geometry);
          }.bind(this)
        );
      },

      deleteAnalysis: function() {
        this.status.set({
          iso: {
            country: null,
            region: null,
            subRegion: null
          },
          isoDisabled: true,
          subRegions: null,
          regions: null,
          country: null,
          region: null,
          subRegion: null
        });

        this.view.deleteGeojson();
      },

      notificate: function(id) {
        mps.publish('Notification/open', [id]);
      }
    });

    return AnalysisCountryPresenter;
  }
);
