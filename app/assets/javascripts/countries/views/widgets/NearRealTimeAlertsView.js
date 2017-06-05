define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'moment',
  'uri',
  'core/View',
  'mps',
  'helpers/numbersHelper',
  'text!countries/templates/widgets/nearRealTimeAlerts.handlebars'
], function($, Backbone, _, Handlebars, moment, UriTemplate, View, mps, NumbersHelper, tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET_VIIRS = '20cc5eca-8c63-4c41-8e8e-134dcf1e6d76';
  var DATASET_GLAD = '5608af77-1038-4d5d-8084-d5f49e8323a4';
  var QUERY_VIIRS = '/query?sql=SELECT count(*) as value FROM {dataset} WHERE acq_date = \'{date}\'';
  var QUERY_GLAD = '/query?sql=SELECT sum(alerts) as value FROM {dataset} WHERE year={year} AND month={month} AND country_iso=\'{iso}\' {region}';

  var NearRealTimeAlertsView = View.extend({
    el: '#widget-near-real-time-alerts',

    template: Handlebars.compile(tpl),

    status: new (Backbone.Model.extend({
      defaults: {
        origin: 'month',
        source: 'glad',
        layerLink: 'umd_as_it_happens',
        sourceLink: 'glad-alerts'
      }
    })),


    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.region = parseInt(value);
          this._start();
        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
      this.data = [];
      this._start();
    },

    _start: function() {
      $.when.apply($, [this._getViirsData(), this._getGladData()])
        .then(function(schemas) {
          this.render();
        }.bind(this));
    },

    render: function() {
      var gladValue = this.data.glad && this.data.glad[0] ? this.data.glad[0].value : 0;
      var viirsValue = this.data.viirs && this.data.viirs[0] ? this.data.viirs[0].value : 0;

      this.$el.html(this.template({
        glad: NumbersHelper.addNumberDecimals(gladValue),
        viirs: NumbersHelper.addNumberDecimals(viirsValue)
      }));
      this.$el.removeClass('-loading');
    },

    _getViirsData: function() {
      var $deferred = $.Deferred();
      var url = API + new UriTemplate(QUERY_VIIRS).fillFromObject({
        dataset: DATASET_VIIRS,
        iso: this.iso,
        date: moment.utc().subtract(1, 'days').format('YYYY/MM/DD')
      });

      $.ajax({
        url: url,
        type: 'GET'
      })
      .done(function(res) {
        if (res.data && res.data.length > 0) {
          this.data['glad'] = res.data;
        }
        return $deferred.resolve();
      }.bind(this))
      .fail(function(error) {
        return $deferred.reject();
      });
      return $deferred;
    },

    _getGladData: function() {
      var $deferred = $.Deferred();
      var currentDate = moment.utc();
      var url = API + new UriTemplate(QUERY_GLAD).fillFromObject({
        dataset: DATASET_GLAD,
        iso: this.iso,
        year: currentDate.year(),
        month: currentDate.month() - 1,
        region: this.region === 0 ? 'GROUP BY country_iso' : 'AND state_id = '+this.region+' GROUP BY iso, state_id'
      });
      $.ajax({
        url: url,
        type: 'GET'
      })
      .done(function(res) {
        if (res.data && res.data.length > 0) {
          this.data['viirs'] = res.data;
        }
        return $deferred.resolve();
      }.bind(this))
      .fail(function(error) {
        return $deferred.reject();
      });
      return $deferred;
    }
  });
  return NearRealTimeAlertsView;

});
