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
        this.view.setCurrentDate(change);
      },

      'Torque/date-range-change': function(date) {
        this.view.currentDate = date;
        this.view.setBounds({
          start: date[0],
          end: date[1]
        });
        this.view.renderDatePicker();
      },

      'Torque/started': function(bounds) {
        if (this.view.bounds !== undefined) {
          this.view.status.set('running', true);
        } else {          
          this.view.setBounds(bounds);
          this.view.render();
        }
      },

      'Torque/stopped': function() {
        this.view._onTorqueStop();
      }
    }],

    setTorqueDateRange: function(dates) {
      mps.publish('Timeline/date-range-change', [this.view.getName(), dates]);
      mps.publish('Timeline/date-change', [this.view.getName(), dates]);
      mps.publish('Place/update', [{go: false}]);
    },

    setTorqueDate: function(date) {
      mps.publish('TorqueTimeline/date-change', [this.view.getName(), date]);
    },

    togglePlaying: function() {
      mps.publish('Timeline/toggle-playing', []);
    },

    startPlaying: function() {
      mps.publish('Timeline/start-playing', []);
    },

    stopPlaying: function() {
      mps.publish('Timeline/stop-playing', []);
    }

  });

  return TorqueTimelinePresenter;

});
