/**º
 * The SearchboxPresenter class for the SearchboxPresenter view.
 *º
 * @return SearchboxPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var SearchboxPresenter = Class.extend({

    /**
     * Initialize SearchboxPresenter.
     *
     * @param  {object} Instance of SearchboxPresenter view
     */
    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('AnalysisTool/stop-drawing', _.bind(function() {
        this.view.model.set('hidden', false);
      }, this));

      mps.subscribe('AnalysisTool/start-drawing', _.bind(function() {
        this.view.model.set('hidden', true);
      }, this));
    },

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
    }
  });

  return SearchboxPresenter;
});
