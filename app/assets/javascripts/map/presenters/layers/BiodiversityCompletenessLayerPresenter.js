/**
 * The UMD loass layer presenter.
 *
 * @return UMDLossLayerPresenter class
 */

/* eslint-disable */

define(
  ['underscore', 'mps', 'map/presenters/PresenterClass'],
  (_, mps, PresenterClass) => {
    const BiodiversityCompletenessLayerPresenter = PresenterClass.extend({
      init(view) {
        this.view = view;
        this._super();
      },

      /**
       * Application subscriptions.
       */
      _subscriptions: [],

      updateLayer() {
        mps.publish('Layer/update', [this.view.getName()]);
      }
    });

    return BiodiversityCompletenessLayerPresenter;
  }
);
