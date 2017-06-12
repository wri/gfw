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
  var DATASET = '';
  var QUERY = '';

  var FiresAlertsView = View.extend({
    el: '#widget-fire-alerts',

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

        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.initFireAlertsModal();
      this.start();
    },

    render: function() {
      this.$el.html(this.template({
        iso: this.iso
      }));
      this.$el.removeClass('-loading');
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
      this.$widgets.removeClass('loading-placeholder');

      this.data = {
        alertsCount: 87,
        items: [
          {
            name: 'Mineração Aurizona S.A.',
            alerts: 25,
            isWorst: false
          },
          {
            name: 'Pan Brazilian Mineração Ltda.',
            alerts: 19,
            isWorst: false
          },
          {
            name: 'Bahmex Bahia Mineral Exploration Ltda',
            alerts: 17,
            isWorst: true
          },
          {
            name: 'Votorantim Metais Zinco S.A.',
            alerts: 11,
            isWorst: true
          },
          {
            name: 'União Pesquisas Minerais Ltda',
            alerts: 6,
            isWorst: true
          }
        ]
      };
      this.$widgets.append(this.coverTemplate({
        alertsCount: this.data.alertsCount
      }));
      this.data.items.forEach(function(data, index) {
        this.$widgets.append(this.cardTemplate({
          ranking: index + 1,
          name: data.name,
          alerts: data.alerts,
          color: this._getCardColor(data.alerts),
          isWorst: data.isWorst,
        }));
      }.bind(this))
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({});

      return $.ajax({
        url: url,
        type: 'GET'
      });
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
  });
  return FiresAlertsView;

});
