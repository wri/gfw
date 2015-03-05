/**
 * The BasemapsPresenter class for the BasemapsPresenter view.
 *
 * @return BasemapsPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
], function(_, mps, PresenterClass) {

  'use strict';

  var BasemapsPresenter = PresenterClass.extend({

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
    }],

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    }
  });

  return BasemapsPresenter;
});
