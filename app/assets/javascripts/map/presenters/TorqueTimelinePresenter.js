/**
 * The Torque Timeline view presenter.
 *
 * @return TorqueTimelinePresenter class
 */
define([
  'underscore', 'mps', 'backbone',
  'map/presenters/PresenterClass',
  'map/helpers/layersHelper'
], function(_, mps, Backbone, PresenterClass, layersHelper) {

  'use strict';

  var TorqueTimelinePresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    _subscriptions: [{
      'Torque/date-change': function(change) {
      }
    }],

  });

  return TorqueTimelinePresenter;

});
