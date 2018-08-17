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
  function(PresenterClass, _, Backbone, moment, mps, CountryService) {
    var AnalysisResultsPresenter = PresenterClass.extend({
      status: new (Backbone.Model.extend())(),

      init: function(view) {
        this.view = view;
        this._super();
        this.listeners();
      },

      listeners: function() {
        this.status.on('change:resource', this.changeResource.bind(this));
      },

      /**
       * Application subscriptions.
       */
      _subscriptions: [
        {
          'Place/go': function(place) {
            var params = place.params;
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
            if (!status.results) {
              this.publishNotification('notification-empty-analysis');
              this.view.renderError();
            } else {
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
          }
        },
        {
          'Analysis/results-error': function(status) {
            this.status.set(status, { silent: true });
            this.view.renderError();
          }
        }
      ],

      changeResource: function() {
        var iso = this.status.get('iso');

        // Get regions if analysis has country
        if (!!iso.country && iso.country != 'ALL') {
          this.getRegions();
          if (!!iso.region) {
            this.getSubRegions();
          }
        } else {
          this.view.render();
        }
      },

      getRegions: function() {
        var iso = this.status.get('iso');

        CountryService.getRegionsList({ iso: iso.country }).then(
          function(results) {
            this.status.set({
              regions: results
            });
            this.view.render();
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
            this.view.render();
          }.bind(this)
        );
      },

      /**
       * Get analysis resource params which are going to be
       * pass to the html to render the analysis results.
       *
       * @param  {Object} results Results object form the AnalysisService
       * @return {Object}         Returns resource params
       */

      setAnalysisResource: function(status) {
        var p = {};
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
        p.alerts.totalAlerts = this.roundNumber(results.loss || 0);

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
        // If glads enpoint; api response schema is different!
        p.alerts.totalAlerts =
          p.baselayers && typeof p.baselayers.umd_as_it_happens !== 'undefined'
            ? this.roundNumber(results.alerts || 0)
            : this.roundNumber(results.loss || 0);

        p.areaHa = this.roundNumber(results.areaHa || 0);
        p.alerts.gainAlerts = this.roundNumber(results.gain || 0);
        p.alerts.treeExtent = this.roundNumber(
          results.extent2000 || results.treeExtent || 0
        );
        p.alerts.treeExtent2010 = this.roundNumber(
          results.extent2010 || results.treeExtent2010 || 0
        );

        // Dates
        p.dates.lossDateRange = '{0}-{1}'.format(
          dateRange[0].year(),
          dateRange[1].year() - 1
        );

        if (p.slug === 'viirs-active-fires') {
          p.alerts.totalAlerts = this.roundNumber(results.alerts || 0);
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
          p.alerts.totalAlerts = this.roundNumber(results.loss || 0);
        }
        return p;
      },

      /**
       * PUBLISHERS
       * - publishRefreshAnalysis
       * - publishShowCanopy
       * - publishNotification
       */
      publishDeleteAnalysis: function() {
        mps.publish('Analysis/delete');
      },

      publishRefreshAnalysis: function() {
        mps.publish('Analysis/refresh');
      },

      publishShowCanopy: function() {
        mps.publish('ThresholdControls/show');
      },

      publishNotification: function(id) {
        mps.publish('Notification/open', [id]);
      },

      /**
       * HELPER
       * - roundNumber
       */
      roundNumber: function(value) {
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
