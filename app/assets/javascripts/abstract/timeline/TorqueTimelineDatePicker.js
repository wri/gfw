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

  var TorqueTimelineDatePicker = Backbone.View.extend({

    className: 'timeline-date-pickers',

    template: Handlebars.compile(tpl),
    legendTemplate: Handlebars.compile(legendTpl),

    initialize: function(options) {
      options = options || {};
      this.presenter = options.presenter;
      this.layer = options.layer;
      this.onChange = options.onChange;

      this.selectedDates = new SelectedDates();
      this.selectedDates.setDate('startDate',
        moment.utc(options.dateRange.start));
      this.selectedDates.setDate('endDate',
        moment.utc(options.dateRange.end));
      this.listenTo(this.selectedDates, 'change', this.updateTorque);

      this.retrieveAvailableDates();
    },

    render: function() {
      this.$el.html(this.template({
        title: this.layer.title,
        startDate: this.selectedDates.get('startDate'),
        endDate: this.selectedDates.get('endDate')
      }));
      this.renderPickers();

      return this;
    },

    renderPickers: function() {
      var context = this;

      var onPickerRender = function() {
        var pickerContext = this;

        this.$root.find('.picker__day').each(function() {
          var $el = $(this);

          var date = new Date($el.data('pick')),
              dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
          var availableDates = context.getAvailableDates();

          if (availableDates.indexOf(dateUTC.getTime()) > -1) {
            // Disabled dates to prevent inverted selected dates
            //   e.g. picking 6/09 for start, and 4/09 for end
            var id = pickerContext.component.$node.attr('id');
            date = moment.utc(date);

            if (id === 'startDate') {
              var endDate = context.selectedDates.get('endDate');
              if (!date.isAfter(endDate)) {
                $el.addClass('picker__has_data');
              }
            } else if (id === 'endDate') {
              var startDate = context.selectedDates.get('startDate');
              if (!date.isBefore(startDate)) {
                $el.addClass('picker__has_data');
              }
            }

            $el.addClass('picker__has_data');
          }
        });

        var $footer = this.$root.find('.picker__footer');
        $footer.prepend(context.legendTemplate());
      };

      var onPickerOpen = function() {
        this.component.disabled = function(dateToVerify) {
          var date = moment.utc(dateToVerify.obj);
          var id = this.component.$node.attr('id');

          if (id === 'startDate') {
            var endDate = context.selectedDates.get('endDate');
            return (date.isAfter(endDate));
          } else if (id === 'endDate') {
            var startDate = context.selectedDates.get('startDate');
            return (date.isBefore(startDate));
          }

          return false;
        }.bind(this);

        this.render();
      };

      var tzOffset = new Date().getTimezoneOffset();
      var minDate = moment.utc(this.layer.mindate).
        add(tzOffset, 'minutes').
        toDate();
      var maxDate = moment.utc(this.layer.maxdate).
        add(tzOffset, 'minutes').
        toDate();

      this.$('.timeline-date-picker').pickadate({
        today: 'Jump to Today',
        min: minDate,
        max: maxDate || moment.utc().add(tzOffset, 'minutes').toDate(),
        selectYears: true,
        selectMonths: true,
        format: 'd mmm yyyy',
        onRender: onPickerRender,
        onOpen: onPickerOpen,
        klass: {
          picker: 'picker -top',
        },
        onSet: function(event) {
          if (event.select !== undefined) {
            var id = this.component.$node.attr('id');
            var timezone = new Date().getTimezoneOffset() * 60 * 1000,
                offsetDate = event.select - timezone;
            context.selectedDates.setDate(id, moment.utc(offsetDate));
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
