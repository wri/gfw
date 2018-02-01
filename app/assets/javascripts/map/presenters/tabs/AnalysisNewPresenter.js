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
  (
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
  ) => {
    const AnalysisNewPresenter = PresenterClass.extend({
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
            region: null
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

      init(view) {
        this.view = view;
        this._super();
        this.listeners();
        mps.publish('Place/register', [this]);
      },

      listeners() {
        // dev
        this.status.on('change', () => {
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
      getPlaceParams() {
        const p = {};

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
          'Place/go': function (place) {
            const params = place.params;
            const layerSpec = place.layerSpec;

            this.status.set({
              // Countries
              iso: {
                country: params.iso.country,
                region: params.iso.region
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
          'LayerNav/change': function (layerSpec) {
            const currentBaselayers = this.status.get('baselayers');
            const newBaselayers = _.keys(layerSpec.getBaselayers());

            const baselayers_change =
              !!_.difference(currentBaselayers, newBaselayers).length ||
              !!_.difference(newBaselayers, currentBaselayers).length;
            if (baselayers_change) {
              this.status.set('baselayers', _.keys(layerSpec.getBaselayers()));
              this.status.set('baselayer', layerSpec.getBaselayer());
            }
          }
        },
        {
          'LayerNav/changeLayerOptions': function (layerOptions) {
            this.status.set('layerOptions', _.clone(layerOptions));
          }
        },
        {
          'Threshold/update': function (threshold) {
            this.status.set('threshold', threshold);
          }
        },

        // DRAWING EVENTS
        {
          'Analysis/start-drawing': function () {
            this.status.set('isDrawing', true);
          }
        },
        {
          'Analysis/stop-drawing': function () {
            this.status.set('isDrawing', false);
          }
        },
        {
          'Analysis/geojson': function (geojson) {
            if (geojson) {
              this.status.set('spinner', true);
              GeostoreService.save(geojson).then(geostoreId => {
                if (geostoreId === this.status.get('geostore')) {
                  this.status.set('spinner', false);
                }
                this.status.set('geostore', geostoreId);
              });
            } else {
              this.status.set('geostore', null);
            }
          }
        },

        // COUNTRY EVENTS
        {
          'Analysis/iso': function (iso, isoDisabled) {
            this.status.set({
              iso,
              isoDisabled
            });
          }
        },
        {
          'Subscribe/iso': function (iso) {
            let subscritionObj = {};
            subscritionObj = {
              iso,
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
          'Analysis/shape': function (data) {
            this.status.set({
              useid: data.useid,
              use: data.use,
              wdpaid: data.wdpaid
            });
          }
        },
        {
          'Subscribe/shape': function (data) {
            let subscritionObj = {};

            if (!!data.use && this.usenames.indexOf(data.use) === -1) {
              const provider = {
                table: data.use,
                filter: `cartodb_id = ${data.useid}`,
                user: 'wri-01',
                type: 'carto'
              };

              GeostoreService.use(provider).then(useGeostoreId => {
                subscritionObj = {
                  iso: {
                    country: null,
                    region: null
                  },
                  geostore: useGeostoreId,
                  useid: null,
                  use: null,
                  wdpaid: null
                };

                this.publishSubscribtion(
                  _.extend({}, this.status.toJSON(), subscritionObj)
                );
              });
            } else {
              subscritionObj = {
                iso: {
                  country: null,
                  region: null
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
          'Analysis/shape-enableds': function () {
            this.publishEnableds();
          }
        },

        // TIMELINE
        {
          'Timeline/date-change': function (layerSlug, date) {
            const dateFormat = 'YYYY-MM-DD';
            var date = date.map(date => moment(date).format(dateFormat));

            this.status.set({
              begin: date[0],
              end: date[1]
            });
          }
        },
        {
          'Torque/date-range-change': function (date) {
            const dateFormat = 'YYYY-MM-DD';
            var date = date.map(date => moment(date).format(dateFormat));

            this.status.set({
              begin: date[0],
              end: date[1]
            });
          }
        },
        {
          'Timeline/start-playing': function () {
            this.status.set('enabledUpdating', false);
          }
        },
        {
          'Timeline/stop-playing': function () {
            this.status.set('enabledUpdating', true);
          }
        },

        // GLOBAL ANALYSIS EVENTS
        {
          'Analysis/toggle': function (toggle) {
            this.status.set('mobileEnabled', toggle);
          }
        },
        {
          'Subscribe/toggle': function (toggle) {
            this.status.set('subscribe', !!toggle);
          }
        },
        {
          'Analysis/subtab': function (subtab) {
            this.status.set('subtab', subtab);
          }
        },
        {
          'Analysis/active': function (active) {
            this.status.set('active', active);
          }
        },
        {
          'Analysis/type': function (type) {
            this.status.set('type', type);
          }
        },
        {
          'Analysis/refresh': function () {
            this.publishAnalysis();
          }
        },
        {
          'Analysis/delete': function (options) {
            this.deleteAnalysis(options);
          }
        },

        // DIALOGS
        {
          'Dialogs/close': function () {
            this.status.set('mobileEnabled', false);
          }
        },
        {
          'Layers/toggle': function () {
            this.status.set('mobileEnabled', false);
          }
        }
      ],

      /**
       * LISTENERS
       *
       */
      changeBaselayers() {
        // Set the baselayer to analyze
        this.status.set('dataset', this.setDataset());

        // Check which baselayers are analysis-allowed
        const enabled = !!_.intersection(
          this.status.get('baselayers'),
          _.pluck(this.datasets, 'name')
        ).length;

        // Check which baselayers are subscription-allowed
        const enabledSubscription = !!_.intersection(
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

      changeDataset() {
        if (this.status.get('dataset')) {
          this.publishAnalysis();
        }
      },

      changeLayerOptions() {
        this.publishAnalysis();
      },

      changeActive() {
        this.publishAnalysis();
      },

      changeSpinner() {
        this.view.toggleSpinner();
      },

      changeEnabled() {
        const enabled = this.status.get('enabled');
        mps.publish('Analysis/enabled', [enabled]);
        this.view.toggleEnabledButtons();

        // Hide analysis tab if it's not enabled
        // to make an analysis
        if (!enabled) {
          mps.publish('Tab/toggle', ['analysis-tab', enabled]);
        }
      },

      changeEnabledSubscription() {
        mps.publish('Analysis/enabled-subscription', [
          this.status.get('enabledSubscription')
        ]);
      },

      changeDate() {
        this.publishAnalysis();
      },

      changeThreshold() {
        this.publishAnalysis();
      },

      changeSubtab() {
        this.view.toggleSubtab();
      },

      changeMobileEnabled() {
        this.view.toggleMobile();
        mps.publish('Overlay/toggle', [this.status.get('mobileEnabled')]);
      },

      changeIsDrawing() {
        this.status.set('mobileEnabled', !this.status.get('isDrawing'));
      },

      changeSubscribe() {
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
      changeGeostore() {
        if (this.status.get('geostore')) {
          this.setAnalysis('draw');
        }
      },

      changeIso() {
        if (
          !!this.status.get('iso').country &&
          this.status.get('iso').country != 'ALL'
        ) {
          if (!this.status.get('isoDisabled')) {
            this.setAnalysis('country');
            const country = _.findWhere(this.view.countries, {
              iso: this.status.get('iso').country
            });
            if (country) {
              ga('send', 'event', 'Map', 'Analysis', country.name);
            }
          }
        }
      },

      changeWdpaid() {
        if (this.status.get('wdpaid')) {
          this.setAnalysis('wdpaid');
        }
      },

      changeUse() {
        let use = this.status.get('use'),
          useid = this.status.get('useid');

        if (!!use && !!useid) {
          if (this.usenames.indexOf(use) !== -1) {
            this.setAnalysis('use');
          } else {
            this.status.set('spinner', true);

            const provider = {
              table: use,
              filter: `cartodb_id = ${useid}`,
              user: 'wri-01',
              type: 'carto'
            };

            GeostoreService.use(provider).then(useGeostoreId => {
              this.status.set('useGeostore', useGeostoreId);
              this.setAnalysis('use');
            });
          }
        }
      },

      /**
       * SETTERS
       * - setDataset
       * @return {void}
       */
      setDataset() {
        const dataset = _.uniq(
          _.pluck(
            _.filter(this.datasets, dataset =>
              _.contains(this.status.get('baselayers'), dataset.name)
            ),
            'slug'
          )
        );
        return dataset[0] || null;
      },

      setAnalysis(type) {
        this.status.set(
          {
            active: true,
            type
          },
          {
            silent: true
          }
        );

        this.deleteAnalysis({
          silent: true,
          type
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
      publishAnalysis() {
        // 1. Check if analysis is active
        if (
          this.status.get('active') &&
          !!this.status.get('enabled') &&
          !!this.status.get('enabledUpdating')
        ) {
          this.status.set('spinner', true);

          // Open the current subtab
          const subtab = _.findWhere(this.types, {
            type: this.status.get('type')
          }).subtab;
          mps.publish('Analysis/subtab', [`analysis-${subtab}-tab`]);

          // Open the analysis tab
          mps.publish('Tab/toggle', ['analysis-tab', true]);

          // Send request to the Analysis Service
          AnalysisService.get(this.status.toJSON())

            .then((response, xhr) => {
              this.status.set('spinner', false);

              const statusWithResults = _.extend({}, this.status.toJSON(), {
                results: response.data.attributes
              });
              mps.publish('Analysis/results', [statusWithResults]);
            })

            .catch(errors => {
              this.status.set('spinner', false);

              const statusWithErrors = _.extend(
                {},
                this.status.toJSON(),
                errors
              );
              mps.publish('Analysis/results-error', [statusWithErrors]);
            })

            .finally(() => {
              this.status.set('spinner', false);
            });
        }
      },

      publishDeleteAnalysis() {
        mps.publish('Analysis/delete');
      },

      publishRefreshAnalysis() {
        mps.publish('Analysis/refresh');
      },

      publishSubscribtion(data) {
        mps.publish('Subscribe/show', [data || this.status.toJSON()]);
      },

      publishNotification(id) {
        mps.publish('Notification/open', [id]);
      },

      publishCanopyAnalysis() {
        mps.publish('ThresholdControls/show');
      },

      publishDownloadsAnalysis(active) {
        mps.publish('Analysis/downloads-toggle', [active]);
      },

      publishEnableds() {
        mps.publish('Analysis/enabled', [this.status.get('enabled')]);
        mps.publish('Analysis/enabled-subscription', [
          this.status.get('enabledSubscription')
        ]);
      },

      publishMobileActive() {
        mps.publish('Analysis/toggle', [!this.status.get('mobileEnabled')]);
      },

      /**
       * HELPERS
       * - deleteAnalysis
       */
      deleteAnalysis(options) {
        const type = options ? options.type : null;
        const statusFiltered = type
          ? _.filter(this.types, v => v.type != type)
          : this.types;

        // If type exists delete all stuff related
        // to other analysis
        // 'iso' and 'isoDisabled' need a different treatment
        _.each(statusFiltered, v => {
          switch (v.name) {
            case 'iso':
              this.status.set(
                'iso',
                {
                  country: null,
                  region: null
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
        });

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
