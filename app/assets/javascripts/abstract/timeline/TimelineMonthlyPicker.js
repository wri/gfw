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
  'handlebars',
  'text!templates/monthlyPickerTorque.handlebars'
], function(
  _,
  Backbone,
  moment,
  Handlebars,
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

    events: {
      'click .action': '_onClickInput',
      'change .action': '_onValueChange'
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
      this.listenTo(this.selectedDates, 'change', this._updateTorque);

      this._retrieveAvailableDates();
    },

    _cacheVars: function() {
      this.$listSelector = this.el.querySelector('.js-list-selector');
      this.$startMonth = this.el.querySelector('.js-start-month');
      this.$startYear = this.el.querySelector('.js-start-year');
      this.$endMonth = this.el.querySelector('.js-end-month');
      this.$endYear = this.el.querySelector('.js-end-year');
    },

    render: function() {
      this.$el.html(this.template({
        title: this.layer.title,
        months: this.months
      }));

      this._cacheVars();
      this.setListeners();
      this._setDates();

      return this;
    },

    setListeners: function() {
      // Body click to hide the box
      this.selectorHideClickEvent = this._hideSelector.bind(this);
      document.body.addEventListener('click', this.selectorHideClickEvent, true);

      // Items events
      this.$el.find('.js-list-selector').delegate('.item', 'click', this._onItemClick.bind(this));
    },

    unsetListeners: function() {
      document.body.removeEventListener('click', this.selectorHideClickEvent, true);

      this.$el.find('.js-list-selector').undelegate('.item', 'click');
    },

    _setListSelectorPosition: function($element) {
      var $parent = $element.parentNode;
      var leftParent = $parent.offsetLeft;
      var left = $element.offsetLeft;
      var listSelectorWidth = this.$listSelector.clientWidth / 2;
      var elementWidth = $element.clientWidth / 2;
      var leftPostion = ((leftParent + left) - listSelectorWidth) + elementWidth;

      this.$listSelector.style.left = leftPostion + 'px';
    },

    _setSelectorData: function($element) {
      var $content = this.$listSelector.querySelector('.content');
      var type = $element.dataset.type;
      var selector = $element.dataset.selector;
      $content.innerHTML = '';

      if (type === 'month') {
        this._renderMonths($content, selector, type);
      } else if (type === 'year') {
        this._renderYears($content, selector, type);
      }

      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(function() {
        $content.scrollTop = 0;
      }, 10);
    },

    _renderMonths: function($content, selector, type) {
      var startMonth = this.months[this.selectedDates.get('startDate').month()];
      var endMonth = this.months[this.selectedDates.get('endDate').month()];

      for (var month in this.months) {
        var newMonth = document.createElement('div');
        var currentMonth = this.months[month];
        newMonth.dataset.value = currentMonth;
        newMonth.dataset.selector = selector;
        newMonth.dataset.type = type;
        newMonth.innerHTML = currentMonth;
        newMonth.classList.add('item');

        if (selector === 'startDate') {
          if (currentMonth === startMonth) {
            newMonth.classList.add('-active');
          }
        } else if (selector === 'endDate') {
          if (currentMonth ===endMonth) {
            newMonth.classList.add('-active');
          }
        }
        $content.appendChild(newMonth);
      }
    },

    _renderYears: function($content, selector, type) {
      var startYear = this.minDate.year();
      var endYear = this.maxDate.year();
      var yearsList = _.range(startYear, (endYear + 1), 1);
      var startYear = this.selectedDates.get('startDate').year();
      var endYear = this.selectedDates.get('endDate').year();

      for (var year in yearsList) {
        var newYear = document.createElement('div');
        var currentYear = yearsList[year];
        newYear.dataset.value = currentYear;
        newYear.dataset.selector = selector;
        newYear.dataset.type = type;
        newYear.innerHTML = currentYear;
        newYear.classList.add('item');

        if (selector === 'startDate') {
          if (currentYear > endYear) {
            newYear.classList.add('-disabled');
          }
          if (currentYear === startYear) {
            newYear.classList.add('-active');
          }
        } else if (selector === 'endDate') {
          if (currentYear < startYear) {
            newYear.classList.add('-disabled');
          }
          if (currentYear ===endYear) {
            newYear.classList.add('-active');
          }
        }
        $content.appendChild(newYear);
      }
    },

    _showSelector: function() {
      this.$listSelector.classList.add('-visible');
    },

    _hideSelector: function() {
      this.$listSelector.classList.remove('-visible');

      this._clearInputSelection();
    },

    _clearInputSelection: function() {
      var $currentSelected = this.el.querySelectorAll('.-active');

      if ($currentSelected) {
        $currentSelected.forEach(function(selected) {
          selected.classList.remove('-active');
        });
      }
    },

    _setMinMaxDate: function(data) {
      this.minDate = moment.utc(data.minDate).endOf('day');
      this.maxDate = moment.utc(data.maxDate);
    },

    _setDates: function() {
      var startDate = this.selectedDates.get('startDate');
      var endDate = this.selectedDates.get('endDate');

      this.$startMonth.value = this.months[startDate.month()];
      this.$startYear.value = startDate.year();

      this.$endMonth.value = this.months[endDate.month()];
      this.$endYear.value = endDate.year();
    },

    _updateDates: function() {
      var startDate = moment.utc('01-' + this.$startMonth.value + '-' + this.$startYear.value,
        'DD-MMM-YYYY');

      var endDate = moment.utc(this.$endMonth.value + '-' + this.$endYear.value,
        'MMM-YYYY').endOf('month');

      this.selectedDates.set({
        startDate: startDate,
        endDate: endDate
      });
    },

    _updateTorque: function() {
      var dateRange = this.selectedDates.getRange();
      this.onChange(dateRange);
      this.presenter.setTorqueDateRange(dateRange);
    },

    _retrieveAvailableDates: function() {
      var dateService = new this.dataService();

      dateService.fetchDates().then(function(response) {
        this._setMinMaxDate(response);
        this._setDates();
      }.bind(this));
    },

    // Events

    _onClickInput: function(ev) {
      ev.preventDefault();
      var $current = ev.currentTarget;
      $current.classList.add('-active');

      this._setSelectorData($current);
      this._showSelector();
      this._setListSelectorPosition($current);
    },

    _onValueChange: function(ev) {
      this._updateDates();
      this._setDates();
    },

    _onItemClick: function(ev) {
      var $current = ev.currentTarget;
      var selector = $current.dataset.selector;
      var value = $current.dataset.value;
      var type = $current.dataset.type;

      if (selector === 'startDate') {
        var $input = this.$('.js-start-' + type);
        $input[0].value = value;
        $input.trigger('change');
      } else if (selector === 'endDate') {
        var $input = this.$('.js-end-' + type);
        $input[0].value = value;
        $input.trigger('change');
      }
    }
  });

  return TimelineMonthlyPicker;

});
