define([
  'mps', 'backbone', 'map/presenters/PresenterClass'
], function(mps, Backbone, PresenterClass) {

  'use strict';


  var StatusModel = Backbone.Model.extend({});

  var GladLayerPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();

      this.status = new StatusModel();
      this.status.on('change:hideUnconfirmed', view.updateTiles.bind(view));
    },

    _subscriptions: [{
      'TorqueTimeline/date-change': function(layerName, date) {
        if (this.view.getName() === layerName) {
          this.view.setDate(date);
          this.view.stop();
        }
      },
      'Timeline/date-range-change': function(layerName, dates) {
        if (this.view.getName() === layerName) {
          this.view.setDateRange(dates);
          this.view.stop();
        }
      },
      'Timeline/toggle-playing': function() {
        this.view.toggle();
      },
      'Timeline/start-playing': function() {
        this.view.start();
      },
      'Timeline/stop-playing': function() {
        this.view.stop();
      },
      'LayerNav/changeLayerOptions': function(layerOptions) {
        this.setConfirmedStatus(layerOptions);
      }
    }],

    setConfirmedStatus: function(layerOptions) {
      layerOptions = layerOptions || [];
      var isHideUnconfirmed = layerOptions.indexOf('gladConfirmOnly') > -1;
      this.status.set('hideUnconfirmed', isHideUnconfirmed);
      if (isHideUnconfirmed) {
        ga('send', 'event', 'Map', 'Toggle', 'Confirmed GLAD | GLAD coverage');
      }
    },

    animationStarted: function(bounds) {
      mps.publish('Torque/started', [bounds]);
    },

    animationStopped: function() {
      mps.publish('Torque/stopped', []);
    },

    updateTimelineDate: function(change) {
      mps.publish('Torque/date-change', [change]);
    }

  });

  return GladLayerPresenter;

});
