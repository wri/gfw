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
  var API_HOST = window.gfw.config.GFW_API_HOST_PROD;
  var CARTO_API_HOST = window.gfw.config.CARTO_API_HOST;

  var ORIGIN_LABELS = {
    wdpa: 'Within protected areas',
    wdma: 'Within moratorium areas',
    onpeat: 'On peat'
  }

  var DATASETS = {
    wdpa: '7bcf0880-c00d-4726-aae2-d455a9decbce',
    wdma: '439fc0f1-ba89-448d-9fc5-d4e61b60f5e7',
    onpeat: '439fc0f1-ba89-448d-9fc5-d4e61b60f5e7',
  }

  var QUERIES = {
    wdpa: {
      top: '/query?sql=SELECT SUM (alerts) as alerts, year, wdpa_id FROM {dataset} WHERE year={year} AND country_iso=\'{iso}\' GROUP BY wdpa_id ORDER BY alerts DESC limit {widgetsNum}',
      data: '/query?sql=select sum(alerts) as alerts, year, month, wdpa_id from {dataset} WHERE country_iso=\'{iso}\' AND year={year} AND wdpa_id IN({ids}) AND group by wdpa_id, month, year ORDER BY month ASC',
      names: 'SELECT name WHERE wdpa_pid IN({wdpaIds})'
    },
    wdma: {
      top: '/query?sql=SELECT SUM (alerts) as alerts, year, state_id FROM {dataset} WHERE year={year} AND country_iso=\'{iso}\' GROUP BY state_id ORDER BY alerts DESC limit {widgetsNum}',
      data: '/query?sql=select sum(alerts) as alerts, year, month, state_id from {dataset} WHERE country_iso=\'{iso}\' AND year={year} AND state_id IN({ids}) AND group by state_id, month, year ORDER BY month ASC'
    },
    onpeat: {
      top: '/query?sql=SELECT SUM (alerts) as alerts, year, state_id FROM {dataset} WHERE year={year} AND country_iso=\'{iso}\' GROUP BY state_id ORDER BY alerts DESC limit {widgetsNum}',
      data: '/query?sql=select sum(alerts) as alerts, year, month, state_id from {dataset} WHERE country_iso=\'{iso}\' AND year={year} AND state_id IN({ids}) AND group by state_id, month, year ORDER BY month ASC'
    }
  }

  var TreeCoverLossView = Backbone.View.extend({
    el: '#widget-tree-cover-loss-alerts',

    events: {
      'change #cla-data-shown-select': 'onOriginSelectChange',
      'click .data-source-filter': 'changeDataSourceFilter'
    },

    template: Handlebars.compile(tpl),
    cardTemplate: Handlebars.compile(cardTpl),

    defaultOrigins: ['wdpa'],
    originsByCountry: {
      IDN: ['wdma', 'onpeat'],
      MYS: ['onpeat']
    },

    initialize: function(params) {
      this.iso = params.iso;
      this.start();
    },

    start: function() {
      this.render();
      this.cache();
      this._getData().done(function(data) {
        this.data = data;
        this._initWidgets();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        widgetsNum: 5,
        origins: this.getOriginOptions(this.iso)
      }));
      this.$el.removeClass('-loading');
    },

    cache: function(iso) {
      this.$widgets = this.$('#cla-graphs-container');
    },

    getOriginOptions: function(iso) {
      var origins = this.defaultOrigins;
      if (this.originsByCountry[iso]) {
        origins = origins.concat(this.originsByCountry[iso]);
      }
      return origins.map(function(origin) {
        return {
          label: ORIGIN_LABELS[origin],
          value: origin
        }
      });
    },

    onOriginSelectChange: function(e) {
      var value = e.currentTarget.value;
      this.updateData(value);
    },

    changeDataSourceFilter: function(e) {
      $('.data-source-filter').each(function(i, obj) {
        if ($(obj).hasClass('active')) {
          $(this).removeClass('active');
        }
      });
      $(e.target).addClass('active');
    },

    updateData: function(origin) {
      this._getData(origin).done(function(data) {
        this.data = data;
        this._initWidgets();
      }.bind(this));
    },

    _initWidgets: function() {
      this.$widgets.removeClass('-loading');
      if (this.data) {
        this.widgetViews = [];
        this.$widgets.html('');
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

    _getData: function(origin) {
      origin = origin || 'wdpa';
      var iso = this.iso;
      var data = {};
      var year = parseInt(moment().format('YYYY'), 10);
      var queryTemplate = API_HOST + QUERIES[origin].top;
      var url = new UriTemplate(queryTemplate).fillFromObject({
        widgetsNum: WIDGETS_NUM,
        dataset: DATASETS[origin],
        iso: iso,
        year: year
      });
      var promise = $.Deferred();

      $.ajax({ url: url, type: 'GET' })
        .done(function(topResponse) {
          if (topResponse.data.length > 0) {
            CountryService.getRegionsList({ iso: this.iso })
              .then(function(results) {

                topResponse.data.forEach(function(item) {
                  var region = _.findWhere(results, {
                    id_1: item.wdpa_id
                  });
                  var name =  region ? region.name_1 : 'N/A';

                  data[item.wdpa_id] = {
                    alerts: NumbersHelper.addNumberDecimals(item.alerts),
                    data: [],
                    name: name
                  }
                });

                var ids = topResponse.data.map(function(item) {
                  return origin === 'wdpa' ? item.wdpa_id : item.state_id
                }).join('\',\'');

                var url = API_HOST + new UriTemplate(QUERIES[origin].data).fillFromObject({
                  dataset: DATASETS[origin],
                  iso: iso,
                  year: year,
                  ids: '\'' + ids + '\'',
                });
                $.ajax({ url: url, type: 'GET' })
                  .done(function(dataResponse) {
                    dataResponse.data.forEach(function(item) {
                      if (data[item.wdpa_id] && item.alerts) {
                        data[item.wdpa_id].data.push({
                          date: moment.utc().year(item.year).month(item.month),
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
