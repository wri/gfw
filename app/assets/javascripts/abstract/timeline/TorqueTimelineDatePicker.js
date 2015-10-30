/**
 * The Timeline date picker view module.
 *
 * @return TorqueTimelineDatePicker view (extends Backbone.View).
 */
define([
  'underscore', 'backbone', 'moment', 'handlebars', 'picker', 'pickadate',
  'map/presenters/TorqueTimelinePresenter',
  'text!templates/datePickerTorque.handlebars'
], function(
  _, Backbone, moment, Handlebars, Picker, Pickadate,
  Presenter,
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

      this.selectedDates = new SelectedDates({
        startDate: moment(options.dateRange.start),
        endDate: moment(options.dateRange.end)
      });
      this.listenTo(this.selectedDates, 'change', this.updateTorque);
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
      var onPickerRender = function() {
      };

      var context = this;
      this.$('.timeline-date-picker').pickadate({
        selectYears: true,
        selectMonths: true,
        onRender: onPickerRender,
        onSet: function(event) {
          var id = this.component.$node.attr('id');
          context.selectedDates.set(id, moment(event.select));
        }
      });
    },

    updateTorque: function() {
      this.presenter.setTorqueDateRange(
        this.selectedDates.getRange());
    }

  });

  return TorqueTimelineDatePicker;

});
