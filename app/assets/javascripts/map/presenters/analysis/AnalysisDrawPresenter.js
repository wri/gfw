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
  'bluebird', 
  'moment',

], function(PresenterClass, _, Backbone, mps, Promise, moment) {

  'use strict';

  var AnalysisDrawPresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        is_drawing: false,
        geostore: null
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [
      {
        'Geostore/go': function(response) {
          this.view.drawGeojson(response.data.attributes.geojson);
        }
      },{
        'Analysis/delete': function() {
          this.view.deleteDrawing();
        }
      }
    ],

    // DRAW
    startDrawing: function() {
      this.status.set('is_drawing', true);
      mps.publish('Analysis/start-drawing');
    },

    stopDrawing: function() {
      this.status.set('is_drawing', false);
      mps.publish('Analysis/stop-drawing');
    },

    // GEOJSON
    storeGeojson: function(geojson) {
      mps.publish('Analysis/store-geojson', [geojson]);
    },

    drawGeojson: function(geojson) {
      
    },

    // GLOBAL
    deleteAnalysis: function() {
      mps.publish('Analysis/delete');
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },


  });

  return AnalysisDrawPresenter;

});
