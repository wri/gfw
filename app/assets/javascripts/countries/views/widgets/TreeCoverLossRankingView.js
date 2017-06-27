define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'core/View',
  'mps',
  'helpers/numbersHelper',
  'services/CountryService',
  'text!countries/templates/widgets/treeCoverLossRanking.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  View,
  mps,
  NumbersHelper,
  CountryService,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET_LOSS = '0ef4a861-930f-4f56-865d-89f5c0c6aef0';
  var QUERY_TOTAL_LOSS = '/query?sql=select sum(area) as value FROM {dataset} WHERE thresh=30 {region} ORDER BY value DESC';

  var TreeCoverLossRankingView = View.extend({
    el: '#widget-tree-cover-loss-ranking',

    template: Handlebars.compile(tpl),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.region = parseInt(value);
          this.$el.addClass('-loading');
          this._getData().done(function(data) {
            this.data = data;
            this._initWidget();
          }.bind(this));
        }
      },
    ],

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
      this._addRegions();
      this._getData().done(function(data) {
        this.data = data;
        this._initWidget();
      }.bind(this));
    },

    _initWidget: function() {
      this._setRank();
      this.render();
    },

    _setRank: function() {
      var isoIndex = 0;
      var item = null;

      for (var x = 0; x < this.data.length; x++) {
        item = this.data[x];

        if ((this.region === 0 && item.iso === this.iso) ||
          item.adm1 === parseInt(this.region)) {
          isoIndex = x;
          break;
        }
      }

      this.list = [];

      if (isoIndex > 0) {
        this.list.push({
          data:this.data[isoIndex - 1],
          index: isoIndex,
        });
        this.list.push({
          data: this.data[isoIndex],
          index: isoIndex,
        });

        if (isoIndex < this.data.length) {
          this.list.push({
            data: this.data[isoIndex + 1],
            index: isoIndex + 1
          });
        }
      } else {
        this.list.push({
          data: this.data[isoIndex],
          index: isoIndex
        });
        this.list.push({
          data: this.data[isoIndex],
          index: isoIndex + 1
        });
        this.list.push({
          data: this.data[isoIndex],
          index: isoIndex + 2
        });
      }

      this.list.map(function(item, index) {
        var regionName =  null;
        var region = null;
        if (this.region === 0 ) {
          var country = _.findWhere(this.countries, { iso: item.data.iso });
          item.data.name = country.name || item.data.iso;
          item.data.value = ((item.data.value / 1000) / 1000).toFixed(2).replace('.', ',');
          item.data.selected = item.data.iso === this.iso;

          if(index > 0) {
            item.index = item.index + 1;
          }

          this.titleText = 'Tree cover country ranking 2010';
        } else {
          regionName = _.findWhere(this.dataRegions, { id: item.data.adm1 });
          regionName = regionName.name;
          item.data.name = regionName;
          item.data.value = ((item.data.value / 1000) / 1000).toFixed(2).replace('.', ',');
          item.data.selected = item.data.adm1 === parseInt(this.region);

          if(index > 0) {
            item.index = item.index + 1;
          }

          this.titleText = 'Regions ranking';
        }
        item.data.index = index + 1;
        return item;
      }.bind(this));
    },

    _getData: function() {
      var $promise = $.Deferred();
      var data = {};

      var url = API + new UriTemplate(QUERY_TOTAL_LOSS).fillFromObject({
        dataset: DATASET_LOSS, region: this.region === 0 ? 'GROUP BY iso' : 'AND iso = \''+ this.iso +'\' GROUP BY iso, adm1'
      });

      CountryService.getCountriesInfo({
        columns: 'iso, name_engli as name',
      })
      .then(function(results) {
        this.countries = results;
        $.ajax({ url: url, type: 'GET'})
          .done(function(res) {
            $promise.resolve(res.data);
          }.bind(this))
          .fail(function(err){
            $promise.reject(err);
          });
      }.bind(this))
      .error(function(error) {
      }.bind(this))
      return $promise;
    },

    _addRegions: function(country) {
      this.dataRegions = [];
      CountryService.getRegionsList({ iso: this.iso })
        .then(function(results) {
          for ( var i = 0; i < results.length; i++) {
            this.dataRegions.push({
              name: results[i].name_1,
              id: results[i].id_1,
              selected: results[i].id_1 === parseInt(this.region),
            });
          }
        }.bind(this))
    },

    render: function() {
      this.$el.html(this.template({
        data: this.list,
        titleText: this.titleText
      }));
      this.$el.removeClass('-loading');
    }
  });
  return TreeCoverLossRankingView;

});
