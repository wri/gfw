/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'moment',
  'mps',
  'picker',
  'pickadate',
  'map/presenters/tabs/HighresolutionPresenter',
  'text!map/templates/tabs/highresolution.handlebars'
], function(_, Handlebars, enquire, moment, mps, picker, pickadate, Presenter, tpl) {

  'use strict';

  var SelectedDates = Backbone.Model.extend({
    // left blank on puropose, max min dates
  });

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click  .onoffswitch'       : 'toggleLayer',
      'click  .maptype h3'        : 'toggleLayerName',
      'oninput #range-clouds'     : 'setVisibleRange',
      'change #range-clouds'      : 'setVisibleRange',
      'change input'              : '_setParams',
      'change select'             : '_setParams',
      'click button'              : '_triggerChanges',
      'click .advanced-controls'  : '_toggleAdvanced'
    },

    initialize: function(map) {
      this.presenter = new Presenter(this);
      this.map = map;
      this.params_new_url;
      this.previousZoom;
      this.selectedDates = new SelectedDates({
        startDateUC: moment().format('DD-MM-YYYY'),
        endDateUC: moment().subtract(3,'month').format('DD-MM-YYYY'),
      });
      this.render();
    },

    cacheVars: function() {
      this.$urtheForm          = $('#urthe-form');
      this.$selects            = this.$el.find('.chosen-select');
      this.$hresSelectProvider = $('#hres-provider-select');
      this.$hresSelectFilter   = $('#hres-filter-select');
      this.$hresSensorFilter   = $('#hres-filter-sensor');
      this.$onoffswitch        = this.$el.find('.onoffswitch');
      this.$range              = $('#range-clouds');
      this.$progress           = $('#progress-clouds');
      this.$mindate            = this.$el.find("input[name='snd__mindate_submit']");
      this.$maxdate            = this.$el.find("input[name='snd__maxdate_submit']");
      this.$advanced_options   = this.$el.find('.advanced-options');
      this.$advanced_controls  = this.$el.find('.advanced-controls');
      this.$apply              = this.$el.find('.btn');
      this.$disclaimer         = this.$el.find('#disclaimer-zoom');
      this.$currentZoom        = this.$el.find('#currentZoom');
      this.$UC_Icon            = $('#uc-logo-map');
    },

    render: function() {
      this.$el.html(this.template({
        today: moment().format('DD-MM-YYYY'),
        mindate: moment().subtract(3,'month').format('YYYY-MM-DD'),
        zoom: this.map.getZoom()
      }));
      this.renderPickers();
      this.cacheVars();
      this.setListeners();
      this.printSelects();
    },

    setListeners: function() {
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.setZoomConditions(this.map.getZoom());
        }, this)
      );
    },

    setZoomConditions: function(zoom) {
      this.zoom = zoom;
      if (isNaN(this.previousZoom)) this.previousZoom = zoom;
      this.$currentZoom.text(zoom);
      if(this.zoom >= 5) {
        this.presenter.notificateClose();
        this.$disclaimer.hide(0);
      } else {
        if (!!this.$onoffswitch.hasClass('checked')) {
          if (this.previousZoom >= 5) {
            this.presenter.notificate('not-zoom-not-reached');
          }
        }
        this.$disclaimer.show(0);
      }
      this.previousZoom = zoom;
    },

    _getParams: function(e) {
      return {
        'zoom' : this.zoom,
        'satellite' : this.$urtheForm.data('slug'),
        'color_filter': (this.$urtheForm.find('#hres-filter-select').val().length > 0) ? this.$urtheForm.find('#hres-filter-select').val() : 'rgb',
        'sensor_platform': (this.$urtheForm.find('#hres-filter-sensor').val().length > 0) ? this.$urtheForm.find('#hres-filter-sensor').val() : null,
        'cloud': this.$range.val(),
        'mindate': (this.$mindate.val().length > 0) ? this.$mindate.val() : '2000-09-01',
        'maxdate': (this.$maxdate.val().length > 0) ? this.$maxdate.val() : '2015-09-01'
      }
    },

    _setParams: function(e) {
      this.$apply.addClass('green').removeClass('gray');
      this.presenter.setHres(this._getParams());
      this._triggerChanges(e);
    },

    _triggerChanges: function(e) {
      this.presenter.updateLayer('urthe');
      this.$apply.removeClass('green').addClass('gray');
    },

    _fillParams: function(params) {
      this.$hresSelectFilter.val(params.color_filter).trigger("liszt:updated");
      this.$hresSensorFilter.val(params.sensor_platform).trigger("liszt:updated");
      this.$range.val(params.cloud);
      this.setVisibleRange();
      this.zoom = params.zoom;
      var that = this;
      this.params = params;
      window.setTimeout(_.bind(function(params) {
        this.renderPickers(this.params.mindate, this.params.maxdate);
        this.params = null;
      },this), 250)
    },

    toggleLayer: function(e) {
      if (this.zoom >= 5) {
        this.$apply.toggleClass('disabled');
        this.presenter.toggleLayer('urthe');
      } else {
        if (!!this.$onoffswitch.hasClass('checked')) {
          this.$apply.toggleClass('disabled');
          this.presenter.toggleLayer('urthe');
        } else {
          this.presenter.notificate('not-zoom-not-reached');
        }
      }
      ga('send', 'event', 'Map', 'Toggle', 'Urthecast');
    },

    toggleLayerName: function(e) {
      if (! !!document.getElementsByClassName('tab-mobile-content')[0]) return;
      this.toggleLayer(e);
    },

    _toggleAdvanced: function(e) {
      this.$advanced_controls.toggleClass('active');
      this.$advanced_options.toggle('250');
    },

    switchToggle: function(to) {
      // this.$onoffswitch.toggleClass('checked');
      this.$el.find('.onoffswitch').toggleClass('checked', to);
      this.toggleIconUrthe();
    },


    printSelects: function() {
      this.printProviders();
      // this.printFilters();
      this.triggerChosen();
    },

    triggerChosen: function() {
      this.$selects.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
    },

    printProviders: function() {
      var options = '<option value="urthe">Urthecast</option><option value="digiglobe">Digital Globe</option><option value="skybox">Skybox</option>';
      this.$hresSelectProvider.append(options);
      this.$hresSelectFilter.append('<option value="rgb">RGB (Red Green Blue)</option><option value="ndvi">NDVI (Normalized Difference Vegetation Index)</option><option value="evi">EVI (Enhanced vegetation index)</option><option value="ndwi">NDWI (Normalized Difference Water Index)</option><option value="false-color-nir">False Color NIR (Near Infra Red)</option>'); //temporary hardcoded

    },

    printFilters: function(options) {
      if (!!options) return;
      this.$hresSelectFilter.append(options);
      this.triggerChosen();
    },

    setVisibleRange: function(){
      var width = this.$range.val();
      this.$progress.width(width + '%');
      ga('send', 'event', 'Map', 'Settings', 'Urthecast advanced cloud');
    },

    renderPickers: function(minABSdate, maxABSdate) {
      var context = this;

      var onPickerOpen = function() {
        this.render();
      };

      var TODAY         = moment().toDate(),
          TODAY_TEXT    = 'Jump to Today',
          FORMAT        = 'dddd, dd mmm, yyyy',
          FORMATSUBMIT  = 'yyyy-mm-dd';

      var startHRdate = $('.timeline-date-picker-start').pickadate({
        today: TODAY_TEXT,
        min: moment('2013').toDate(),
        max: TODAY,
        selectYears: true,
        selectMonths: true,
        format: FORMAT,
        formatSubmit: FORMATSUBMIT,
        hiddenPrefix: 'snd__mindate',
        onOpen: onPickerOpen,
        onSet: function(event) {
          if ( event.select ) {
            endHRdate_picker.set('min', startHRdate_picker.get('select'));
            ga('send', 'event', 'Map', 'Settings', 'Urthecast dates');
          }
        }
      }),
      startHRdate_picker = startHRdate.pickadate('picker');

      var endHRdate = $('.timeline-date-picker-end').pickadate({
        today: TODAY_TEXT,
        min: moment().subtract(3,'month').toDate(),
        max: TODAY,
        selectYears: true,
        selectMonths: true,
        format: FORMAT,
        formatSubmit: FORMATSUBMIT,
        hiddenPrefix: 'snd__maxdate',
        onOpen: onPickerOpen,
        onSet: function(event) {
          if ( event.select ) {
            startHRdate_picker.set('max', endHRdate_picker.get('select'));
            ga('send', 'event', 'Map', 'Settings', 'Urthecast dates');
          }
        }
      });
      var endHRdate_picker = endHRdate.pickadate('picker');

      if (minABSdate && maxABSdate) {
        startHRdate_picker.set('select',  moment(minABSdate).toDate());
        endHRdate_picker.set('select',  moment(maxABSdate).toDate());
      }
    },

    toggleIconUrthe: function() {
      this.$UC_Icon.toggle();
    }

  });

  return HighresolutionView;

});

