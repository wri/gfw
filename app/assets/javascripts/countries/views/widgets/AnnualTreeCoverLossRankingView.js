define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'services/CountryService',
  'text!countries/templates/widgets/annualTreeCoverLossRanking.handlebars'
], function(
  $,
  Backbone,
  _,
  Handlebars,
  UriTemplate,
  NumbersHelper,
  CountryService,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var DATASET_LOSS = 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea';
  var QUERY_TOTAL_LOSS = '/query?sql=select sum(area) as value FROM {dataset} WHERE thresh=30 group by iso ORDER BY value DESC';

  var AnnualTreeCoverLossRankingView = Backbone.View.extend({
    el: '#widget-annual-tree-cover-loss-ranking',

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;

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
      for (var x = 0; x < this.data.length; x++) {
        var item = this.data[x];

        if (item.iso === this.iso) {
          isoIndex = x;
          break;
        }
      }

      this.list = [];
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

      this.list.map(function(item, index) {
        var country = _.findWhere(this.countries, { iso: item.iso });
        item.index = index + 1;
        item.name = country.name || item.iso;
        item.value = ((item.value / 1000) / 1000).toFixed(2).replace('.', ',');
        item.selected = item.iso === this.iso;
        return item;
      }.bind(this));
    },

    _getData: function() {
      var $promise = $.Deferred();
      var data = {};

      var url = API + new UriTemplate(QUERY_TOTAL_LOSS).fillFromObject({
        dataset: DATASET_LOSS
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
        console.warn(error);
      }.bind(this))
      return $promise;
    },

    render: function() {
      this.$el.html(this.template({
        data: this.list
      }));
      this.$el.removeClass('-loading');
    }
  });
  return AnnualTreeCoverLossRankingView;

});
