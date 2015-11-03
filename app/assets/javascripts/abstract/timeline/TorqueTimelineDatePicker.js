/**
 * The Timeline date picker view module.
 *
 * @return TorqueTimelineDatePicker view (extends Backbone.View).
 */
define([
  'underscore', 'backbone', 'moment', 'handlebars', 'picker', 'pickadate',
  'map/presenters/TorqueTimelinePresenter',
  'map/services/TorqueDateService',
  'text!templates/datePickerTorque.handlebars'
], function(
  _, Backbone, moment, Handlebars, Picker, Pickadate,
  Presenter,
  TorqueDateService,
  tpl) {

  'use strict';

  var SelectedDates = Backbone.Model.extend({
    getRange: function() {
      return [this.get('startDate'), this.get('endDate')];
    }
  });

  var TorqueTimelineDatePicker = Backbone.View.extend({

    className: 'timeline-date-pickers',

    template: Handlebars.compile(tpl),

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
        // TODO add key for "detection dates"
      };

      var onPickerOpen = function() {
        this.component.disabled = function(dateToVerify) {
          var date = dateToVerify.obj,
              dateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
          var availableDates = context.getAvailableDates();

          return availableDates.indexOf(dateUTC.getTime()) === -1;
        };

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
            context.selectedDates.set(id, moment(event.select));
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
