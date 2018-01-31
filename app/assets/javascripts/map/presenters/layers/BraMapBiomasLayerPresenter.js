/* eslint-disable */
define(['underscore', 'mps', 'map/presenters/PresenterClass'], function(
  _,
  mps,
  PresenterClass
) {
  'use strict';

  var BraMapBiomasLayerPresenter = PresenterClass.extend({
    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [
      {
        'Year/update': function(year) {
          this.view.setYear(year);
        }
      }
    ],

    updateLayer: function() {
      mps.publish('Layer/update', [this.view.getName()]);
    }
  });

  return BraMapBiomasLayerPresenter;
});
