/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'underscore', 'backbone', 'moment', 'd3', 'handlebars',
  'abstract/timeline/TorqueTimelineSlider',
  'map/presenters/TorqueTimelinePresenter',
  'text!templates/timelineTorque.handlebars',
  'text!templates/timelineTorque-controls.handlebars'
], function(
  _, Backbone, moment, d3, Handlebars,
  TorqueTimelineSlider,
  Presenter,
  tpl, controlsTpl) {

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
    controlsTemplate: Handlebars.compile(controlsTpl),

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

      this.$el.html(this.template());

      $('.timeline-container').html(this.el);

      this.renderControls();
      this.renderDate();
      this.renderSlider();

      this.delegateEvents();

      return this;
    },

    renderSlider: function() {
      if (this.slider === undefined) {
        this.slider = new TorqueTimelineSlider({
          startingDate: this.getCurrentDate().toDate(),
          extent: [moment(this.bounds.start).toDate(),
            moment(this.bounds.end).toDate()],
          el: this.$('.timeline-slider svg')[0],
          width: 350,
          height: 50,
          callback: this.setTorqueDate.bind(this)
        });
      }
    },

    renderControls: function() {
      this.$('.play').html(this.controlsTemplate({
        isRunning: this.status.get('running')
      }));
    },

    renderDate: function() {
      this.$('.timeline-date').html(this.status.formattedDate());
    },

    _toggleState: function() {
      this.presenter.togglePlaying();

      this.status.toggleRunning();
      this.renderControls();
    },

    setBounds: function(bounds) {
      this.bounds = bounds;
    },

    setTorqueDate: function(date) {
      this.presenter.setTorqueDate(date);
    },

    setCurrentDate: function(change) {
      this.status.set('currentDate', moment(change.time));
      this.status.set('currentStep', change);

      this.renderDate();

      if (this.slider !== undefined) {
        this.slider.setDate(change.time);
      }
    },

    getCurrentDate: function() {
      var currentDate = this.status.get('currentDate');
      if (!currentDate) {
        currentDate = moment(this.layer.mindate);
      }

      return currentDate;
    },

    getName: function() {
      return this.layer.slug;
    },

  });

  return TorqueTimelineClass;

});
