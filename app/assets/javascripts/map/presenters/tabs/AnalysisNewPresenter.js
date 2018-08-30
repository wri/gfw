/* eslint-disable */
/**
 * The AnalysisNewPresenter class for the AnalysisToolView.
 *
 * @return AnalysisNewPresenter class.
 */
define(
  [
    'map/presenters/PresenterClass',
    'underscore',
    'backbone',
    'mps',
    'bluebird',
    'moment',
    'map/services/AnalysisNewService',
    'map/services/GeostoreService',
    'helpers/geojsonUtilsHelper'
  ],
  function(
    PresenterClass,
    _,
    Backbone,
    mps,
    Promise,
    moment,
    AnalysisService,
    GeostoreService,
    ShapeService,
    geojsonUtilsHelper
  ) {
    var AnalysisNewPresenter = PresenterClass.extend({
      status: new (Backbone.Model.extend({
        defaults: {
          // Analysis
          type: null,

          enabled: null,
          enabledSubscription: null,
          enabledUpdating: true,

          active: false,
          spinner: false,
          tab: null,
          subtab: 'default',

          dataset: [],

          // Layers
          baselayers: [],
          baselayer: null,

          // Dates
          begin: null,
          end: null,

          // Draw
          geostore: null,
          isDrawing: false,

          // Country
          iso: {
            country: null,
            region: null,
            subRegion: null
          },
          isoDisabled: false,

          // Shapes
          wdpaid: null,
          use: null,
          useid: null,

          // Options
          threshold: 30,
          mobileEnabled: false,
          subscribe: false,
          fit_to_geom: false,

          layerOptions: null
        }
      }))(),

      types: [
        // GEOSTORE
        {
          name: 'geostore',
          type: 'draw',
          subtab: 'draw'
        },

        // SHAPE
        {
          name: 'wdpaid',
          type: 'wdpaid',
          subtab: 'shape'
        },
        {
          name: 'use',
          type: 'use',
          subtab: 'shape'
        },
        {
          name: 'useid',
          type: 'use',
          subtab: 'shape'
        },
        {
          name: 'useGeostore',
          type: 'use',
          subtab: 'shape'
        },

        // COUNTRY
        {
          name: 'iso',
          type: 'country',
          subtab: 'country'
        },
        {
          name: 'isoDisabled',
          type: 'country',
          subtab: 'country'
        }
      ],

      datasets: [
        {
          name: 'loss',
          slug: 'umd-loss-gain',
          subscription: true
        },
        {
          name: 'forestgain',
          slug: 'umd-loss-gain'
        },
        {
          name: 'forest2000',
          slug: 'umd-loss-gain'
        },
        {
          name: 'forest2010',
          slug: 'umd-loss-gain'
        },
        {
          name: 'forma_month_3',
          slug: 'forma250GFW',
          subscription: true
        },
        {
          name: 'forma_activity',
          slug: 'forma-alerts',
          subscription: true
        },
        {
          name: 'imazon',
          slug: 'imazon-alerts',
          subscription: true
        },
        {
          name: 'terrailoss', // change
          slug: 'terrai-alerts',
          subscription: true
        },
        {
          name: 'prodes',
          slug: 'prodes-loss',
          subscription: true
        },
        {
          name: 'guyra',
          slug: 'guira-loss',
          subscription: true
        },
        {
          name: 'viirs_fires_alerts',
          slug: 'viirs-active-fires',
          subscription: true
        },
        {
          name: 'umd_as_it_happens', // change
          slug: 'glad-alerts',
          subscription: true
        },
        {
          name: 'umd_as_it_happens_per', // change
          slug: 'glad-alerts',
          subscription: true
        },
        {
          name: 'umd_as_it_happens_cog',
          slug: 'glad-alerts',
          subscription: true
        },
        {
          name: 'umd_as_it_happens_idn',
          slug: 'glad-alerts',
          subscription: true
        }
      ],

      usenames: ['mining', 'oilpalm', 'fiber', 'logging'],

      init: function(view) {
        this.view = view;
        this._super();
        this.listeners();
        mps.publish('Place/register', [this]);
      },

      listeners: function() {
        // dev
        this.status.on('change', function() {
          mps.publish('Place/update', [{ go: false }]);
        });

        // Baselayers
        this.status.on('change:baselayers', this.changeBaselayers.bind(this));

        this.status.on('change:dataset', this.changeDataset.bind(this));

        this.status.on(
          'change:layerOptions',
          this.changeLayerOptions.bind(this)
        );

        // Enabled
        this.status.on('change:enabled', this.changeEnabled.bind(this));
        this.status.on(
          'change:enabledSubscription',
          this.changeEnabledSubscription.bind(this)
        );

        // Dates
        this.status.on('change:begin', this.changeDate.bind(this));
        this.status.on('change:end', this.changeDate.bind(this));

        // Threshold
        this.status.on('change:threshold', this.changeThreshold.bind(this));

        // Geostore
        this.status.on('change:geostore', this.changeGeostore.bind(this));
        this.status.on('change:isDrawing', this.changeIsDrawing.bind(this));

        // Countries
        this.status.on('change:isoDisabled', this.changeIso.bind(this));
        this.status.on('change:iso', this.changeIso.bind(this));

        // Areas
        this.status.on('change:use', this.changeUse.bind(this));
        this.status.on('change:useid', this.changeUse.bind(this));
        this.status.on('change:wdpaid', this.changeWdpaid.bind(this));

        // UI
        this.status.on('change:spinner', this.changeSpinner.bind(this));
        this.status.on('change:subtab', this.changeSubtab.bind(this));

        // Subscription
        this.status.on('change:subscribe', this.changeSubscribe.bind(this));

        // Mobile
        this.status.on(
          'change:mobileEnabled',
          this.changeMobileEnabled.bind(this)
        );
      },

      /**
       * Used by PlaceService to get the current iso/geom params.
       *
       * @return {object} iso/geom params
       */
      getPlaceParams: function() {
        var p = {};

        // Countries
        p.dont_analyze = !!this.status.get('isoDisabled');

        // Geostore
        if (this.status.get('geostore')) {
          p.geostore = this.status.get('geostore');
        }

        if (!!this.status.get('iso') && !!this.status.get('isoDisabled')) {
          p.iso = this.status.get('iso');
        }

        // Areas
        if (this.status.get('wdpaid')) {
          p.wdpaid = this.status.get('wdpaid');
        }

        if (!!this.status.get('use') && !!this.status.get('useid')) {
          p.use = this.status.get('use');
          p.useid = this.status.get('useid');
        }

        if (this.status.get('tab')) {
          p.tab = this.status.get('tab');
        }
        return p;
      },

      /**
       * Analysis subscriptions.
       */
      _subscriptions: [
        // GLOBAL EVENTS
        {
          'Place/go': function(place) {
            var params = place.params;
            var layerSpec = place.layerSpec;

            this.status.set({
              // Countries
              iso: {
                country: params.iso.country,
                region: params.iso.region,
                subRegion: params.iso.subRegion
              },
              // Check if param exists, if it doesn't check if country exists and it isn't equal to 'ALL'
              isoDisabled:
                !!params.dont_analyze ||
                !(!!params.iso.country && params.iso.country != 'ALL'),

              // Baselayer
              baselayers: _.pluck(params.baselayers, 'slug'),
              baselayer: layerSpec.getBaselayer(),
              layerOptions: params.layerOptions,

              // Dates
              begin:
                !params.begin && !this.status.get('begin')
                  ? '2001-01-01'
                  : params.begin || this.status.get('begin'),
              end:
                !params.end && !this.status.get('end')
                  ? '2015-01-01'
                  : params.end || this.status.get('end'),

              // Options
              threshold: params.threshold,
              fit_to_geom: params.fit_to_geom,

              // Geostore
              geostore: params.geostore,

              // Shapes
              wdpaid: params.wdpaid,
              use: params.use,
              useid: params.useid,

              subscribe: !!params.subscribe
            });
          }
        },
        {
          'LayerNav/change': function(layerSpec) {
            var currentBaselayers = this.status.get('baselayers');
            var newBaselayers = _.keys(layerSpec.getBaselayers());

            var baselayers_change =
              !!_.difference(currentBaselayers, newBaselayers).length ||
              !!_.difference(newBaselayers, currentBaselayers).length;
            if (baselayers_change) {
              this.status.set('baselayers', _.keys(layerSpec.getBaselayers()));
              this.status.set('baselayer', layerSpec.getBaselayer());
            }
          }
        },
        {
          'LayerNav/changeLayerOptions': function(layerOptions) {
            this.status.set('layerOptions', _.clone(layerOptions));
          }
        },
        {
          'Threshold/update': function(threshold) {
            this.status.set('threshold', threshold);
          }
        },

        // DRAWING EVENTS
        {
          'Analysis/start-drawing': function() {
            this.status.set('isDrawing', true);
          }
        },
        {
          'Analysis/stop-drawing': function() {
            this.status.set('isDrawing', false);
          }
        },
        {
          'Analysis/geojson': function(geojson) {
            if (geojson) {
              this.status.set('spinner', true);
              GeostoreService.save(geojson).then(
                function(geostoreId) {
                  if (geostoreId === this.status.get('geostore')) {
                    this.status.set('spinner', false);
                  }
                  this.status.set('geostore', geostoreId);
                }.bind(this)
              );
            } else {
              this.status.set('geostore', null);
            }
          }
        },

        // COUNTRY EVENTS
        {
          'Analysis/iso': function(iso, isoDisabled) {
            this.status.set({
              iso: iso,
              isoDisabled: isoDisabled
            });
            // GeostoreService.iso({ country: iso.country, region: iso.region, subRegion: iso.subRegion })
            //   .then(function(isoGeostore) {
            //     this.status.set({
            //       iso: iso,
            //       isoGeostore: isoGeostore,
            //       isoDisabled: isoDisabled
            //     });
            //   }.bind(this));
          }
        },
        {
          'Subscribe/iso': function(iso) {
            var subscritionObj = {};
            subscritionObj = {
              iso: iso,
              geostore: null,
              useid: null,
              use: null,
              wdpaid: null
            };
            this.publishSubscribtion(
              _.extend({}, this.status.toJSON(), subscritionObj)
            );
          }
        },

        // SHAPE
        {
          'Analysis/shape': function(data) {
            this.status.set({
              useid: data.useid,
              use: data.use,
              wdpaid: data.wdpaid
            });
          }
        },
        {
          'Subscribe/shape': function(data) {
            var subscritionObj = {};

            if (!!data.use && this.usenames.indexOf(data.use) === -1) {
              var provider = {
                table: data.use,
                filter: 'cartodb_id = ' + data.useid,
                user: 'wri-01',
                type: 'carto'
              };

              GeostoreService.use(provider).then(
                function(useGeostoreId) {
                  subscritionObj = {
                    iso: {
                      country: null,
                      region: null,
                      subRegion: null
                    },
                    geostore: useGeostoreId,
                    useid: null,
                    use: null,
                    wdpaid: null
                  };

                  this.publishSubscribtion(
                    _.extend({}, this.status.toJSON(), subscritionObj)
                  );
                }.bind(this)
              );
            } else {
              subscritionObj = {
                iso: {
                  country: null,
                  region: null,
                  subRegion: null
                },
                geostore: null,
                useid: data.useid,
                use: data.use,
                wdpaid: data.wdpaid
              };

              this.publishSubscribtion(
                _.extend({}, this.status.toJSON(), subscritionObj)
              );
            }
          }
        },
        {
          'Analysis/shape-enableds': function() {
            this.publishEnableds();
          }
        },

        // TIMELINE
        {
          'Timeline/date-change': function(layerSlug, date) {
            var dateFormat = 'YYYY-MM-DD';
            var date = date.map(function(date) {
              return moment(date).format(dateFormat);
            });

            this.status.set({
              begin: date[0],
              end: date[1]
            });
          }
        },
        {
          'Torque/date-range-change': function(date) {
            var dateFormat = 'YYYY-MM-DD';
            var date = date.map(function(date) {
              return moment(date).format(dateFormat);
            });

            this.status.set({
              begin: date[0],
              end: date[1]
            });
          }
        },
        {
          'Timeline/start-playing': function() {
            this.status.set('enabledUpdating', false);
          }
        },
        {
          'Timeline/stop-playing': function() {
            this.status.set('enabledUpdating', true);
          }
        },

        // GLOBAL ANALYSIS EVENTS
        {
          'Analysis/toggle': function(toggle) {
            this.status.set('mobileEnabled', toggle);
          }
        },
        {
          'Subscribe/toggle': function(toggle) {
            this.status.set('subscribe', !!toggle);
          }
        },
        {
          'Analysis/subtab': function(subtab) {
            this.status.set('subtab', subtab);
          }
        },
        {
          'Analysis/active': function(active) {
            this.status.set('active', active);
          }
        },
        {
          'Analysis/type': function(type) {
            this.status.set('type', type);
          }
        },
        {
          'Analysis/refresh': function() {
            this.publishAnalysis();
          }
        },
        {
          'Analysis/delete': function(options) {
            this.deleteAnalysis(options);
          }
        },

        // DIALOGS
        {
          'Dialogs/close': function() {
            this.status.set('mobileEnabled', false);
          }
        },
        {
          'Layers/toggle': function() {
            this.status.set('mobileEnabled', false);
          }
        }
      ],

      /**
       * LISTENERS
       *
       */
      changeBaselayers: function() {
        // Set the baselayer to analyze
        this.status.set('dataset', this.setDataset());

        // Check which baselayers are analysis-allowed
        var enabled = !!_.intersection(
          this.status.get('baselayers'),
          _.pluck(this.datasets, 'name')
        ).length;

        // Check which baselayers are subscription-allowed
        var enabledSubscription = !!_.intersection(
          this.status.get('baselayers'),
          _.pluck(_.where(this.datasets, { subscription: true }), 'name')
        ).length;

        this.status.set('enabled', enabled);
        this.status.set('enabledSubscription', enabledSubscription);

        // Check if there is a dataset
        // If true => publishAnalysis and showGeojson
        // If false => hideGeojson
        if (this.status.get('dataset')) {
          this.publishAnalysis();
          mps.publish('Analysis/showGeojson');
        } else {
          mps.publish('Analysis/hideGeojson');
        }
      },

      changeDataset: function() {
        if (this.status.get('dataset')) {
          this.publishAnalysis();
        }
      },

      changeLayerOptions: function() {
        this.publishAnalysis();
      },

      changeActive: function() {
        this.publishAnalysis();
      },

      changeSpinner: function() {
        this.view.toggleSpinner();
      },

      changeEnabled: function() {
        var enabled = this.status.get('enabled');
        mps.publish('Analysis/enabled', [enabled]);
        this.view.toggleEnabledButtons();

        // Hide analysis tab if it's not enabled
        // to make an analysis
        if (!enabled) {
          mps.publish('Tab/toggle', ['analysis-tab', enabled]);
        }
      },

      changeEnabledSubscription: function() {
        mps.publish('Analysis/enabled-subscription', [
          this.status.get('enabledSubscription')
        ]);
      },

      changeDate: function() {
        this.publishAnalysis();
      },

      changeThreshold: function() {
        this.publishAnalysis();
      },

      changeSubtab: function() {
        this.view.toggleSubtab();
      },

      changeMobileEnabled: function() {
        this.view.toggleMobile();
        mps.publish('Overlay/toggle', [this.status.get('mobileEnabled')]);
      },

      changeIsDrawing: function() {
        this.status.set('mobileEnabled', !this.status.get('isDrawing'));
      },

      changeSubscribe: function() {
        // This function is used to show the subscription modal view whenever you find
        if (this.status.get('subscribe')) {
          this.publishSubscribtion();
        } else {
          mps.publish('Subscribe/hide');
        }
      },

      /**
       * TO-DO: improve this
       * 4 TYPES OF ANALYSIS
       * - changeGeostore
       * - changeIso
       * - changeWdpaid
       * - changeUse
       */
      changeGeostore: function() {
        if (this.status.get('geostore')) {
          this.setAnalysis('draw');
        }
      },

      changeIso: function() {
        if (
          !!this.status.get('iso').country &&
          this.status.get('iso').country != 'ALL'
        ) {
          if (!this.status.get('isoDisabled')) {
            this.setAnalysis('country');
            var country = _.findWhere(this.view.countries, {
              iso: this.status.get('iso').country
            });
            if (country) {
              ga('send', 'event', 'Map', 'Analysis', country.name);
            }
          }
        }
      },

      changeWdpaid: function() {
        if (this.status.get('wdpaid')) {
          this.setAnalysis('wdpaid');
        }
      },

      changeUse: function() {
        var use = this.status.get('use'),
          useid = this.status.get('useid');
        if (!!use && !!useid && this.usenames.indexOf(use) > -1) {
          this.status.set('spinner', true);

          GeostoreService.use({ use: use, useid: useid })
            .then(
              function(geostoreId) {
                this.status.set('useGeostore', geostoreId);
                this.setAnalysis('use');
              }.bind(this)
            )
            .catch(
              function(err) {
                this.status.set('spinner', false);
                console.error(err);
              }.bind(this)
            );
        }
      },

      /**
       * SETTERS
       * - setDataset
       * @return {void}
       */
      setDataset: function() {
        var dataset = _.uniq(
          _.pluck(
            _.filter(
              this.datasets,
              function(dataset) {
                return _.contains(this.status.get('baselayers'), dataset.name);
              }.bind(this)
            ),
            'slug'
          )
        ).sort(function(a, b) {
          if (a === 'umd-loss-gain') {
            return 1;
          }
          return 0;
        });
        return dataset[0] || null;
      },

      setAnalysis: function(type) {
        this.status.set(
          {
            active: true,
            type: type
          },
          {
            silent: true
          }
        );

        this.deleteAnalysis({
          silent: true,
          type: type
        });
        this.publishAnalysis();
      },

      /**
       * PUBLISHERS
       * - publishAnalysis ****** ¡¡¡¡IMPORTANT!!!! ******
       * - publishDeleteAnalysis
       * - publishRefreshAnalysis
       * - publishNotification
       */
      publishAnalysis: _.debounce(function() {
        // 1. Check if analysis is active
        if (
          this.status.get('active') &&
          !!this.status.get('enabled') &&
          !!this.status.get('enabledUpdating')
        ) {
          this.status.set('spinner', true);

          // Open the current subtab
          var subtab = _.findWhere(this.types, {
            type: this.status.get('type')
          }).subtab;
          mps.publish('Analysis/subtab', ['analysis-' + subtab + '-tab']);

          // Open the analysis tab
          mps.publish('Tab/toggle', ['analysis-tab', true]);

          var analysisFetch = function() {
            return AnalysisService.get(this.status.toJSON())
              .then(
                function(response, xhr) {
                  this.status.set('spinner', false);

                  var statusWithResults = _.extend({}, this.status.toJSON(), {
                    results: response.data.attributes
                  });
                  mps.publish('Analysis/results', [statusWithResults]);
                }.bind(this)
              )
              .catch(
                function(errors) {
                  this.status.set('spinner', false);

                  var statusWithErrors = _.extend(
                    {},
                    this.status.toJSON(),
                    errors
                  );
                  mps.publish('Analysis/results-error', [statusWithErrors]);
                }.bind(this)
              )
              .finally(
                function() {
                  this.status.set('spinner', false);
                }.bind(this)
              );
          }.bind(this);

          var iso = this.status.get('iso');
          // Send request to the Analysis Service
          if (iso && iso.subRegion) {
            GeostoreService.iso(iso)
              .then(
                function(geostoreId) {
                  this.status.set('useGeostore', geostoreId);
                  // this.status.set('type', 'country');
                  return analysisFetch();
                }.bind(this)
              )
              .catch(
                function(err) {
                  this.status.set('spinner', false);
                  console.error(err);
                }.bind(this)
              );
          } else {
            return analysisFetch();
          }
        }
      }, 500),

      publishDeleteAnalysis: function() {
        mps.publish('Analysis/delete');
      },

      publishRefreshAnalysis: function() {
        mps.publish('Analysis/refresh');
      },

      publishSubscribtion: function(data) {
        mps.publish('Subscribe/show', [data || this.status.toJSON()]);
      },

      publishNotification: function(id) {
        mps.publish('Notification/open', [id]);
      },

      publishCanopyAnalysis: function() {
        mps.publish('ThresholdControls/show');
      },

      publishDownloadsAnalysis: function(active) {
        mps.publish('Analysis/downloads-toggle', [active]);
      },

      publishEnableds: function() {
        mps.publish('Analysis/enabled', [this.status.get('enabled')]);
        mps.publish('Analysis/enabled-subscription', [
          this.status.get('enabledSubscription')
        ]);
      },

      publishMobileActive: function() {
        mps.publish('Analysis/toggle', [!this.status.get('mobileEnabled')]);
      },

      /**
       * HELPERS
       * - deleteAnalysis
       */
      deleteAnalysis: function(options) {
        var type = options ? options.type : null;
        var statusFiltered = type
          ? _.filter(this.types, function(v) {
              return v.type != type;
            })
          : this.types;

        // If type exists delete all stuff related
        // to other analysis
        // 'iso' and 'isoDisabled' need a different treatment
        _.each(
          statusFiltered,
          function(v) {
            switch (v.name) {
              case 'iso':
                this.status.set(
                  'iso',
                  {
                    country: null,
                    region: null,
                    subRegion: null
                  },
                  options
                );
                break;
              case 'isoDisabled':
                this.status.set('isoDisabled', true);
                break;
              default:
                this.status.set(v.name, null, options);
                break;
            }
          }.bind(this)
        );

        // If type doesn't exist remove type, active and enabledUpdating
        if (!type) {
          this.status.set('type', null, options);
          this.status.set('active', false, options);
          this.status.set('enabledUpdating', true, options);

          this.view.reRenderChildrenViews();
        }

        this.view.toggleSubtab();
        this.status.set('spinner', false);

        mps.publish('Place/update', [{ go: false }]);
      }
    });

    return AnalysisNewPresenter;
  }
);
