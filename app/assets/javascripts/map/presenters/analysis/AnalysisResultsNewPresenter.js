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

      
      p.slug = this.status.get('baselayer')[0];
      p.baselayers = this.status.get('baselayers_full');
      
      // Alerts
      p.alerts = {};
      p.alerts.totalAlerts = this.roundNumber(this.status.get('results').value);

      if (p.slug === 'umd-loss-gain') {
        p.alerts.totalAlerts = this.roundNumber(this.status.get('results').value || this.status.get('results').loss);
        p.alerts.gainAlerts = this.roundNumber(this.status.get('results').gain || 0);
        p.alerts.treeExtent = this.roundNumber(this.status.get('results').treeExtent || 0);
      }
      
      if (p.slug === 'imazon-alerts') {
        p.alerts.degradAlerts = (this.status.get('results').value[0]) ? Math.round(this.status.get('results').value[0].value).toLocaleString() : 0;
        p.alerts.deforAlerts = (this.status.get('results').value[1]) ? Math.round(this.status.get('results').value[1].value).toLocaleString() : 0;
      }

      // Options
      p.options = {};
      p.options.threshold = this.status.get('threshold');
      
      
      p.options.download = (!!this.status.get('results').download_urls) ? _.extend({}, this.status.get('results').download_urls, {
        cdb: (p.download.kml) ? encodeURIComponent(p.download.kml + '&filename=GFW_Analysis_Results') : null
      }) : null;
      
      // Dates
      var dateRange = [moment(this.status.get('begin')),moment(this.status.get('end'))];
      p.dates = {};
      p.dates.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year()-1);
      p.dates.dateRange = '{0} to {1}'.format(dateRange[0].format('MMM-YYYY'),dateRange[1].format('MMM-YYYY'));


      // Total Area
      switch(this.status.get('type')) {
        case 'draw':
          // Depending on the 
          p.totalArea = geojsonUtilsHelper.getHectares((!!this.status.get('geojson').features) ? this.status.get('geojson').features[0].geometry : this.status.get('geojson'));
        break;
      }
      
      // console.log('*********  RESOURCE  *********');
      // console.log(p);
      return p;
      
    },

    _getAnalysisResource: function(results, layer) {
      var p = {};

      p.slug = layer.slug;
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

      if (layer.slug === 'prodes') {
        p.dateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year()-1);
      }

      /**
       * UMD Loss and gain params.
       *   - lossDateRange
       *   - lossAlerts
       *   - gainAlerts
       *   - extent
       */
      if (layer.slug === 'loss' || layer.slug === 'forestgain' || layer.slug === 'forestgain' || layer.slug === 'forest2000') {
        p.lossDateRange = '{0}-{1}'.format(dateRange[0].year(), dateRange[1].year()-1);
        p.extent = p.gainAlerts = p.lossAlerts = 0;
        p.threshold  = results.params.thresh || 30;
        p.both = this.status.get('both');
        // The api returns all the loss and gain alerts.
        if (results.years) {
          p.gainAlerts = results.years[0].total_gain;
          p.extent = results.years[results.years.length-1].extent;
          var years = _.range(dateRange[1].diff(dateRange[0], 'years'));
          _.each(years, function(i) {
            var year = _.findWhere(results.years, {year: dateRange[0].year() + i});
            if (!year) {return;}
            p.lossAlerts += year.loss;
          });
        }
        p.lossAlerts = (results.loss) ? this.roundNumber(results.loss) : this.roundNumber(p.lossAlerts);
        p.gainAlerts = (results.gain) ? this.roundNumber(results.gain) : this.roundNumber(p.gainAlerts);
        p.extent     = (results["tree-extent"]) ? this.roundNumber(results["tree-extent"]) : this.roundNumber(p.extent);

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
