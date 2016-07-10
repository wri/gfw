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

  var AnalysisResultsPresenter = PresenterClass.extend({
    
    status: new (Backbone.Model.extend()),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [
      {
        'Place/go': function(place) {
          var params = place.params;
          this.status.set('baselayers_full', place.layerSpec.getBaselayers(), {silent: true});
        }
      },
      {
        'LayerNav/change': function(layerSpec) {  
          this.status.set('baselayers_full', layerSpec.getBaselayers(), {silent: true});
        }
      },          
      {
        'Geostore/go': function(response) {
          this.status.set('geojson', response.data.attributes.geojson, {silent: true});
        }
      },
      {
        'Analysis/store-geojson': function(geojson) {
          this.status.set('geojson', geojson, {silent: true});
        }
      },    
      {
        'Analysis/results': function(status) {
          this.status.set(status, { silent: true });
          this.status.set('resource', this.setAnalysisResource());
          
          this.view.render();
        }
      }, {
        'Analysis/results-error': function(status) {
          this.status.set(status, { silent: true });
          
          this.view.renderError();
        }
      }
    ],


    /**
     * Get analysis resource params which are going to be
     * pass to the html to render the analysis results.
     *
     * @param  {Object} results Results object form the AnalysisService
     * @param  {Object} layer   The layer object
     * @return {Object}         Returns resource params
     */

    setAnalysisResource: function(status) {
      // We have to improve this function
      // console.log('*********  STATUS  *********');
      // console.log(this.status.toJSON());
      var p = {};
      /**
       * Define variable that we are going to use later
       */
      var type = this.status.get('type'),
          results = this.status.get('results'),
          dateRange = [moment(this.status.get('begin')),moment(this.status.get('end'))];

      // Layers
      p.slug = this.status.get('baselayer')[0];
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
      
      p.options.download = (!!results.download_urls) ? _.extend({}, results.download_urls, {
        cdb: (p.download.kml) ? encodeURIComponent(p.download.kml + '&filename=GFW_Analysis_Results') : null
      }) : null;
      
      // Dates
      p.dates = {};
      p.dates.dateRange = '{0} to {1}'.format(dateRange[0].format('MMM-YYYY'),dateRange[1].format('MMM-YYYY'));

      /**
       * Exceptions
       */
      if (p.slug === 'umd-loss-gain') {
        var results = (type == 'country') ? results.total : results;
        p.areaHa = this.roundNumber(results.areaHa || 0);

        p.alerts.totalAlerts = this.roundNumber(results.loss || 0);
        p.alerts.gainAlerts = this.roundNumber(results.gain || 0);
        p.alerts.treeExtent = this.roundNumber(results.treeExtent || 0);

        // Dates
        p.dates.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year()-1);
      }
      
      if (p.slug === 'imazon-alerts') {
        p.alerts.degradAlerts = (results.value[0]) ? Math.round(results.value[0].value).toLocaleString() : 0;
        p.alerts.deforAlerts = (results.value[1]) ? Math.round(results.value[1].value).toLocaleString() : 0;
      }

      if (p.slug === 'prodes-loss') {
        p.dates.dateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year()-1);
      }

      // console.log('*********  RESOURCE  *********');
      // console.log(p);
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

    publishShowCanopy: function(){
      mps.publish('ThresholdControls/show');
    },

    publishNotification: function(id){
      mps.publish('Notification/open', [id]);
    },


    /**
     * HELPER
     * - roundNumber
     */
    roundNumber: function(value){
      return (value < 10) ? value.toFixed(2).toLocaleString() : Math.round(value).toLocaleString();
    },
    

  });

  return AnalysisResultsPresenter;

});
