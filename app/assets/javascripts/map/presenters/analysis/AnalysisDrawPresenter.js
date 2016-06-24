/**
 * The AnalysisDrawPresenter class for the AnalysisToolView.
 *
 * @return AnalysisDrawPresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore', 
  'backbone', 
  'mps', 
  'topojson', 
  'bluebird', 
  'moment',
  'helpers/geojsonUtilsHelper',

], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment, geojsonUtilsHelper) {

  'use strict';

  var AnalysisDrawPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        is_drawing: false
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

    // DRAW
    startDrawing: function() {
      this.status.set('is_drawing', true);
      mps.publish('Analysis/start-drawing');
    },

    stopDrawing: function() {
      this.status.set('is_drawing', false);
      mps.publish('Analysis/stop-drawing');
    },

    storeGeojson: function(geojson) {
      mps.publish('Analysis/store-geojson', [geojson]);
    },

    // GLOBAL
    deleteAnalysis: function() {
      mps.publish('Analysis/delete');
    }



  });

  return AnalysisDrawPresenter;

});
