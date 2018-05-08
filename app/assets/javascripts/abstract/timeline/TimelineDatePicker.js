/**
 * The Timeline date picker view module.
 *
 * @return TorqueTimelineDatePicker view (extends Backbone.View).
 */
define(
  [
    'underscore',
    'backbone',
    'moment',
    'handlebars',
    'picker',
    'pickadate',
    'map/presenters/TorqueTimelinePresenter',
    'text!templates/datePickerTorque.handlebars',
    'text!templates/datePickerTorque-legend.handlebars'
  ],
  function(
    _,
    Backbone,
    moment,
    Handlebars,
    Picker,
    Pickadate,
    Presenter,
    tpl,
    legendTpl
  ) {
    var SelectedDates = Backbone.Model.extend({
      getRange: function() {
        return [this.get('startDate'), this.get('endDate')];
      },

      setDate: function(id, date) {
        var otherDate;
        if (id === 'startDate') {
          otherDate = this.get('endDate');
          if (date.isAfter(otherDate)) {
            return;
          }
        } else if (id === 'endDate') {
          otherDate = this.get('startDate');
          if (date.isBefore(otherDate)) {
            return;
          }
        }

        if (date.toDate().getHours() !== 0) {
          var tzOffset = date.toDate().getTimezoneOffset();
          if (tzOffset > 0) {
            date = date.add(tzOffset, 'minutes');
          }
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
        this.dataService = options.dataService;
        this.layer = options.layer;
        this.onChange = options.onChange;

        this.selectedDates = new SelectedDates();
        this.selectedDates.setDate(
          'startDate',
          moment.utc(options.dateRange.start)
        );
        this.selectedDates.setDate(
          'endDate',
          moment.utc(options.dateRange.end)
        );
        this.listenTo(this.selectedDates, 'change', this.updateTorque);

        this.retrieveAvailableDates();
      },

      render: function() {
        this.$el.html(
          this.template({
            title: this.layer.title,
            startDate: this.selectedDates.get('startDate'),
            endDate: this.selectedDates.get('endDate')
          })
        );
        this.renderPickers();

        return this;
      },

      renderPickers: function() {
        var context = this;
        var onPickerRender = function () {
          var pickerContext = this;

          this.$root.find('.picker__day').each(function () {
            var $el = $(this);
            var date = moment($el.data('pick'));
            var day = date.dayOfYear();

            var histogram =
              context.histograms && context.histograms[date.year()];
            if (histogram) {
              if (histogram[day - 1] > 0) {
                // Disabled dates to prevent inverted selected dates
                //   e.g. picking 6/09 for start, and 4/09 for end
                var id = pickerContext.component.$node.attr('id');
                var endDate = context.selectedDates.get('endDate');
                var startDate = context.selectedDates.get('startDate');

                if (context.layer.slug !== 'umd_as_it_happens') {
                  if (id === 'startDate') {
                    if (!date.isAfter(endDate)) {
                      $el.addClass('picker__has_data');
                    }
                  } else if (id === 'endDate') {
                    if (!date.isBefore(startDate)) {
                      $el.addClass('picker__has_data');
                    }
                  }
                }
              }
            }
          });

          var $footer = this.$root.find('.picker__footer');
          if (context.layer.slug !== 'umd_as_it_happens') {
            $footer.prepend(context.legendTemplate());
          }
        };

        var onPickerOpen = function () {
          this.component.disabled = function (dateToVerify) {
            var date = moment.utc(dateToVerify.obj);
            var id = this.component.$node.attr('id');

            if (id === 'startDate') {
              var endDate = context.selectedDates.get('endDate');
              return date.isAfter(endDate);
            } else if (id === 'endDate') {
              var startDate = context.selectedDates.get('startDate');
              return date.isBefore(startDate);
            }

            return false;
          }.bind(this);

          this.render();
        };

        var tzOffset = new Date().getTimezoneOffset();
        var minDate = moment
          .utc(this.layer.mindate)
          .add(tzOffset, 'minutes')
          .toDate();

        var maxDate = this.maxDate
          ? this.maxDate.toDate()
          : moment
            .utc()
            .add(tzOffset, 'minutes')
            .toDate();

        this.$('.timeline-date-picker').pickadate({
          today:
            context.layer.slug !== 'umd_as_it_happens' ? 'Jump to Today' : '',
          min: minDate,
          max: maxDate,
          selectYears: 20,
          selectMonths: true,
          format: 'd mmm yyyy',
          onRender: onPickerRender,
          onOpen: onPickerOpen,
          klass: {
            picker: 'picker -top'
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

      setMinMaxDate: function(data) {
        var tzOffset = new Date().getTimezoneOffset() + 60;
        if (this.layer.slug === 'umd_as_it_happens') {
          this.minDate = moment.utc(data.minDate);
        } else {
          this.minDate = moment.utc(data.minDate).endOf('day');
        }
        this.maxDate = moment.utc(data.maxDate);
        var minDate = this.minDate
          .clone()
          .add(tzOffset, 'minutes')
          .toDate();
        var maxDate = this.maxDate
          .clone()
          .add(tzOffset, 'minutes')
          .toDate();
        this.$('#startDate')
          .pickadate('picker')
          .set('min', minDate);
        this.$('#endDate')
          .pickadate('picker')
          .set('max', maxDate);
      },

      retrieveAvailableDates: function() {
        var dateService = new this.dataService();
        this.histograms = [];

        dateService.fetchDates().then(function(response){
          this.histograms = response.counts;
          this.renderPickers();
          this.setMinMaxDate(response);
        }.bind(this));
      }
    });

    return TorqueTimelineDatePicker;
  }
);
