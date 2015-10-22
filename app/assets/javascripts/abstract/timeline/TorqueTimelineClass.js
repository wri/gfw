/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'underscore', 'backbone', 'moment', 'd3', 'handlebars',
  'text!templates/timelineTorque.handlebars',
  'map/presenters/TorqueTimelinePresenter'
], function(_, Backbone, moment, d3, Handlebars, tpl, Presenter) {

  'use strict';

  var TimelineStatus = Backbone.Model.extend({
    defaults: {
      currentDate: null,
      running: true
    },

    toggleRunning: function() {
      var running = this.get('running');
      this.set('running', !running);
    },

    formattedDate: function() {
      var date = this.get('currentDate');
      if (date) { return date.format("D MMM YYYY"); }
    }
  });

  var TorqueTimelineClass = Backbone.View.extend({

    className: 'timeline-torque timeline-year',

    template: Handlebars.compile(tpl),

    events: {
      'click .play': '_toggleState',
    },

    initialize: function(layer, currentDate) {
      this.layer = layer;

      this.status = new TimelineStatus();

      this.presenter = new Presenter(this);
    },

    render: function() {
      if (this.bounds === undefined) { return; }

      this.$el.html(this.template({
        isRunning: this.status.get('running'),
        currentDate: this.status.formattedDate()
      }));

      $('.timeline-container').html(this.el);
      this.delegateEvents();

      return this;
    },

    renderDate: function() {
      this.$('.timeline-date').html(this.status.formattedDate());
    },

    _toggleState: function() {
      this.presenter.togglePlaying();

      this.status.toggleRunning();
      this.render();
    },

    setBounds: function(bounds) {
      this.bounds = bounds;
    },

    setCurrentDate: function(change) {
      this.status.set('currentDate', moment(change.time));
      this.status.set('currentStep', change);

      this.renderDate();
    },

    getCurrentDate: function() {
      var currentDate = this.status.get('currentDate');
      if (!currentDate) {
        currentDate = moment(this.layer.mindate);
      }

      return currentDate;
    }

  });

  return TorqueTimelineClass;

});
