/**
 * The UMD loass layer presenter.
 *
 * @return UMDLossLayerPresenter class
 */
define([
  'presenters/PresenterClass',
  'underscore',
  'mps'
], function(PresenterClass, _, mps) {

  'use strict';

  var UMDLossLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this._super();
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      this._subs.push(
        mps.subscribe('Timeline/date-change', _.bind(function(layerSlug, date) {
          if (this.view.getName() === layerSlug) {
            this.view.setTimelineDate(date);
            this.view.updateTiles();
          }
        }, this)));
    }

  });

  return UMDLossLayerPresenter;

});
