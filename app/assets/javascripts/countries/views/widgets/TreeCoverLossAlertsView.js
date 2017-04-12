define([
  'jquery',
  'backbone',
  'underscore',
  'moment',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'services/CountryService',
  'common/views/LineGraphView',
  'text!countries/templates/widgets/treeCoverLossAlerts.handlebars',
  'text!countries/templates/widgets/treeCoverLossAlertsCard.handlebars'
], function(
  $,
  Backbone,
  _,
  moment,
  Handlebars,
  UriTemplate,
  NumbersHelper,
  CountryService,
  LineGraphView,
  tpl,
  cardTpl) {

  'use strict';

  var WIDGETS_NUM = 5;
  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET = 'a98197d2-cd8e-4b17-ab5c-fabf54b25ea0'; // CLIMATE PRODUCTION DATASET
  var QUERY_TOP = '/query/?sql=select sum(alerts) as alerts, state_iso, state_id from {dataset} WHERE country_iso=\'{iso}\' AND year={year} group by state_iso ORDER BY alerts DESC LIMIT {widgetsNum}';
  var QUERY_DATA = '/query/?sql=select sum(alerts) as alerts, year, week, state_iso from {dataset} WHERE country_iso=\'{iso}\' AND year={year} AND state_iso IN({statesIso}) AND week <= 53 AND group by state_iso, week, year ORDER BY week ASC';

  var TreeCoverLossView = Backbone.View.extend({
    el: '#widget-tree-cover-loss-alerts',

    template: Handlebars.compile(tpl),
    cardTemplate: Handlebars.compile(cardTpl),

    initialize: function(params) {
      // this.iso = params.iso;
      this.iso = 'BRA';
      this.start();
    },

    start: function() {
      this.render();
      this.$widgets = this.$('#cla-graphs-container');
      this._getData().done(function(data) {
        this.data = data;
        this._initWidgets();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        widgetsNum: 5
      }));
      this.$el.removeClass('-loading');
    },

    _initWidgets: function() {
      this.$widgets.removeClass('-loading');
      if (this.data) {
        this.widgetViews = [];
        var keys = Object.keys(this.data);
        keys.forEach(function(key, index) {
          this.$widgets.append(this.cardTemplate({
            ranking: index + 1,
            alerts: this.data[key].alerts,
            name: this.data[key].name
          }));
          this.widgetViews.push(new LineGraphView({
            el: '#cover-loss-alert-card-' + (index + 1),
            data: this.data[key].data,
            xAxisLabels: false
          }));
        }.bind(this));
      } else {
        this.$widgets.addClass('.-no-data');
        this.$widgets.html('<p>There are no alerts</p>');
      }
    },

    _getData: function() {
      var promise = $.Deferred();
      var iso = this.iso;
      var data = {};
      var url = API + new UriTemplate(QUERY_TOP).fillFromObject({
        widgetsNum: WIDGETS_NUM,
        dataset: DATASET,
        iso: iso,
        year: 2017, //TODO: change this for months
      });

      $.ajax({ url: url, type: 'GET' })
        .done(function(topResponse) {
          if (topResponse.data.length > 0) {
            CountryService.getRegionsList({ iso: this.iso })
              .then(function(results) {

                topResponse.data.forEach(function(item) {
                  var region = _.findWhere(results, {
                    id_1: parseInt(item.state_iso.substr(3), 10)
                  });
                  var name =  region ? region.name_1 : 'N/A';

                  data[item.state_iso] = {
                    alerts: NumbersHelper.addNumberDecimals(item.alerts),
                    data: [],
                    name: name
                  }
                });

                var url = API + new UriTemplate(QUERY_DATA).fillFromObject({
                  dataset: DATASET,
                  iso: iso,
                  year: 2017,
                  statesIso: '\'' + topResponse.data.map(function(item) {return item.state_iso}).join('\',\'') + '\'',
                });
                $.ajax({ url: url, type: 'GET' })
                  .done(function(dataResponse) {
                    dataResponse.data.forEach(function(item) {
                      if (data[item.state_iso] && item.alerts) {
                        data[item.state_iso].data.push({
                          date: moment.utc().year(item.year).week(item.week),
                          value: item.alerts
                        })
                      }
                    });
                    promise.resolve(data)
                  });
            }.bind(this))
          } else {
            promise.resolve(false);
          }
        }.bind(this))
        .fail(function(err){
          promise.reject(err);
        });
      return promise;
    }
  });
  return TreeCoverLossView;

});
