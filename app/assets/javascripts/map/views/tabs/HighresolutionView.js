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

  var MAX_ZOOM = 9;

  var SelectedDates = Backbone.Model.extend({
    // left blank on puropose, max min dates
  });

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'click .onoffswitch'             : 'toggleLayer',
      'click .maptype h3'              : 'toggleLayerName',
      'click .advanced-controls'       : 'toggleAdvanced',
      'input #range-clouds'            : 'setClouds',
      'change #range-clouds'           : 'setClouds',
      'change input'                   : '_setParams',
      'change select'                  : '_setParams',
    },

    renderers: {
      'rgb': 'RGB (Red Green Blue)',
      'ndvi': 'NDVI (Normalized Difference Vegetation Index)',
      'evi': 'EVI (Enhanced vegetation index)',
      'ndwi': 'NDWI (Normalized Difference Water Index)',
      'false-color-nir': 'False Color NIR (Near Infra Red)',
    },

    sensors : {
      'sentinel-2': 'Sentinel 2',
      'landsat-8': 'Landsat 8'
    },

    initialize: function(map) {
      this.presenter = new Presenter(this);
      this.map = map;
      this.previousZoom;
      this.selectedDates = new SelectedDates({
        startDateUC: moment().format('DD-MM-YYYY'),
        endDateUC: moment().subtract(3,'month').format('DD-MM-YYYY'),
      });
      this.render();
    },

    cacheVars: function() {
      this.$highresForm          = $('#highres-form');
      this.$selects            = this.$el.find('.chosen-select');
      this.$hresSelectFilter   = this.$el.find('#hres-filter-select');
      this.$hresSensorFilter   = this.$el.find('#hres-filter-sensor');
      this.$onoffswitch        = this.$el.find('.onoffswitch.toggleSentinel');
      this.$onoffswitchSentinelTiles = this.$el.find('.onoffswitch.toggleSentinelTiles');
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
        mindate: moment().subtract(4,'month').format('YYYY-MM-DD'),
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
      if(this.zoom >= MAX_ZOOM) {
        this.presenter.notificateClose();
        this.$disclaimer.hide(0);
      } else {
        if (!!this.$onoffswitch.hasClass('checked')) {
          if (this.previousZoom >= MAX_ZOOM) {
            this.presenter.notificate('notification-zoom-not-reached');
          }
        }
        this.$disclaimer.show(0);
      }
      this.previousZoom = zoom;
    },

    _getParams: function(e) {
      var renderer = this.$highresForm.find('#hres-filter-select').val() || 'rgb',
          sensor = this.$highresForm.find('#hres-filter-sensor').val() || 'sentinel-2',
          mindate = (!!this.$mindate.val()) ? this.$mindate.val() : '2000-09-01',
          maxdate = (!!this.$maxdate.val()) ? this.$maxdate.val() : '2000-09-01';

      return {
        'zoom' : this.zoom,
        'satellite' : this.$highresForm.data('slug'),
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
        this.presenter.updateLayer('highres');
      } else if (!!this.presenter.status.get('layerSpec').getLayer({ slug: 'sentinel_tiles' })){
        this.presenter.setSentinel(this._getParams());
        this.presenter.updateLayer('sentinel_tiles');
      } else {
        this.toggleLayer(null);
      }
    },

    _fillParams: function(params) {
      this.params = params;
      this.$hresSelectFilter.val(this.params.color_filter).trigger("chosen:updated");
      this.$hresSensorFilter.val(this.params.sensor_platform).trigger("chosen:updated");
      this.$range.val(this.params.cloud);
      this.setClouds();
      this.zoom = params.zoom;
      window.setTimeout(_.bind(function(params) {
        this.renderPickers(this.params.mindate, this.params.maxdate);
        this.params = null;
      },this), 250)
    },

    toggleLayer: function(e) {
      var slug = e === null ? null : $(e.currentTarget).data('source');
      if (slug === 'sentinel_tiles'){
        this.presenter.toggleLayer(slug);
        this.$onoffswitchSentinelTiles.toggleClass('checked');
      } else if (this.zoom >= MAX_ZOOM) {
        this.presenter.toggleLayer('highres');
      } else {
        if (!!this.$onoffswitch.hasClass('checked')) {
          this.presenter.toggleLayer('highres');
        } else {
          this.presenter.notificate('notification-zoom-not-reached');
        }
      }
      ga('send', 'event', 'Map', 'Toggle', 'Sentinel');
    },

    toggleLayerName: function(e) {
      if (! !!document.getElementsByClassName('tab-mobile-content')[0]) return;
      this.toggleLayer(e);
    },

    toggleAdvanced: function(e) {
      this.$advanced_controls.toggleClass('active');
      this.$advanced_controls.text((this.$advanced_controls.hasClass('active')) ? "Close Advanced Settings" : "Open Advanced Settings");
      this.$advanced_options.toggle('250');
    },

    switchToggle: function(to) {
      var was_active = this.$el.find('.onoffswitch.toggleSentinel').hasClass('checked');
      this.$el.find('.onoffswitch.toggleSentinel').toggleClass('checked', to);

      if (to && !isMobile.any && !was_active) {
        var listenerMouseMove = google.maps.event.addListener(this.map, 'mousemove', function(e) {
          this.$highresolutionModal.toggleClass('-active', to);
          this.$highresolutionModal.css({
            top: e.pixel.y + 25, // 35 is the height of the app bar
            left: e.pixel.x
          });
          setTimeout(function() {
            google.maps.event.removeListener(listenerMouseMove);
            this.$highresolutionModal.toggleClass('-active', false);
          }.bind(this), 4000)
        }.bind(this));
      } else {
        if (listenerMouseMove) {
          google.maps.event.removeListener(listenerMouseMove);
        }
      }

      this.toggleIconUrthe(to);
    },

    switchSentinelToggle: function(to) {
      this.$onoffswitchSentinelTiles.toggleClass('checked', to);
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

    setClouds: function(){
      var width = this.$range.val();
      this.$progress.width(width + '%');
      ga('send', 'event', 'Map', 'Settings', 'Sentinel advanced cloud');
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
        min: moment('2013', 'YYYY').toDate(),
        max: TODAY,
        selectYears: true,
        selectMonths: true,
        format: FORMAT,
        formatSubmit: FORMATSUBMIT,
        hiddenPrefix: 'snd__mindate',
        onOpen: onPickerOpen,
        klass: {
          picker: 'picker -left',
        },
        onSet: function(event) {
          if ( event.select ) {
            endHRdate_picker.set('min', startHRdate_picker.get('select'));
            ga('send', 'event', 'Map', 'Settings', 'Sentinel dates');
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
        klass: {
          picker: 'picker -left',
        },
        onSet: function(event) {
          if ( event.select ) {
            startHRdate_picker.set('max', endHRdate_picker.get('select'));
            ga('send', 'event', 'Map', 'Settings', 'Sentinel dates');
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
