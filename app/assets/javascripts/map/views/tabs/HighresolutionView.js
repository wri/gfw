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
      'change #hres-provider-select' : 'changeProvider',
      'click  .onoffswitch' : 'toggleLayer',
      'oninput #range-clouds' : 'setVisibleRange',
      'change #range-clouds' : 'setVisibleRange',
      'change input' : '_setParams',
      'change select' : '_setParams',
      'click button' : '_triggerChanges',
      'click .advanced-controls' : '_toggleAdvanced'
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
      this.$selects            = this.$el.find('.chosen-select');
      this.$hresSelectProvider = $('#hres-provider-select');
      this.$hresSelectProFil   = $('#hres-filter-select');
      this.$hresSelectFilter   = $('#hres-filter-select');
      this.$onoffswitch        = this.$el.find('.onoffswitch');
      this.$range              = $('#range-clouds');
      this.$progress           = $('#progress-clouds');
      this.$mindate            = this.$el.find('.mindate');
      this.$maxdate            = this.$el.find('.maxdate');
      this.$advanced_options   = this.$el.find('.advanced-options');
      this.$advanced_controls  = this.$el.find('.advanced-controls');
      this.$apply              = this.$el.find('.btn');
      this.$disclaimer         = this.$el.find('#disclaimer-zoom');
      this.$currentZoom        = this.$el.find('#currentZoom');
    },

    render: function() {
      this.$el.html(this.template({
        today: moment().format('DD-MM-YYYY'),
        mindate: moment().subtract(3,'month').format('DD-MM-YYYY'),
        zoom: this.map.getZoom()
      }));
      this.cacheVars();
      this.renderPickers();
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
      if(this.zoom >= 7) {
        this.$disclaimer.hide(0);
      } else {
        if (this.previousZoom >= 7) {
            this.presenter.notificate('not-zoom-not-reached');
        }
        if (!!this.$onoffswitch.hasClass('checked')) {
          this.$onoffswitch.click();
        }
        this.$disclaimer.show(0);
      }
      this.previousZoom = zoom;
    },

    _getParams: function(e) {
      var $objTarget = $(e.target).closest('.maptype');
      if(!!this.$onoffswitch.hasClass('checked')) {
        return {
          'zoom' : this.zoom,
          'satellite' : $objTarget.data('slug'),
          'color_filter': ($objTarget.find('#hres-filter-select').val().length > 0) ? $objTarget.find('#hres-filter-select').val() : 'rgb',
          'cloud': this.$range.val(),
          'mindate': (this.$mindate.val().length > 0) ? this.$mindate.val() : '2000-09-01',
          'maxdate': (this.$maxdate.val().length > 0) ? this.$maxdate.val() : '2015-09-01'
        };
      }
      return null;
    },

    _setParams: function(e) {
      if (! !!this.$onoffswitch.hasClass('checked')) {
        this.toggleLayer(e);
      } else {
        this.$apply.removeClass('disabled');
      }
      this.$apply.addClass('green').removeClass('gray');
      this.presenter.setHres(this._getParams(e));
    },

    _triggerChanges: function(e) {
      this.presenter.updateLayer($(e.target).closest('.maptype').data('slug'));
    },

    _fillParams: function(params) {
      this.$hresSelectProFil.val(params.color_filter).trigger("liszt:updated");
      this.$range.val(params.cloud);
      this.$mindate.val(params.mindate);
      this.$maxdate.val(params.maxdate);
      this.setVisibleRange();
    },

    toggleLayer: function(e) {
      if (this.zoom >= 7) {
        this.switchToggle();
        this.$apply.toggleClass('disabled');
        this.presenter.setHres(this._getParams(e));
        this.presenter.toggleLayer($(e.target).closest('.maptype').data('slug'));
      } else {
        if (!!this.$onoffswitch.hasClass('checked')) {
          this.switchToggle();
          this.$apply.toggleClass('disabled');
          this.presenter.setHres(this._getParams(e));
          this.presenter.toggleLayer($(e.target).closest('.maptype').data('slug'));
        } else {
          this.presenter.notificate('not-zoom-not-reached');
        }
      }
    },

    _toggleAdvanced: function(e) {
      this.$advanced_controls.toggleClass('active');
      this.$advanced_options.toggle('250');
    },

    switchToggle: function() {
      // this.$onoffswitch.toggleClass('checked');
      this.$el.find('.onoffswitch').toggleClass('checked');
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

    changeProvider: function(e) {
      return;
      var providers = {
        'urthe' : '<option value="ndvi">NDVI (Normalized Difference Vegetation Index)</option><option value="evi">EVI (Enhanced vegetation index)</option><option value="ndwi">NDWI (Normalized Difference Water Index)</option><option value="false-nir">False Color NIR (Near Infra Red)</option>',
        'digiglobe' : '',
        'skybox' : ''
      }
      this.printFilters(providers[$(e.currentTarget).val()]);
    },

    setVisibleRange: function(){
      var width = this.$range.val();
      this.$progress.width(width + '%')
    },

    renderPickers: function() {
      var context = this;

      var onPickerOpen = function() {
        this.render();
      };

      var startHRdate = $('.timeline-date-picker-start').pickadate({
        today: 'Jump to Today',
        min: moment('2013').toDate(),
        max: moment().toDate(),
        selectYears: true,
        selectMonths: true,
        format: 'dd-mm-yyyy',
        formatSubmit: 'dd-mm-yyyy',
        onOpen: onPickerOpen,
        onSet: function(event) {
          if ( event.select ) {
            endHRdate_picker.set('min', startHRdate_picker.get('select'))    
          }
        }
      }),
      startHRdate_picker = startHRdate.pickadate('picker');

      var endHRdate = $('.timeline-date-picker-end').pickadate({
        today: 'Jump to Today',
        min: moment().subtract(3,'month').format('DD-MM-YYYY'),
        max: moment().toDate(),
        selectYears: true,
        selectMonths: true,
        format: 'dd-mm-yyyy',
        formatSubmit: 'dd-mm-yyyy',
        onOpen: onPickerOpen,
        onSet: function(event) {
          if ( event.select ) {
            startHRdate_picker.set('max', endHRdate_picker.get('select'))
          }
        }
      });
      var endHRdate_picker = endHRdate.pickadate('picker');
    },

  });

  return HighresolutionView;

});

