/**º
 * The SearchboxPresenter class for the SearchboxPresenter view.
 *º
 * @return SearchboxPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SearchboxPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'MapControlsSearch/show': function() {
        this.view.model.toggleVisibility();
      }
    }],

    /**
     * Used by searchbox view to handle a fitbounds.
     *
     * @return {object} Map bounds
     */
    fitBounds: function(bounds) {
      mps.publish('Map/fit-bounds', [bounds]);
    },

    setCenter: function(lat, lng) {
      mps.publish('Map/set-center', [lat, lng]);
      mps.publish('Map/set-zoom', [12]);
    }
    
  });

  return SearchboxPresenter;
});
