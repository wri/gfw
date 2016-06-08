/**
 * The MapControlsPresenter class for the MapControlsPresenter view.
 *º
 * @return MapControlsPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var MapControlsPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Map/set-zoom': function(zoom) {
        this.view.setZoom(zoom);
      }
    },{
      'Map/fit-bounds': function(bounds) {
        this.view.saveBounds(bounds);
      }
    },{
      'AnalysisResults/delete-analysis': function() {
        this.view.saveBounds(null);
      }
    },{
      'AnalysisTool/stop-drawing': function() {
        this.view.model.set({
          hidden: false
        });
      }
    },{
      'AnalysisTool/start-drawing': function() {
        this.view.model.set({
          hidden: true
        });
      }
    },{
      'Timeline/toggle' : function(boolean){
        this.view.toogleTimeline(boolean);
      }
    }, {
      'Layers/toggle': function(toggle) {
        this.view.toogleTimeline(false);
      }
    }, {
      'Analysis/toggle': function() {
        this.view.toogleTimeline(false);
      }
    }, {
      'LayerNav/change': function() {
        this.view.removeToogleActive();
      }
    }],

    // *
    //  * Used by ToggleWidgets view to handle a fitbounds.
    //  *
    //  * @return {object} Map bounds

    // fitBounds: function(bounds) {
    //   mps.publish('Map/fit-bounds', [bounds]);
    // },

    // setCenter: function(lat, lng) {
    //   mps.publish('Map/set-center', [lat, lng]);
    // }

    /**
     * Used by MapView to delegate zoom change UI events. Results in the
     * Map/zoom-change event getting published with the new zoom.
     *
     * @param  {integer} zoom the new map zoom
     */
    onZoomChange: function(zoom) {
      mps.publish('Map/zoom-change', [zoom]);
      mps.publish('Place/update', [{go: false}]);
    },

    onAutolocate: function(){
      mps.publish('Map/autolocate');
    },

    toggleModules: function(hide) {
      mps.publish('MapControlsToggleModules/toggle',[{ hide: hide }]);
    },

    /**
     * Used by searchbox view to handle a fitbounds.
     *
     * @return {object} Map bounds
     */
    showSearch: function() {
      mps.publish('MapControlsSearch/show');      
    },

    fitBounds: function(bounds) {
      mps.publish('Map/fit-bounds', [bounds]);
    },
    

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

    openLegend: function() {
      mps.publish('LegendMobile/open');
      this.view.toogleTimeline(false);
    },

  });

  return MapControlsPresenter;
});
