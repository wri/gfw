define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'countries/views/widgets/modals/FireAlertsModal',
  'text!countries/templates/widgets/firesAlerts.handlebars',
  'text!countries/templates/widgets/firesAlertsCover.handlebars',
  'text!countries/templates/widgets/firesAlertsCard.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  View,
  mps,
  FireAlertsModal,
  tpl,
  coverTpl,
  cardTpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var ENDPOINT = '/viirs-active-fires/admin';

  var FiresAlertsView = View.extend({
    el: '#widget-fire-alerts',

    events: {
      'click .js-fires-period': 'changePeriod'
    },

    template: Handlebars.compile(tpl),
    coverTemplate: Handlebars.compile(coverTpl),
    cardTemplate: Handlebars.compile(cardTpl),
    cardColorRangeValues: [
      'green',
      'gold',
      'grey-pink'
    ],

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.$widgets.addClass('-loading');
          this.region = parseInt(value);
          this.updateData();
        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
      this.daysBackPeriod = 7;

      this.initFireAlertsModal();
      this.start();
    },

    render: function() {
      this.$el.html(this.template({
        iso: this.iso
      }));
    },

    start: function() {
      this.render();
      this.$widgets = this.$('#fa-graphs-container');
      this._getData().done(function(res) {
        this.data = res.data;
        this._initWidgets();
      }.bind(this));
    },

    initFireAlertsModal: function() {
      this.initFireAlertsModal = new FireAlertsModal();
    },

    _initWidgets: function() {
      this.widgetViews = [];
      this.$el.removeClass('-loading');
      this.$widgets.removeClass('loading-placeholder');
      this.$widgets.html(this.coverTemplate({
        alertsCount: this.data.attributes.value
      }));
    },

    _getData: function() {
      var url = API + ENDPOINT + '/' + this.iso;
      if (this.region !== 0) {
        url += '/' + this.region;
      }
      url += '?period=' + this._getDatePeriod();

      return $.ajax({
        url: url,
        type: 'GET'
      });
    },

    changePeriod: function(e) {
      var target = $(e.target);
      this.$el.addClass('-loading');
      $('.js-fires-period').each(function(i, obj) {
        if ($(obj).hasClass('active')) {
          $(this).removeClass('active');
        }
      });
      this.daysBackPeriod = parseInt(target.attr('data-days-back-period'), 10);
      target.addClass('active');
      this.updateData();
    },

    updateData: function() {
      this._getData().done(function(res) {
        this.data = res.data;
        this._initWidgets();
      }.bind(this));
    },

    _getCardColor: function(value) {
      switch (true) {
        case value >= 20:
          return this.cardColorRangeValues[0];
          break;
        case value < 20 && value >= 15:
          return this.cardColorRangeValues[1];
          break;
        default:
          return this.cardColorRangeValues[2];
          break;
      }
    },

    _getDatePeriod: function () {
      return moment().subtract(this.daysBackPeriod, 'days').format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD');
    }
  });
  return FiresAlertsView;

});
