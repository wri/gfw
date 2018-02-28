/* eslint-disable */
define(
  [
    'underscore',
    'handlebars',
    'enquire',
    'moment',
    'mps',
    'cookie',
    'picker',
    'pickadate',
    'map/presenters/ReactMapMiddlePresenter'
  ],
  function(
    _,
    Handlebars,
    enquire,
    moment,
    mps,
    Cookies,
    picker,
    pickadate,
    Presenter
  ) {
    'use strict';

    var MAX_ZOOM = 9;

    var SelectedDates = Backbone.Model.extend({
      // left blank on puropose, max min dates
    });

    var ReactMapMiddleView = Backbone.View.extend({
      el: '#react-map',

      initialize: function(map) {
        this.presenter = new Presenter(this);
        this.map = map;
        this.previousZoom;
        this.selectedDates = new SelectedDates({
          startDateUC: moment().format('DD-MM-YYYY'),
          endDateUC: moment()
            .subtract(3, 'month')
            .format('DD-MM-YYYY')
        });
        this.params = {};
      },

      toggleLayer: function(slug, params) {
        this.params = params;
        this.presenter.toggleLayer(slug);
      },

      updateLayer: function(slug, params) {
        this.params = params;
        this.presenter.updateLayer(slug);
      },

      _getParams: function(e) {
        return this.params;
      },

      _setParams: function(e) {
        if (!!this.presenter.status.get('hresolution')) {
          this.presenter.setHres(this._getParams());
          this.presenter.updateLayer('highres');
        } else if (
          !!this.presenter.status
            .get('layerSpec')
            .getLayer({ slug: 'sentinel_tiles' })
        ) {
          this.presenter.setSentinel(this._getParams());
          this.presenter.updateLayer('sentinel_tiles');
        } else {
          this.toggleLayer(null);
        }
      },

      _fillParams: function(params) {
        this.params = params;
        this.$hresSelectFilter
          .val(this.params.color_filter)
          .trigger('chosen:updated');
        this.$hresSensorFilter
          .val(this.params.sensor_platform)
          .trigger('chosen:updated');
        this.$range.val(this.params.cloud);
        this.setClouds();
        this.zoom = params.zoom;
        window.setTimeout(
          _.bind(function(params) {
            this.renderPickers(this.params.mindate, this.params.maxdate);
            this.params = null;
          }, this),
          250
        );
      },

      toggleLayerName: function(e) {
        if (!!!document.getElementsByClassName('tab-mobile-content')[0]) return;
        this.toggleLayer(e);
      },

      toggleAdvanced: function(e) {
        this.$advanced_controls.toggleClass('active');
        this.$advanced_controls.text(
          this.$advanced_controls.hasClass('active')
            ? 'Close Advanced Settings'
            : 'Open Advanced Settings'
        );
        this.$advanced_options.toggle('250');
      },

      switchToggle: function(to) {},

      switchSentinelToggle: function(to) {},

      setClouds: function() {
        var width = this.$range.val();
        this.$progress.width(width + '%');
        ga('send', 'event', 'Map', 'Settings', 'Sentinel advanced cloud');
      }
    });

    return ReactMapMiddleView;
  }
);
