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
  'cookie',
  'picker',
  'pickadate',
  'map/presenters/tabs/HighresolutionPresenter',
  'text!map/templates/tabs/highresolution.handlebars'
], function(_, Handlebars, enquire, moment, mps, Cookies, picker, pickadate, Presenter, tpl) {

  'use strict';

  var SelectedDates = Backbone.Model.extend({
    // left blank on puropose, max min dates
  });

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click .onoffswitch'        : 'toggleLayer',
      'click .maptype h3'         : 'toggleLayerName',
      'input #range-clouds'       : 'setVisibleRange',
      'change #range-clouds'      : 'setVisibleRange',
      'click #btn-highresolutionModal' : 'setCookie',
      'change input'              : '_setParams',
      'change select'             : '_setParams',
      'click .advanced-controls'  : '_toggleAdvanced',
    },

    renderers: {
      'rgb': 'RGB (Red Green Blue)',
      'ndvi': 'NDVI (Normalized Difference Vegetation Index)',
      'evi': 'EVI (Enhanced vegetation index)',
      'ndwi': 'NDWI (Normalized Difference Water Index)',
      'false-color-nir': 'False Color NIR (Near Infra Red)',
    },

    sensors : {
      'landsat-8,theia,deimos-1': 'All sensors',
      'landsat-8': 'Landsat 8 (15 m)',
      'theia': 'Theia (5 m)',
      'deimos-1': 'Deimos 1 (22 m)',
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
      this.$hresSelectFilter   = this.$el.find('#hres-filter-select');
      this.$hresSensorFilter   = this.$el.find('#hres-filter-sensor');
      this.$onoffswitch        = this.$el.find('.onoffswitch');
      this.$range              = this.$el.find('#range-clouds');
      this.$progress           = this.$el.find('#progress-clouds');
      this.$mindate            = this.$el.find("input[name='snd__mindate_submit']");
      this.$maxdate            = this.$el.find("input[name='snd__maxdate_submit']");
      this.$advanced_options   = this.$el.find('.advanced-options');
      this.$advanced_controls  = this.$el.find('.advanced-controls');
      this.$disclaimer         = this.$el.find('#disclaimer-zoom');
      this.$currentZoom        = this.$el.find('#currentZoom');
      this.$highresolutionModal = this.$el.find('#highresolutionModal');
      this.$UC_Icon            = $('#uc-logo-map');
    },

    render: function() {
      this.$el.html(this.template({
        today: moment().format('DD-MM-YYYY'),
        mindate: moment().subtract(3,'month').format('YYYY-MM-DD'),
        zoom: this.map.getZoom(),
        sensors: this.sensors,
        renderers: this.renderers
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
      var renderer = this.$urtheForm.find('#hres-filter-select').val() || 'rgb',
          sensor = this.$urtheForm.find('#hres-filter-sensor').val() || null,
          mindate = (!!this.$mindate.val()) ? this.$mindate.val() : '2000-09-01',
          maxdate = (!!this.$maxdate.val()) ? this.$maxdate.val() : '2000-09-01';

      return {
        'zoom' : this.zoom,
        'satellite' : this.$urtheForm.data('slug'),
        'color_filter': renderer,
        'renderer': this.renderers[renderer],
        'sensor_platform': sensor,
        'sensor_name': this.sensors[sensor],
        'cloud': this.$range.val(),
        'mindate': mindate,
        'maxdate': maxdate
      }
    },

    _setParams: function(e) {
      if (!!this.presenter.status.get('hresolution')) {
        this.presenter.setHres(this._getParams());
        this.presenter.updateLayer('urthe');
      } else {
        this.toggleLayer();
      }
    },

    _fillParams: function(params) {
      this.params = params;
      this.$hresSelectFilter.val(this.params.color_filter).trigger("liszt:updated");
      this.$hresSensorFilter.val(this.params.sensor_platform).trigger("liszt:updated");
      this.$range.val(this.params.cloud);
      this.setVisibleRange();
      this.zoom = params.zoom;
      window.setTimeout(_.bind(function(params) {
        this.renderPickers(this.params.mindate, this.params.maxdate);
        this.params = null;
      },this), 250)
    },

    toggleLayer: function(e) {
      if (this.zoom >= 5) {
        this.presenter.toggleLayer('urthe');
      } else {
        if (!!this.$onoffswitch.hasClass('checked')) {
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
      this.$advanced_controls.text((this.$advanced_controls.hasClass('active')) ? "Close Advanced Settings" : "Open Advanced Settings");
      this.$advanced_options.toggle('250');
    },

    switchToggle: function(to) {
      this.$el.find('.onoffswitch').toggleClass('checked', to);
      if (!Cookies.get('highresolution-advice')) {
        this.$highresolutionModal.toggleClass('-active', to);
      }
      this.toggleIconUrthe(to);
    },

    setCookie: function() {
      Cookies.set('highresolution-advice', true, { expires: 60 });
      this.$highresolutionModal.toggleClass('-active', false);
    },


    printSelects: function() {
      this.$selects.chosen({
        width: '100%',
        allow_single_deselect: true,
        disable_search: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
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
          FORMAT        = 'dd mmm yyyy',
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

    toggleIconUrthe: function(to) {
      this.$UC_Icon.toggle(to);
    }

  });

  return HighresolutionView;

});

