/**
 * The Timeline view module.
 *
 * Timeline for all layers configured by setting layer-specific options.
 *
 * @return Timeline view (extends Backbone.View).
 */
define([
  'underscore',
  'backbone',
  'moment',
  'text!templates/monthlyPickerTorque.handlebars'
], function(
  _,
  Backbone,
  moment,
  tpl
) {

  'use strict';

  var SelectedDates = Backbone.Model.extend({
    getRange: function() {
      return [this.get('startDate'), this.get('endDate')];
    },

    setDate: function(id, date) {
      var otherDate;
      if (id === 'startDate') {
        otherDate = this.get('endDate');
        if (date.isAfter(otherDate)) { return; }
      } else if (id === 'endDate') {
        otherDate = this.get('startDate');
        if (date.isBefore(otherDate)) { return; }
      }

      if (date.toDate().getHours() !== 0) {
        var tzOffset = date.toDate().getTimezoneOffset();
        if (tzOffset > 0) { date = date.add(tzOffset, 'minutes'); }
      }
      this.set(id, date);
    }
  });

  var TimelineMonthlyPicker = Backbone.View.extend({

    className: 'timeline-torque-monthly-picker',

    template: Handlebars.compile(tpl),

    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
    'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],

    defaults: {

    },

    initialize: function(options) {
      options = options || {};
      this.presenter = options.presenter;
      this.dataService = options.dataService;
      this.layer = options.layer;
      this.onChange = options.onChange;

      this.selectedDates = new SelectedDates();
      this.selectedDates.setDate('startDate',
        moment.utc(options.dateRange.start));
      this.selectedDates.setDate('endDate',
        moment.utc(options.dateRange.end));
      this.listenTo(this.selectedDates, 'change', this.updateTorque);
    },

    render: function() {
      this.$el.html(this.template({
        title: this.layer.title,
        startDate: this.selectedDates.get('startDate'),
        endDate: this.selectedDates.get('endDate')
      }));

      return this;
    }

  });
  return TimelineMonthlyPicker;

});
