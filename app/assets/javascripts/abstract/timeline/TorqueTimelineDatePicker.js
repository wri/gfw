/**
 * The Timeline date picker view module.
 *
 * @return TorqueTimelineDatePicker view (extends Backbone.View).
 */
define([
  'underscore', 'backbone', 'moment', 'handlebars', 'picker', 'pickadate',
  'map/presenters/TorqueTimelinePresenter',
  'map/services/TorqueDateService',
  'text!templates/datePickerTorque.handlebars',
  'text!templates/datePickerTorque-legend.handlebars'
], function(
  _, Backbone, moment, Handlebars, Picker, Pickadate,
  Presenter,
  TorqueDateService,
  tpl, legendTpl) {

  'use strict';

  var SelectedDates = Backbone.Model.extend({
    getRange: function() {
      return [this.get('startDate'), this.get('endDate')];
    },

    setDate: function(id, date) {
      if (id === 'startDate') {
        var otherDate = this.get('endDate');
        if (date.isAfter(otherDate)) { return; }
      } else if (id === 'endDate') {
        var otherDate = this.get('startDate');
        if (date.isBefore(otherDate)) { return; }
      }

      this.set(id, date);
    }
  });

  var TorqueTimelineDatePicker = Backbone.View.extend({

    className: 'timeline-date-pickers',

    template: Handlebars.compile(tpl),
    legendTemplate: Handlebars.compile(legendTpl),

    initialize: function(options) {
      options = options || {};
      this.presenter = options.presenter;
      this.layer = options.layer;
      this.onChange = options.onChange;

      this.selectedDates = new SelectedDates({
        startDate: moment(options.dateRange.start),
        endDate: moment(options.dateRange.end)
      });
      this.listenTo(this.selectedDates, 'change', this.updateTorque);

      this.retrieveAvailableDates();
    },

    render: function() {
      this.$el.html(this.template({
        startDate: this.selectedDates.get('startDate'),
        endDate: this.selectedDates.get('endDate')
      }));
      this.renderPickers();

      return this;
    },

    renderPickers: function() {
      var context = this;

      var onPickerRender = function() {
        var $footer = this.$root.find('.picker__footer');
        $footer.prepend(context.legendTemplate());
      };

      var onPickerOpen = function() {
        // Use disabled dates to highlight what days have data
        this.component.disabled = function(dateToVerify) {
          var date = dateToVerify.obj,
              dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
          var availableDates = context.getAvailableDates();

          if (availableDates.indexOf(dateUTC.getTime()) > -1) {
            // Disabled dates to prevent inverted selected dates
            //   e.g. picking 6/09 for start, and 4/09 for end
            var id = this.component.$node.attr('id');
            date = moment(date);

            if (id === 'startDate') {
              var endDate = context.selectedDates.get('endDate');
              return (date.isAfter(endDate));
            } else if (id === 'endDate') {
              var startDate = context.selectedDates.get('startDate');
              return (date.isBefore(startDate));
            }
            return false;
          } else {
            return true;
          }
        }.bind(this);

        this.render();
      };

      this.$('.timeline-date-picker').pickadate({
        today: 'Jump to Today',
        min: moment(this.layer.mindate).toDate(),
        max: moment(this.layer.maxdate).toDate() || moment().toDate(),
        selectYears: true,
        selectMonths: true,
        format: 'd mmm yyyy',
        onRender: onPickerRender,
        onOpen: onPickerOpen,
        onSet: function(event) {
          if (event.select !== undefined) {
            var id = this.component.$node.attr('id');
            context.selectedDates.setDate(id, moment(event.select));
          }
        }
      });
    },

    updateTorque: function() {
      var dateRange = this.selectedDates.getRange();
      this.onChange(dateRange);
      this.presenter.setTorqueDateRange(dateRange);
    },

    retrieveAvailableDates: function() {
      this.availableDates = [];

      var torqueDateService = new TorqueDateService(this.layer);
      torqueDateService.fetchDates().then(function(availableDates) {
        this.availableDates = availableDates;
        this.renderPickers();
      }.bind(this));
    },

    getAvailableDates: function() {
      return this.availableDates;
    }

  });

  return TorqueTimelineDatePicker;

});
