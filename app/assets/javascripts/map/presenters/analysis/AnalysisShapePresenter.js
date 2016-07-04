/**
 * The AnalysisShapePresenter class for the AnalysisToolView.
 *
 * @return AnalysisShapePresenter class.
 */
define([
  'map/presenters/PresenterClass',
  'underscore', 
  'backbone', 
  'mps', 
  'topojson', 
  'bluebird', 
  'moment',

], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment) {

  'use strict';

  var AnalysisShapePresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        is_playing: false        
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
      this.status.on('change:is_playing', this.changeIsPlaying.bind(this));
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [
      // GLOBAL EVENTS
      {
        'Place/go': function(place) {

        }
      }      
    ],

    /**
     * LISTENERS
     */
    changeIsPlaying: function() {
      this.view.togglePlay();
    },

    /**
     * ACTIONS
     * - deleteAnalysis
     * - notificate
     */
    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },


  });

  return AnalysisShapePresenter;

});
