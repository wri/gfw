/* eslint-disable */
/**
 * The AnalysisResultsPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisResultsPresenter class.
 */
define(
  [
    'map/presenters/PresenterClass',
    'underscore',
    'backbone',
    'moment',
    'mps',
    'services/CountryService'
  ],
  (PresenterClass, _, Backbone, moment, mps, CountryService) => {
    const AnalysisResultsPresenter = PresenterClass.extend({
      status: new (Backbone.Model.extend())(),

      init(view) {
        this.view = view;
        this._super();
        this.listeners();
      },

      listeners() {
        this.status.on('change:resource', this.changeResource.bind(this));
      },

      /**
       * Application subscriptions.
       */
      _subscriptions: [
        {
          'Place/go': function(place) {
            const params = place.params;
            this.status.set(
              'baselayers_full',
              place.layerSpec.getBaselayers(),
              { silent: true }
            );
          }
        },
        {
          'LayerNav/change': function(layerSpec) {
            this.status.set('baselayers_full', layerSpec.getBaselayers(), {
              silent: true
            });
          }
        },
        {
          'Analysis/results': function(status) {
            this.status.set(status, { silent: true });
            this.status.set(
              {
                resource: _.clone(this.setAnalysisResource())
              },
              {
                silent: true
              }
            );

            // Trigger change always
            this.changeResource();
          }
        },
        {
          'Analysis/results-error': function(status) {
            this.status.set(status, { silent: true });
            this.view.renderError();
          }
        }
      ],

      changeResource() {
        const iso = this.status.get('iso');

        // Get regions if analysis has country
        !!iso.country && iso.country != 'ALL'
          ? this.getRegions()
          : this.view.render();
      },

      getRegions() {
        const iso = this.status.get('iso');

        CountryService.getRegionsList({ iso: iso.country }).then(results => {
          this.status.set({
            regions: results
          });
          this.view.render();
        });
      },

      /**
       * Get analysis resource params which are going to be
       * pass to the html to render the analysis results.
       *
       * @param  {Object} results Results object form the AnalysisService
       * @return {Object}         Returns resource params
       */

      setAnalysisResource(status) {
        const p = {};
        /**
         * Define variable that we are going to use later
         */
        var type = this.status.get('type'),
          results = this.status.get('results'),
          dateRange = [
            moment(this.status.get('begin')),
            moment(this.status.get('end'))
          ];

        // Layers
        p.slug = this.status.get('dataset');
        p.baselayers = this.status.get('baselayers_full');

        // Area
        p.areaHa = this.roundNumber(results.areaHa || 0);

        // Alerts
        p.alerts = {};
        p.alerts.totalAlerts = this.roundNumber(results.value || 0);

        // Options
        p.options = {};
        p.options.threshold = this.status.get('threshold');
        p.options.enabledSubscription = this.status.get('enabledSubscription');
        p.options.enabledDownload = !!results.downloadUrls;

        if (results.downloadUrls) {
          mps.publish('Analysis/downloads', [results.downloadUrls]);
        }

        // Dates
        p.dates = {};
        p.dates.dateRange = '{0} to {1}'.format(
          dateRange[0].format('MMM-YYYY'),
          dateRange[1].format('MMM-YYYY')
        );

        /**
         * Exceptions
         */
        if (p.slug === 'umd-loss-gain') {
          var results = type == 'country' ? results.totals : results;
          p.areaHa = this.roundNumber(results.areaHa || 0);
          p.alerts.totalAlerts = this.roundNumber(results.loss || 0);
          p.alerts.gainAlerts = this.roundNumber(results.gain || 0);
          p.alerts.treeExtent = this.roundNumber(results.extent2000 || 0);
          p.alerts.treeExtent2010 = this.roundNumber(results.extent2010 || 0);

          // Dates
          p.dates.lossDateRange = '{0}-{1}'.format(
            dateRange[0].year(),
            dateRange[1].year() - 1
          );
        }

        if (p.slug === 'imazon-alerts') {
          p.alerts.degradAlerts =
            !!results.value.length && results.value[0]
              ? Math.round(results.value[0].value).toLocaleString()
              : 0;
          p.alerts.deforAlerts =
            !!results.value.length && results.value[1]
              ? Math.round(results.value[1].value).toLocaleString()
              : 0;
        }

        if (p.slug === 'prodes-loss') {
          p.dates.dateRange = '{0}-{1}'.format(
            dateRange[0].year(),
            dateRange[1].year() - 1
          );
        }

        if (p.slug === 'forma250GFW') {
          p.alerts.totalAlerts = this.roundNumber(results.alertCounts || 0);
        }

        return p;
      },

      /**
       * PUBLISHERS
       * - publishRefreshAnalysis
       * - publishShowCanopy
       * - publishNotification
       */
      publishDeleteAnalysis() {
        mps.publish('Analysis/delete');
      },

      publishRefreshAnalysis() {
        mps.publish('Analysis/refresh');
      },

      publishShowCanopy() {
        mps.publish('ThresholdControls/show');
      },

      publishNotification(id) {
        mps.publish('Notification/open', [id]);
      },

      /**
       * HELPER
       * - roundNumber
       */
      roundNumber(value) {
        if (_.isNumber(value)) {
          // Check if value has decimals
          return value < 10 && value % 1 != 0
            ? value.toFixed(2).toLocaleString()
            : (~~value).toLocaleString();
        }
        return 0;
      }
    });

    return AnalysisResultsPresenter;
  }
);
