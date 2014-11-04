/**
 * The MaptypePresenter class for the MaptypePresenter view.
 *
 * @return MaptypePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var MaptypePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Map/maptype-change': function(maptype) {
        this.view.selectMaptype(maptype);
      }
    }, {
      'AnalysisTool/stop-drawing': function() {
        this.view.model.set('hidden', false);
      }
    }, {
      'AnalysisTool/start-drawing': function() {
        this.view.model.set('hidden', true);
      }
    }],

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
    },

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    }
  });

  return MaptypePresenter;
});
