/**
 * The Torque Layer view presenter.
 *
 * @return TorqueLayerPresenter class
 */
define([
  'underscore', 'mps', 'backbone',
  'map/presenters/PresenterClass'
], function(_, mps, Backbone, PresenterClass, layersHelper) {

  'use strict';

  var TorqueLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    _subscriptions: [{
      'Timeline/date-change': function(change) {
      }
    }],

    updateTimelineDate: function(change) {
      mps.publish('Torque/date-change', [change]);
    }

  });

  return TorqueLayerPresenter;

});
