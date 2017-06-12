define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'services/CountryService',
  'common/views/PieGraphView',
  'text!countries/templates/widgets/treeCover.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  View,
  mps,
  CountryService,
  PieGraphView,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET_COVER = '0ef4a861-930f-4f56-865d-89f5c0c6aef0';
  var QUERY_TOTAL_COVER = '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' and thresh=30 {region}';
  var DATASET_IFL = 'de9ab235-452c-4832-97ab-1b55287beb4e';
  var QUERY_TOTAL_IFL = '/query?sql=select sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' and thresh=30 {region}';

  var TreeCoverView = View.extend({
    el: '#widget-tree-cover',

    template: Handlebars.compile(tpl),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.$el.addClass('-loading');
          this.region = parseInt(value);
          this._getData().done(function(data) {
            this._initWidget(data);
          }.bind(this));
        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
      this._getData().done(function(data) {
        this._initWidget(data);
      }.bind(this));
    },

    _initWidget: function(data) {
      this.render(data);
      var dataparsed = [];
      dataparsed.push({
        category: 1,
        value: data.totalCover,
        color: '#97be32'
      });
      dataparsed.push({
        category: 2,
        value: data.totalIfl,
        color: '#168500'
      });
      dataparsed.push({
        category: 3,
        value: data.rest,
        color: '#dddde0'
      });
      this.pieGraph = new PieGraphView({
        el: '#tree-cover-graph',
        data: dataparsed,
      });
    },

    _getData: function() {
      var $promise = $.Deferred();
      var data = {};

      var urlTotalCover = API + new UriTemplate(QUERY_TOTAL_COVER).fillFromObject({
        dataset: DATASET_COVER, iso: this.iso, region: this.region === 0 ? 'GROUP BY iso' : 'AND adm1 = '+this.region+' GROUP BY iso, adm1',
      });

      var urlTotalIfl = API + new UriTemplate(QUERY_TOTAL_IFL).fillFromObject({
        dataset: DATASET_IFL, iso: this.iso, region: this.region === 0 ? 'GROUP BY iso' : 'AND adm1 = '+this.region+' GROUP BY iso, adm1',
      });

      CountryService.getCountriesInfo({
        columns: 'area_ha',
        filter: 'WHERE iso=\''+ this.iso +'\''
      })
      .then(function(results) {
        this.totalArea = Math.round(results[0].area_ha);

        $.ajax({ url: urlTotalCover, type: 'GET'})
          .done(function(totalCover) {
            var totalCoverValue = totalCover.data[0] ? Math.round(totalCover.data[0].value) : 0;
            data['total'] = totalCover.data[0] ? totalCover.data[0].value : 0;
            data['totalCover'] = totalCoverValue;

            $.ajax({ url: urlTotalIfl, type: 'GET'})
              .done(function(totalIfl) {
                var totalIflValue = totalIfl.data[0] ? Math.round(totalIfl.data[0].value) : 0;
                data['totalIfl'] = totalIflValue;
                data['rest'] = this.totalArea - (data['totalCover'] + data['totalIfl']);

                $promise.resolve(data)
              }.bind(this))
              .fail(function(err){
                $promise.reject(err);
              });
          }.bind(this))
          .fail(function(err){
            $promise.reject(err);
          });
      }.bind(this))

      .error(function(error) {
        console.warn(error);
      }.bind(this))

      return $promise;
    },

    _formatTotalValue: function(value) {
      var amount = Math.round(value);
      var unit = '';

      if (amount.toString().length >= 7) {
        amount = Math.round((amount / 1000) / 1000)
        unit = 'MHa';
      } else if (amount.toString().length >= 4) {
        unit = 'KHa';
        amount = Math.round(amount / 1000);
      }

      return {
        value: amount,
        unit: unit
      }
    },

    render: function(data) {
      this.$el.html(this.template({
        totalCover: this._formatTotalValue(data.total)
      }));
      this.$el.removeClass('-loading');
    }
  });
  return TreeCoverView;

});
