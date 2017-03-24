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
  'map/services/ShapeService',
  'helpers/geojsonUtilsHelper',

], function(PresenterClass, _, Backbone, mps, topojson, Promise, moment, ShapeService, geojsonUtilsHelper) {

  'use strict';

  var AnalysisShapePresenter = PresenterClass.extend({
    status: new (Backbone.Model.extend({
      defaults: {
        is_playing: false,
        wdpaid: null,
        use: null,
        useid: null,

        overlay_stroke_weight: 2
      }
    })),

    init: function(view) {
      this.view = view;
      this._super();
      this.listeners();
    },

    listeners: function() {
      this.status.on('change:is_playing', this.changeIsPlaying.bind(this));

      this.status.on('change:use', this.changeUse.bind(this));
      this.status.on('change:useid', this.changeUse.bind(this));
      this.status.on('change:wdpaid', this.changeWdpaid.bind(this));
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [
      // GLOBAL EVENTS
      {
        'Place/go': function(place) {
          var params = place.params;
          this.status.set({
            // Shapes
            wdpaid: params.wdpaid,
            // Replace gfw_ from the use.
            // We should have a pair compare array intead of using a replace...
            use: params.use,
            useid: params.useid,
          });
        }
      },{
        'Analysis/shape': function(data) {
          this.status.set({
            useid: data.useid,
            use: data.use,
            wdpaid: data.wdpaid,
          })
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
        'Analysis/delete': function() {
          this.deleteAnalysis();
        }
      }
    ],

    /**
     * LISTENERS
     */
    changeUse: function() {
      if (!!this.status.get('use') && !!this.status.get('useid')) {
        // Get geometry from the shape
        ShapeService.get(this.status.get('use'), this.status.get('useid'))
          .then(function(geojson, status){
            var geojson = geojson,
                bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);

            // Get bounds and fit to them
            if (!!bounds) {
              mps.publish('Map/fit-bounds', [bounds]);
            }

            // Draw geojson of shape
            if (!!geojson) {
              this.view.drawGeojson(geojson);
            }
          }.bind(this))

          .catch(function(error){
            console.log(arguments);
          }.bind(this))
      }
    },

    changeWdpaid: function() {
      if (!!this.status.get('wdpaid')) {
        // Get geometry from the shape
        ShapeService.get('protected_areas', this.status.get('wdpaid'))
          .then(function(geojson, status){
            var geojson = geojson,
                bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);

            // Get bounds and fit to them
            if (!!bounds) {
              mps.publish('Map/fit-bounds', [bounds]);
            }

            // Draw geojson of shape
            if (!!geojson) {
              this.view.drawGeojson(geojson);
            }
          }.bind(this))

          .catch(function(error){
            console.log(arguments);
          }.bind(this))
      }
    },

    changeIsPlaying: function() {
      this.view.togglePlay();
    },

    /**
     * ACTIONS
     * - deleteAnalysis
     * - notificate
     */
    publishNotification: function(id){
      mps.publish('Notification/open', [id]);
    },

    deleteAnalysis: function() {
      this.status.set({
        wdpaid: null,
        use: null,
        useid: null,
      });

      this.view.deleteGeojson();
    }


  });

  return AnalysisShapePresenter;

});
