/**º
 * The MaptypePresenter class for the MaptypePresenter view.
 *º
 * @return MaptypePresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var MaptypePresenter = Class.extend({

    /**
     * Initialize MaptypePresenter.
     *
     * @param  {object} Instance of MaptypePresenter view
     */
    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Maptype/change', _.bind(function(maptype) {
        this.view.selectMaptype(maptype);
      }, this));
    },

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    }
  });

  return MaptypePresenter;
});
