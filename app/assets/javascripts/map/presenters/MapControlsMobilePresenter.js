/**
 * The MapControlsMobilePresenter class for the MapControlsMobilePresenter view.
 *º
 * @return MapControlsMobilePresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var MapControlsMobilePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [],

    /**
     * Used by mobile version to open legend and analysis
     *
     */
    openLegend: function(bounds) {
      mps.publish('Legend/open');
    },

  });

  return MapControlsMobilePresenter;
});
