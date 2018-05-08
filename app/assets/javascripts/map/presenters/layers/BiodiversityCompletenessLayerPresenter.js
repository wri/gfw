/**
 * The UMD loass layer presenter.
 *
 * @return UMDLossLayerPresenter class
 */

/* eslint-disable */

define(
  ['underscore', 'mps', 'map/presenters/PresenterClass'],
  function(_, mps, PresenterClass) {
    var BiodiversityCompletenessLayerPresenter = PresenterClass.extend({
      init: function(view) {
        this.view = view;
        this._super();
      },

      /**
       * Application subscriptions.
       */
      _subscriptions: [],

      updateLayer: function() {
        mps.publish('Layer/update', [this.view.getName()]);
      }
    });

    return BiodiversityCompletenessLayerPresenter;
  }
);