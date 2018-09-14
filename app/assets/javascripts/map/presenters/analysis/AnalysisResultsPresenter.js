/*eslint-disable*/
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
    'helpers/datasetsHelper',
    'helpers/geojsonUtilsHelper'
  ],
  function(
    PresenterClass,
    _,
    Backbone,
    moment,
    mps,
    datasetsHelper,
    geojsonUtilsHelper
  ) {
    var StatusModel = Backbone.Model.extend({
      defaults: {
        baselayer: null,
        both: false,
        analysis: false,
        isoTotalArea: null,
        resource: null // analysis resource
      }
    });

    var AnalysisResultsPresenter = PresenterClass.extend({
      /**
       * Layers that support email subscriptions.
       */
      _alertsSubscriptionLayers: ['forma'],

      datasets: {
        loss: 'umd-loss-gain',
        loss_by_driver: 'umd-loss-gain',
        forestgain: 'umd-loss-gain',
        forma: 'forma-alerts',
        forma_month_3: 'forma250GFW',
        imazon: 'imazon-alerts',
        terrailoss: 'terrai-alerts',
        prodes: 'prodes-loss',
        guyra: 'guira-loss',
        forest2000: 'umd-loss-gain',
        forest2010: 'umd-loss-gain',
        umd_as_it_happens: 'glad-alerts',
        umd_as_it_happens_per: 'glad-alerts',
        umd_as_it_happens_cog: 'glad-alerts',
        umd_as_it_happens_idn: 'glad-alerts',
        viirs_fires_alerts: 'viirs-active-fires'
      },

      init: function(view) {
        this.view = view;
        this.status = new StatusModel();
        this._super();
      },

      /**
       * Application subscriptions.
       */
      _subscriptions: [
        {
          'Place/go': function(place) {
            this._setBaselayer(place.layerSpec.getBaselayers());
            this.status.set(
              'loss_gain_and_extent',
              place.layerSpec.checkLossGainExtent()
            );
            if (place.params.subscribe_alerts) this.subscribeAnalysis();
          }
        },
        {
          'LayerNav/change': function(layerSpec) {
            this._setBaselayer(layerSpec.getBaselayers());
            this.status.set(
              'loss_gain_and_extent',
              layerSpec.checkLossGainExtent()
            );
          }
        },
        {
          'AnalysisService/results': function(results) {
            this._renderResults(results);
          }
        },
        {
          'AnalysisResults/totalArea': function(area) {
            this._setTotalArea(area);
          }
        },
        {
          'AnalysisTool/iso-drawn': function(multipolygon) {
            var isoTotalArea = geojsonUtilsHelper.getHectares(multipolygon);
            this.status.set('isoTotalArea', isoTotalArea);
          }
        },
        {
          /**
           * Get the analysis resource so we can
           * get the data for the subscribe button.
           *
           * @param  {Object} resource Analysis resource
           */
          'AnalysisService/get': function(resource) {
            this.status.set('resource', resource);
          }
        },
        {
          'AnalysisResults/Delete': function() {
            this.view._deleteAnalysisView();
          }
        },
        {
          'Analysis/toggle': function(boolean) {
            this.view.toogleAnalysis(boolean);
          }
        },
        {
          'DownloadView/create': function(downloadView) {
            this.view.downloadView = downloadView;
          }
        }
      ],

      /**
       * Set the status.baselayer from layerSpec.
       *
       * @param {Object} baselayers Current active baselayers
       */
      _setBaselayer: function(baselayers) {
        var baselayer;

        if (baselayers.loss) {
          this.loss = true;
          baselayer = baselayers.loss;
          this.status.set('both', !!baselayers.forestgain);
        } else {
          this.loss = false;
          baselayer =
            baselayers[
              _.first(
                _.intersection(
                  _.pluck(baselayers, 'slug'),
                  _.keys(this.datasets)
                )
              )
            ];
        }

        this.status.set('baselayer', baselayer);
      },

      /**
       * Set the subscribe button to disabled if alerts
       * are not supported for the current layers.
       */
      _setSubscribeButton: function() {
        // var supported = false;
        // var baselayer = this.status.get('baselayer');

        // Subscriptions not supported for regions yet.
        // if (baselayer && !this.status.get('resource').id1) {
        //   supported = _.indexOf(this._alertsSubscriptionLayers,
        //     baselayer.slug) >= 0;
        // }

        this.view.toggleSubscribeButton(false);
      },

      /**
       * Handle analysis results from the supplied object.
       *
       * @param  {Object} results [description]
       */
      _renderResults: function(results) {
        // Even if the result is a failure or unavailable message, we render
        // the widget results and keep the polygon.
        this.status.set('analysis', true);
        if (results.unavailable) {
          mps.publish('Spinner/stop');
          this.view.renderFailure();
        } else if (results.failure) {
          mps.publish('Spinner/stop');
          this.view.renderFailureOnApi();
        } else {
          mps.publish('Spinner/stop');
          this._renderAnalysis(results);
          // Subscribe button just should be activated
          // when a analysis is succesfully rendered.
          this.view.$tab.addClass('is-analysis');
          mps.publish('Analysis/toggle', [
            this.view.$tab.hasClass('is-analysis')
          ]);
          this._setSubscribeButton();
        }
      },

      /**
       * Render the analysis from the supplied AnalysisService
       * results object.
       *
       * @param  {Object} results Results object form the AnalysisService
       */
      _renderAnalysis: function(results) {
        var layer = this.status.get('baselayer');

        // Unexpected results from successful request
        if (!layer) {
          this._renderResults({ failure: true });
          return;
        }

        if (_.values(this.datasets).indexOf(results.meta.id) > -1) {
          var params = this._getAnalysisResource(results, layer);
          this.view.renderAnalysis(params);
          mps.publish('Place/update', [{ go: false }]);
        }
      },

      /**
       * Updates current analysis if it's permitted.
       */
      _updateAnalysis: function() {
        if (
          this.status.get('analysis') &&
          !this.status.get('disableUpdating')
        ) {
          mps.publish('AnalysisTool/update-analysis', []);
        }
      },

      /**
       * Render analysis subscribe dialog by publishing
       * to SubscribePresenter.
       */
      subscribeAnalysis: function() {
        var options = {
          analysisResource: this.status.get('resource'),
          layer: this.status.get('baselayer')
        };

        mps.publish('Subscribe/show', [options]);
      },

      /**
       * Delete the current analysis and abort the current
       * AnalysisService request.
       */
      deleteAnalysis: function() {
        this.status.set('analysis', false);
        this.status.set('iso', null);
        this.status.set('resource', null);
        this.view.model.set('boxHidden', true);
        mps.publish('AnalysisService/cancel', []);
        mps.publish('AnalysisResults/delete-analysis', []);
        mps.publish('Place/update', [{ go: false }]);
      },

      refreshAnalysis: function() {
        mps.publish('AnalysisService/refresh', []);
      },

      /**
       * Set total area for countries, protected areas or forest use layers
       */
      _setTotalArea: function(area) {
        this.totalArea = area.hectares;
      },

      _getTotalArea: function() {
        return this.totalArea;
      },

      /**
       * Get analysis resource params which are going to be
       * pass to the html to render the analysis results.
       *
       * @param  {Object} results Results object form the AnalysisService
       * @param  {Object} layer   The layer object
       * @return {Object}         Returns resource params
       */

      _getAnalysisResource: function(results, layer) {
        var p = {};

        p.slug = layer.slug;
        p.layer = layer;
        p.download = results.download_urls;
        if (p.download) {
          p.download.cdb = p.download.kml
            ? encodeURIComponent(
                p.download.kml + '&filename=GFW_Analysis_Results'
              )
            : null;
        }

        p.alertsName = results.meta.name;

        if (results.params.iso) {
          p.iso = results.params.iso;
        }

        var dateRange = [
          moment(results.params.begin),
          moment(results.params.end)
        ];

        p.dateRange = '{0} to {1}'.format(
          dateRange[0].format('MMM-YYYY'),
          dateRange[1].format('MMM-YYYY')
        );

        if (results.params.geojson) {
          p.totalArea = geojsonUtilsHelper.getHectares(results.params.geojson);
        } else if (results.params.iso) {
          p.totalArea = this.status.get('isoTotalArea')
            ? this.status.get('isoTotalArea')
            : 0;
        }

        if (layer.slug === 'prodes') {
          p.dateRange = '{0}-{1}'.format(
            dateRange[0].year(),
            dateRange[1].year() - 1
          );
        }

        /**
         * UMD Loss and gain params.
         *   - lossDateRange
         *   - lossAlerts
         *   - gainAlerts
         *   - extent
         */
        if (
          layer.slug === 'loss' ||
          layer.slug === 'loss_by_driver' ||
          layer.slug === 'forestgain' ||
          layer.slug === 'forestgain' ||
          layer.slug === 'forest2000' ||
          layer.slug === 'forest2010'
        ) {
          p.lossDateRange = '{0}-{1}'.format(
            dateRange[0].year(),
            dateRange[1].year() - 1
          );
          p.extent = p.gainAlerts = p.lossAlerts = 0;
          p.threshold = results.params.thresh || 30;
          p.both = this.status.get('both');
          // The api returns all the loss and gain alerts.
          if (results.years) {
            p.gainAlerts = results.years[0].total_gain;
            p.extent = results.years[results.years.length - 1].extent;
            var years = _.range(dateRange[1].diff(dateRange[0], 'years'));
            _.each(function(years, i) {
              var year = _.findWhere(results.years, {
                year: dateRange[0].year() + i
              });
              if (!year) {
                return;
              }
              p.lossAlerts += year.loss;
            });
          }
          p.lossAlerts = results.loss
            ? this.roundNumber(results.loss)
            : this.roundNumber(p.lossAlerts);
          p.gainAlerts = results.gain
            ? this.roundNumber(results.gain)
            : this.roundNumber(p.gainAlerts);
          p.extent = results['tree-extent']
            ? this.roundNumber(results['tree-extent'])
            : this.roundNumber(p.extent);
        }

        /**
         * Imazon params
         *   - totalAlerts
         *   - degrad
         *   - defor
         *   - color
         */
        if (layer.slug !== 'imazon') {
          p.totalAlerts = results.value
            ? Math.round(results.value).toLocaleString()
            : 0;
        }

        if (layer.slug === 'imazon') {
          p.degrad = results.value[0]
            ? Math.round(results.value[0].value).toLocaleString()
            : 0;
          p.defor = results.value[1]
            ? Math.round(results.value[1].value).toLocaleString()
            : 0;
          p.layer.category_color = '#FFACC8';
        }
        /**
         * WDPA, FOREST USE params
         *   - totalArea
         */
        if (results.params.wdpaid || results.params.useid) {
          p.totalArea = this._getTotalArea();
        }

        return p;
      },

      roundNumber: function(value) {
        return value < 10
          ? value.toFixed(2).toLocaleString()
          : Math.round(value).toLocaleString();
      },

      showCanopy: function() {
        mps.publish('ThresholdControls/show');
      },

      toggleSubscribeButton: function() {
        var subscriptionsAllowed = datasetsHelper.getListSubscriptionsAllowed();
        var baselayer = this.status.get('baselayer').slug;
        if (subscriptionsAllowed.indexOf(baselayer) === -1) {
          this.view.$('#analysis-subscribe').addClass('disabled');
        } else {
          this.view.$('#analysis-subscribe').removeClass('disabled');
        }
      }
    });

    return AnalysisResultsPresenter;
  }
);
