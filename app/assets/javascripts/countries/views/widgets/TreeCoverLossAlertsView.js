define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'common/views/LineGraphView',
  'text!countries/templates/widgets/treeCoverLossAlerts.handlebars',
  'text!countries/templates/widgets/treeCoverLossAlertsCard.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, NumbersHelper, LineGraphView, tpl, cardTpl) {

  'use strict';

  var WIDGETS_NUM = 5;
  var API = window.gfw.config.GFW_API_HOST_NEW_API;
  var DATASET = 'b6489365-58e2-446a-917e-f898cda4dac5';
  var QUERY = '/query/?sql=select sum(alerts) as alerts from {dataset} WHERE country_iso=\'{iso}\' AND year={year} group by state_iso ORDER BY alerts DESC LIMIT {widgetsNum}';

  var TreeCoverLossView = Backbone.View.extend({
    el: '#widget-tree-cover-loss-alerts',

    template: Handlebars.compile(tpl),
    cardTemplate: Handlebars.compile(cardTpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.start();
    },

    start: function() {
      this.render();
      this.$widgets = this.$('#cla-graphs-container');
      this._getData().done(function(res) {
        this.data = res.data;
        this._initWidgets();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        widgetsNum: 5
      }));
    },

    _initWidgets: function() {
      this.widgetViews = [];
      this.$widgets.removeClass('loading-placeholder');
      this.data.forEach(function(data, index) {
        this.$widgets.append(this.cardTemplate({
          ranking: index + 1,
          alerts: data.alerts
        }));

        var graphEl = this.$widgets.find('#cover-loss-alert-card-' + index + 1);
        // if (graphEl) {
        //   this.widgetViews.push(new LineGraphView({
        //     el: graphEl,
        //     data: this.data
        //   }));
        // }
      }.bind(this))
    },

    _getData: function() {
      var url = API + new UriTemplate(QUERY).fillFromObject({
        widgetsNum: WIDGETS_NUM,
        dataset: DATASET,
        iso: this.iso,
        year: 2017, //TODO: change this for months
      });

      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  });
  return TreeCoverLossView;

});
