/**
 * The AnalysisResultsPresenter class for the AnalysisResultsView.
 *
 * @return AnalysisResultsPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore',
  'backbone',
  'moment',
  'mps',
  'helpers/geojsonUtilsHelper'
], function(PresenterClass, _, Backbone, moment, mps, geojsonUtilsHelper) {

  'use strict';

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
    _alertsSubscriptionLayers: [
      'forma'
    ],

    datasets: {
      'loss': 'umd-loss-gain',
      'forestgain': 'umd-loss-gain',
      'forma': 'forma-alerts',
      'imazon': 'imazon-alerts',
      'fires': 'nasa-active-fires',
      'modis': 'quicc-alerts',
      'terrailoss': 'terrai-alerts'
    },

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this._setBaselayer(place.layerSpec.getBaselayers());
        if ( place.params.subscribe_alerts ) this.subscribeAnalysis();
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this._setBaselayer(layerSpec.getBaselayers());
      }
    }, {
      'AnalysisService/get': function() {
        this._renderResults({loading: true});
      }
    }, {
      'AnalysisService/results': function(results) {
        this._renderResults(results);
      }
    }, {
      'AnalysisResults/unavailable': function() {
        this._renderResults({unavailable: true});
      }
    }, {
      'AnalysisResults/totalArea': function(area) {
        this._setTotalArea(area);
      }
    }, {
      'AnalysisTool/iso-drawn': function(multipolygon) {
        var isoTotalArea = geojsonUtilsHelper.getHectares(
          multipolygon);
        this.status.set('isoTotalArea', isoTotalArea);
      }
    }, {
      /**
       * Get the analysis resource so we can
       * get the data for the subscribe button.
       *
       * @param  {Object} resource Analysis resource
       */
      'AnalysisService/get': function(resource) {
        this.status.set('resource', resource);
      }
    }, {
      'AnalysisResults/Delete': function() {
        this.view._deleteAnalysisView();
      }
    },{
      'AnalysisMobile/open': function() {
        this.view.toogleAnalysis($('#analysis-tab').hasClass('is-analysis'));
      }
    },{
      'DownloadView/create': function(downloadView) {
        this.view.downloadView = downloadView;
      }
    }],

    /**
     * Set the status.baselayer from layerSpec.
     *
     * @param {Object} baselayers Current active baselayers
     */
    _setBaselayer: function(baselayers) {
      var baselayer;

      if (baselayers['loss']) {
        this.loss = true;
        baselayer = baselayers['loss'];
        this.status.set('both', (baselayers['forestgain']) ? true : false);
      }else{
        this.loss = false;
        baselayer = baselayers[_.first(_.intersection(
          _.pluck(baselayers, 'slug'),
          _.keys(this.datasets)))];
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
      if (results.loading) {
        this.view.renderLoading();
      } else if (results.unavailable) {
        mps.publish('Spinner/stop');
        this.view.renderUnavailable();
      } else if (results.failure) {
        mps.publish('Spinner/stop');
        this.view.renderFailure();
      } else {
        mps.publish('Spinner/stop');
        this._renderAnalysis(results);
        // Subscribe button just should be activated
        // when a analysis is succesfully rendered.
        this.view.$tab.addClass('is-analysis');
        mps.publish('AnalysisMobile/open');
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
        this._renderResults({failure: true});
        return;
      }

      var params = this._getAnalysisResource(results, layer);
      this.view.renderAnalysis(params);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Updates current analysis if it's permitted.
     */
    _updateAnalysis: function() {
      if (this.status.get('analysis') && !this.status.get('disableUpdating')) {
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
      mps.publish('Place/update', [{go: false}]);
    },


    /**
     * Set total area for countries, protected areas or forest use layers
     */
    _setTotalArea: function(area){
      this.totalArea = area.hectares;
    },

    _getTotalArea: function(){
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

      p[layer.slug] = true;
      p.layer = layer;
      p.download = results.download_urls;
      if (p.download) {
        p.download.cdb = (p.download.kml) ? encodeURIComponent(p.download.kml + '&filename=GFW_Analysis_Results') : null;
      }

      p.alertsName = results.meta.name;

      if (results.params.iso) {
        p.iso = results.params.iso;
      }

      var dateRange = [moment(results.params.begin),
        moment(results.params.end)];

      p.dateRange = '{0} to {1}'.format(dateRange[0].format('MMM-YYYY'),
        dateRange[1].format('MMM-YYYY'));

      if (results.params.geojson) {
        p.totalArea = geojsonUtilsHelper.getHectares(results.params.geojson);
      } else if (results.params.iso) {
        p.totalArea = this.status.get('isoTotalArea') ? this.status.get('isoTotalArea') : 0;
      }

      /**
       * Fires params
       *   - dateRange (get it from the results as string)
       */
      if (layer.slug === 'fires') {
        p.dateRange = _.isArray(results.period) ? results.period[0] : results.period;
      }

      /**
       * UMD Loss and gain params.
       *   - lossDateRange
       *   - lossAlerts
       *   - gainAlerts
       */
      if (layer.slug === 'loss' || layer.slug === 'forestgain') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year()-1);
        p.lossAlerts = 0;
        p.gainAlerts = 0;
        p.threshold  = results.params.thresh || 30;
        p.both = this.status.get('both');
        // The api returns all the loss and gain alerts.
        if (results.years) {
          p.gainAlerts = results.years[results.years.length-1].gain * 12;
          var years = _.range(dateRange[1].diff(dateRange[0], 'years'));
          _.each(years, function(i) {
            var year = _.findWhere(results.years, {year: dateRange[0].year() + i});
            if (!year) {return;}
            p.lossAlerts += year.loss;
          });
        }
        p.lossAlerts = (results.loss) ? this.roundNumber(results.loss) : this.roundNumber(p.lossAlerts);
        p.gainAlerts = (results.gain) ? this.roundNumber(results.gain) : this.roundNumber(p.gainAlerts);

      }

      /**
       * Imazon params
       *   - totalAlerts
       *   - degrad
       *   - defor
       *   - color
       */
      if (layer.slug !== 'imazon') {
        p.totalAlerts = (results.value) ? Math.round(results.value).toLocaleString() : 0;
      };

      if (layer.slug === 'imazon') {
        p.degrad = (results.value[0]) ? Math.round(results.value[0].value).toLocaleString() : 0;
        p.defor = (results.value[1]) ? Math.round(results.value[1].value).toLocaleString() : 0;
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

    roundNumber: function(value){
      return (value < 10) ? value.toFixed(2).toLocaleString() : Math.round(value).toLocaleString();
    },


    showCanopy: function(){
      mps.publish('ThresholdControls/toggle');
    },



  });

  return AnalysisResultsPresenter;

});
