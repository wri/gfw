/**
 * The Timeline view presenter.
 *
 * @return TimelinePresenter class
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  'use strict';

  var TimelinePresenter = Class.extend({

    init: function(view) {
      this.view = view;
      this._subscribe();
    },

    /**
     * Subscribe to application events.
     */
    _subscribe: function() {
      mps.subscribe('Place/go', _.bind(function(place) {
        this.view.setTimeline(place.params.layerSpec.getBaselayers(),
          place.params.date);
      }, this));

      mps.subscribe('LayerNav/change', _.bind(function(layerSpec) {
        this.view.setTimeline(layerSpec.getBaselayers());
      }, this));

      mps.publish('Place/register', [this]);
    },

    /**
     * Retuns place parameters representing the state of the LayerNavView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the LayerNavView and layers
     */
    getPlaceParams: function() {
      var date =  this.view.getCurrentDate();
      var p = {};
      p.name = 'map';

      if (date) {
        p.date = '{0}{1}'.format(this.view.getCurrentDate()[0].format('X'),
          this.view.getCurrentDate()[1].format('X'));
      }

      return p;
    }

  });

  return TimelinePresenter;

});
