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
  'enquire',
  'text!templates/monthlyPickerTorque.handlebars'
], function(
  _,
  Backbone,
  moment,
  Handlebars,
  enquire,
  tpl
) {

  'use strict';

  var SelectedDates = Backbone.Model.extend({
    getRange: function() {
      return [this.get('startDate'), this.get('endDate')];
    },

    setDates: function(dates) {
      var startDate = this.get('startDate');
      var endDate = this.get('endDate');
      var maxDate = this.get('maxDate');

      for (var key in dates) {
        var currentDate = dates[key];

        switch (key) {
          case 'endDate':
            if (currentDate.isBefore(startDate)) {
              currentDate = startDate.clone().subtract(1, 'months');
            } else if (currentDate.isAfter(maxDate)) {
              currentDate = maxDate.clone();
            }
          break;
          case 'startDate':
            if (currentDate.isAfter(endDate)) {
              currentDate = endDate.clone().subtract(1, 'months');
            }
          break;
        }
        this.set(key, currentDate);
      }
    }
  });

  var TimelineMonthlyPicker = Backbone.View.extend({

    className: 'timeline-torque-monthly-picker',

    template: Handlebars.compile(tpl),

    months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],

    defaults: {
    },

    events: {
      'click .js-input-action': '_onClickInput',
      'change .action': '_onValueChange'
    },

    initialize: function(options) {
      options = options || {};
      this.presenter = options.presenter;
      this.dataService = options.dataService;
      this.layer = options.layer;
      this.onChange = options.onChange;
      this.isMobile = false;

      this.selectedDates = new SelectedDates();
      this.selectedDates.set({
        startDate: moment.utc(options.dateRange.start),
        endDate: moment.utc(options.dateRange.end)
      });

      this.listenTo(this.selectedDates, 'change', this._updateTorque);

      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.isMobile = true;
        }, this)
      });

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
        months: this.months,
        isMobile: this.isMobile
      }));

      this._cacheVars();
      this.setListeners();
      this._setDates();

      return this;
    },

    _afterRender: function() {
      if (this.isMobile) {
        this._renderMobileSelectors();
      }
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
        this._renderMonths($content, selector, type, 'div');
      } else if (type === 'year') {
        this._renderYears($content, selector, type, 'div');
      }

      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      this.scrollTimeout = setTimeout(function() {
        $content.scrollTop = 0;
      }, 10);
    },

    _renderMonths: function($content, selector, type, htmlTag) {
      for (var month in this.months) {
        var newMonth = document.createElement(htmlTag);
        var currentMonthName = this.months[month];
        var currentMonth = parseInt(month, 10);

        newMonth.dataset.value = currentMonthName;
        newMonth.dataset.selector = selector;
        newMonth.dataset.type = type;
        newMonth.innerHTML = currentMonthName;
        newMonth.classList.add('item');

        this._validateMonth(newMonth, selector, currentMonth);

        $content.appendChild(newMonth);
      }
    },

    _validateMonth: function(newMonth, selector, currentMonth) {
      var maxYear = this.maxDate.year();
      var maxMonth = this.maxDate.month()
      var startMonth = this.selectedDates.get('startDate').month();
      var endMonth = this.selectedDates.get('endDate').month();
      var startYear = this.selectedDates.get('startDate').year();
      var endYear = this.selectedDates.get('endDate').year();

      switch (selector) {
        case 'startDate':
          if ((startYear === endYear) && currentMonth > endMonth) {
            newMonth.classList.add('-disabled');
            newMonth.disabled = true;
          }
          if (currentMonth === startMonth) {
            newMonth.selected = true;
            newMonth.classList.add('-active');
          }
        break;

        case 'endDate':
          if ((startYear === endYear) && currentMonth < startMonth) {
            newMonth.classList.add('-disabled');
            newMonth.disabled = true;
          } else if ((endYear === maxYear) && currentMonth > maxMonth) {
            newMonth.classList.add('-disabled');
            newMonth.disabled = true;
          }
          if (currentMonth === endMonth) {
            newMonth.selected = true;
            newMonth.classList.add('-active');
          }
        break;
      }
    },

    _renderYears: function($content, selector, type, htmlTag) {
      var startMinYear = this.minDate.year();
      var endMaxYear = this.maxDate.year();
      var yearsList = _.range(startMinYear, (endMaxYear + 1), 1);
      var startYear = this.selectedDates.get('startDate').year();
      var endYear = this.selectedDates.get('endDate').year();

      for (var year in yearsList) {
        var newYear = document.createElement(htmlTag);
        var currentYear = yearsList[year];
        newYear.dataset.value = currentYear;
        newYear.dataset.selector = selector;
        newYear.dataset.type = type;
        newYear.innerHTML = currentYear;
        newYear.classList.add('item');

        switch (selector) {
          case 'startDate':
            if (currentYear > endYear) {
              newYear.classList.add('-disabled');
              newYear.disabled = true;
            }
            if (currentYear === startYear) {
              newYear.selected = true;
              newYear.classList.add('-active');
            }
          break;

          case 'endDate':
            if (currentYear < startYear) {
              newYear.classList.add('-disabled');
              newYear.disabled = true;
            }
            if (currentYear === endYear) {
              newYear.selected = true;
              newYear.classList.add('-active');
            }
          break;
        }
        $content.appendChild(newYear);
      }
    },

    _showSelector: function() {
      this.$listSelector.classList.add('-visible');
    },

    _hideSelector: function() {
      if (this.$listSelector) {
        this.$listSelector.classList.remove('-visible');

        this._clearInputSelection();
      }
    },

    _clearInputSelection: function() {
      var $currentSelected = this.el.querySelectorAll('.-active');

      if ($currentSelected) {
        for (var x = 0; x < $currentSelected.length; x++) {
          $currentSelected[x].classList.remove('-active');
        }
      }
    },

    _setMinMaxDate: function(data) {
      this.minDate = moment.utc(data.minDate).endOf('day');
      this.maxDate = moment.utc(data.maxDate);

      this.selectedDates.set({
        maxDate: this.maxDate.clone()
      }, {
        silent: true
      });
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

      this.selectedDates.setDates({
        startDate: startDate,
        endDate: endDate
      });
    },

    _updateTorque: function() {
      var dateRange = this.selectedDates.getRange();
      this.onChange(dateRange);
      this.presenter.setTorqueDateRange(dateRange);
      this.render();
      this._afterRender();
    },

    _retrieveAvailableDates: function() {
      var dateService = new this.dataService();

      dateService.fetchDates().then(function(response) {
        this.render();
        this._setMinMaxDate(response);
        this._afterRender();
        this._setDates();
      }.bind(this));
    },

    _renderMobileSelectors: function() {
      // Start date
      this._renderMonths(this.$startMonth, 'startDate', 'month', 'option');
      this._renderYears(this.$startYear, 'startDate', 'year', 'option');

      // End date
      this._renderMonths(this.$endMonth, 'endDate', 'month', 'option');
      this._renderYears(this.$endYear, 'endDate', 'year', 'option');
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
