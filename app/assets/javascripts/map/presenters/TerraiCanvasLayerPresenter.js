/**
 * The UMD loass layer presenter.
 *
 * @return UMDLossLayerPresenter class
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var TerraiCanvasLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    // _subscriptions: [{
    //   'Threshold/changed': function(threshold) {
    //     this.view.setThreshold(threshold);
    //   }
    // }],

    updateLayer: function() {
      mps.publish('Layer/update', [this.view.getName()]);
    }

  });

  return TerraiCanvasLayerPresenter;
});
