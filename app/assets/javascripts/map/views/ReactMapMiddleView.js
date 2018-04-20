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

    var SelectedDates = Backbone.Model.extend({});

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

      showZoomAlert: function(alert, currentZoom) {
        this.previousZoom = currentZoom;
        this.showAlertNotification(alert);
      },

      showAlertNotification: function(alert) {
        this.presenter.notificate(alert);
      },

      getParams: function(e) {
        return this.params;
      },

      fillParams: function(params) {
        this.params = params;
      }
    });

    return ReactMapMiddleView;
  }
);
