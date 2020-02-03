/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'jquery', 'underscore', 'backbone', 'moment', 'd3', 'handlebars',
  'abstract/timeline/TorqueTimelineSlider', 'abstract/timeline/TorqueTimelineDatePicker',
  'map/presenters/TorqueTimelinePresenter',
  'text!templates/timelineTorque.handlebars',
  'text!templates/timelineTorque-controls.handlebars',
  'text!templates/timelineTorque-date.handlebars'
], function(
  $, _, Backbone, moment, d3, Handlebars,
  TorqueTimelineSlider, TorqueTimelineDatePicker,
  Presenter,
  tpl, controlsTpl, dateTpl) {

  'use strict';

  var TimelineStatus = Backbone.Model.extend({
    defaults: {
      currentDate: null,
      running: false
    },

    toggleRunning: function() {
      var running = this.get('running');
      this.set('running', !running);
    }
  });

  var TorqueTimelineClass = Backbone.View.extend({

    className: 'timeline-torque timeline-year',

    template: Handlebars.compile(tpl),
    controlsTemplate: Handlebars.compile(controlsTpl),
    dateTemplate: Handlebars.compile(dateTpl),

    DatePicker: TorqueTimelineDatePicker,

    events: {
      'click .play': '_toggleState',
    },

    initialize: function(layer, currentDate) {
      this.layer = layer;
      this.currentDate = _.compact(currentDate).map(
        function(c) { return moment.utc(c); });

      this.status = new TimelineStatus();

      this.presenter = new Presenter(this);
    },

    render: function() {
      if (this.bounds === undefined) { return; }

      this.$el.html(this.template());

      $('.timeline-container').html(this.el);

      this.renderControls();
      this.renderDate();
      this.renderDatePicker();
      this.renderSlider();

      this.delegateEvents();

      return this;
    },

    renderSlider: function() {
      this.slider = new TorqueTimelineSlider({
        startingDate: this.getCurrentTimelineDate().toDate(),
        extent: [moment.utc(this.bounds.start).toDate(),
          moment.utc(this.bounds.end).toDate()],
        el: this.$('.timeline-slider svg')[0],
        width: 250,
        height: 50,
        callback: this.setTorqueDate.bind(this)
      });
    },

    renderControls: function() {
      this.$('.play').html(this.controlsTemplate({
        isRunning: this.status.get('running')
      }));
    },

    renderDate: function() {
      var date = this.status.get('currentDate');
      if (!date) { return; }

      var day = date.format('D'),
          month = date.format('MMM'),
          year = date.format('YYYY');

      this.$('.timeline-date').html(this.dateTemplate({
        day: day,
        month: month,
        year: year
      }));
    },

    renderDatePicker: function() {
      var onChange = function(dateRange) {
        this.slider.reScale(dateRange);
        this.currentDate = dateRange;
      };

      var datePicker = new this.DatePicker({
        layer: this.layer,
        presenter: this.presenter,
        dateRange: this.bounds,
        onChange: onChange.bind(this),
        dataService: this.dataService || null
      });

      if (this.datePicker) {
        this.datePicker.remove();
      }

      this.$el.prepend(datePicker.render().el);
      this.datePicker = datePicker;
      this.setSliderDates();
    },

    _onTorqueStop: function() {
      this.status.set('running', false);

      this.renderControls();
    },

    _toggleState: function(event) {
      this.presenter.togglePlaying();

      var $el = $(event.currentTarget).find('div');
      if ($el.hasClass('play-icon')) {
        this.status.set('running', true);
      } else {
        this.status.set('running', false);
      }

      this.renderControls();
    },

    setBounds: function(bounds) {
      this.bounds = bounds;
    },

    setTorqueDate: function(date) {
      this.presenter.setTorqueDate(date);
    },

    setCurrentDate: function(change) {
      this.status.set('currentDate', moment.utc(change.time));
      this.status.set('currentStep', change);

      this.renderDate();

      if (this.slider !== undefined) {
        this.slider.setDate(change.time);
      }
    },

    getCurrentTimelineDate: function() {
      return this.status.get('currentDate') || moment.utc(this.layer.mindate);
    },

    /*
     * Despite what the name implies, this actually returns a date
     * *range*, for use in Place params.
     */
    getCurrentDate: function() {
      if (this.currentDate !== undefined && this.currentDate.length > 0) {
        return this.currentDate;
      } else {
        return [
          moment.utc(this.layer.mindate),
          moment.utc(this.layer.maxdate || undefined)
        ];
      }
    },

    getName: function() {
      return this.layer.slug;
    },

    /*
     * Updates the current date in the slider
     */
    setSliderDates: function() {
      if (this.currentDate.length) {
        var currentDate = this.getCurrentDate();

        this.setCurrentDate({
          time: currentDate[1]
        });
      }
    }

  });

  return TorqueTimelineClass;

});
