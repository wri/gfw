/**
 * The AnalysisButtonPresenter class for the AnalysisButtonView.
 *
 * @return AnalysisButtonPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var AnalysisButtonPresenter = Class.extend({

    /**
     * Constructs new AnalysisButtonPresenter.
     *
     * @param  {AnalysisButtonView} view Instance of AnalysisButtonView
     *
     * @return {class} The AnalysisButtonPresenter class
     */
    init: function(view) {
      this.view = view;
      this.layerSpec =  false;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.layerSpec = layerSpec;
      },this));
      mps.subscribe('Place/go', _.bind(function(place) {
        this.layerSpec = place.params.layerSpec;
      }, this));
      mps.subscribe('AnalysisButton/setEnabled', _.bind(function(enabled) {
        this.view.setEnabled(enabled);
      }, this));
      mps.subscribe('AnalysisButton/_deleteAnalysis', _.bind(function() {
        this.view.deleteSelectedShape();
      }, this));
    },

    /**
     * Handles an onClick UI event from the view by publishing a new
     * 'AnalysisButton/clicked'.
     */
    onClick: function() {
        mps.publish('AnalysisButton/clicked', _.bind(function() {
      }, this));
        this.view.showHelperBar();
    },

    /**
    * Asks the API for the analysis results given for a selected area
    */
    requestAnalysis: function(the_geom) {
      if (this.layerSpec) {
        var baselayer = _.pluck(this.layerSpec.getBaselayers(), 'slug')[0];
        var dataset = null;
        if (baselayer) {
          switch (baselayer){
            case 'umd_tree_loss_gain':
              dataset = 'umd-loss-gain';
            break

            case 'forma':
              dataset = 'forma-alerts';
            break

            case 'imazon':
              dataset = 'imazon-alerts';
            break

            case 'fires':
              dataset = 'nasa-active-fires';
            break

            case 'modis':
              dataset = 'quicc-alerts';
            break
          }
        
        mps.publish('AnalysisService/get', [{dataset: dataset, geojson: the_geom}]);
        }
      } else {
        mps.publish('AnalysisService/get', [{dataset: 'umd-loss-gain', geojson: the_geom}]);
      }
    }
  });

  return AnalysisButtonPresenter;

});
