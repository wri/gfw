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
      if(this.region === 0) {
        for (var x = 0; x < this.data.length; x++) {
          item = this.data[x];

          if (item.iso === this.iso) {
            isoIndex = x;
            break;
          }
        }
      } else {
        for (var x = 0; x < this.data.length; x++) {
          item = this.data[x];
          if (item.adm1 === parseInt(this.region)) {
            isoIndex = x;
            break;
          }
        }
      }

      this.list = [];

      if(this.region === 0) {
        if (isoIndex > 0) {
          this.list.push(this.data[isoIndex - 1]);
          this.list.push(this.data[isoIndex]);

          if (isoIndex < this.data.length) {
            this.list.push(this.data[isoIndex + 1]);
          }
        } else {
          this.list.push(this.data[isoIndex]);
          this.list.push(this.data[isoIndex + 1]);
          this.list.push(this.data[isoIndex + 2]);
        }
      } else {
        if (isoIndex > 0) {
          this.list.push(this.data[isoIndex - 1]);
          this.list.push(this.data[isoIndex]);

          if (isoIndex < this.data.length) {
            this.list.push(this.data[isoIndex + 1]);
          }
        } else {
          this.list.push(this.data[isoIndex]);
          this.list.push(this.data[isoIndex + 1]);
          this.list.push(this.data[isoIndex + 2]);
        }
      }

      this.list.map(function(item, index) {
        if (this.region === 0 ) {
          var country = _.findWhere(this.countries, { iso: item.iso });
        }
        var regionName =  null;
        if (this.region != 0) {
          regionName = _.findWhere(this.dataRegions, { id: item.adm1 });
          regionName = regionName.name;
        }
        var region = null;
        item.index = index + 1;
        if (this.region === 0) {
          item.name = country.name || item.iso;
        } else {
          item.name = regionName;
        }
        item.value = ((item.value / 1000) / 1000).toFixed(2).replace('.', ',');
        if (this.region === 0) {
          item.selected = item.iso === this.iso;
        } else {
          item.selected = item.adm1 === parseInt(this.region);
        }
        if (this.region != 0) {
          this.titleText = 'Regions ranking';
        } else {
          this.titleText = 'Tree cover country ranking 2010';
        }
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
