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
        overlay: null,
        geojson: null,
        is_drawing: false,
        
        fit_to_geom: false,
        
        overlay_stroke_weight: 2        
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
        'Geostore/go': function(response, fit_to_geom) {
          this.status.set({
            geojson: response.data.attributes.geojson,
            fit_to_geom: !!fit_to_geom
          }, { silent: true });

          this.view.drawGeojson(response.data.attributes.geojson.features[0].geometry);
        }
      },{
        'Analysis/hideGeojson': function() {
          this.view.hideGeojson();
        }
      },{
        'Analysis/showGeojson': function() {
          this.view.showGeojson();
        }
      },{
        'Analysis/shape': function() {
          this.deleteAnalysis();
        }
      },{
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      }
    ],

    listeners: function() {
      this.status.on('change:is_drawing', this.changeIsDrawing.bind(this));
      this.status.on('change:geojson', this.changeGeojson.bind(this));
    },

    // DRAW
    changeIsDrawing: function() {
      this.view.changeIsDrawing();
      if(this.status.get('is_drawing')) {
        mps.publish('Analysis/start-drawing');
      } else  {
        mps.publish('Analysis/stop-drawing');
      }
    },


    // GEOJSON
    changeGeojson: function() {
      mps.publish('Analysis/store-geojson', [this.status.get('geojson')]);
    },


    /**
     * ACTIONS
     * - publishDeleteAnalysis
     * - deleteAnalysis
     * - getBaselayer
     * @return {void}
     */    
    publishDeleteAnalysis: function() {
      mps.publish('Analysis/delete');
    },

    deleteAnalysis: function() {
      this.status.set('is_drawing', false);
      this.view.deleteDrawing();
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },


  });

  return AnalysisDrawPresenter;

});
