define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'helpers/numbersHelper',
  'common/views/GroupedGraphView',
  'text!countries/templates/widgets/annualTreeCoverLoss.handlebars'
], function($, Backbone, _, Handlebars, UriTemplate, NumbersHelper, GroupedGraphView, tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var QUERY_YEARLY = '/query?sql=select sum(area) as value, year as date from {dataset} where thresh=30 and iso=\'{iso}\' group by year';
  var QUERY_TOTAL = '/query/?sql=SELECT sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' AND thresh=\'30\' GROUP BY iso';

  // Datasets
  var DATASETS = [
    {
      slug: 'loss',
      name: 'Tree cover loss',
      show: false,
      dataset: 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea'
    },
    {
      slug: 'wdpa',
      name: 'Protected areas',
      show: true,
      dataset: 'ce4f3eb6-8636-4292-a75f-9ce9ef5e8334'
    },
    {
      slug: 'ifl',
      name: 'Intact Forest Landscapes',
      show: true,
      dataset: 'e9748561-4361-4267-bb9c-ef678cda0795'
    },
    {
      slug: 'biodiversity',
      name: 'Biodiversity hotspots',
      show: true,
      dataset: 'd386d1aa-e710-4b50-92a2-6bbc4f4be19a'
    },
    {
      slug: 'high-carbon',
      name: 'High carbon stocks',
      show: false,
      dataset: ''
    },
    {
      slug: 'peat',
      name: 'Peat',
      show: true,
      dataset: '949aa256-14cc-4d32-b71f-725c060fdd01'
    },
    {
      slug: 'moratorium-areas',
      name: 'Moratorium areas',
      show: true,
      dataset: '7f8b8d9e-7f38-4089-9f58-5c38351e6ff2'
    },
    {
      slug: 'primary-forests',
      name: 'Primary forests',
      show: true,
      dataset: 'ac5a509a-e9a9-4880-8107-7699dae9fdfe'
    },
    {
      slug: 'indigenous-community-forests',
      name: 'Indigenous and community forests',
      show: true,
      dataset: '7f8b8d9e-7f38-4089-9f58-5c38351e6ff2'
    }
  ];

  var AnnualTreeCoverLossView = Backbone.View.extend({
    el: '#widget-annual-tree-cover-loss',

    defaults: {
      mainDatasets: ['loss', 'wdpa']
    },

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      this.iso = params.iso;
      this.datasets = [];

      this._getList().done(this._initWidget.bind(this));
    },

    render: function() {
      this.$el.html(this.template({
        totalCoverLoss: this._getTotalCoverLoss(),
        datasets: this._getAvailableDatasets()
      }));
      this.$el.removeClass('-loading');
    },

    _getList: function() {
      var $deferred = $.Deferred();
      var $promises = [];

      _.each(DATASETS, function(item) {
        if (item.dataset) {
          var url = API + new UriTemplate(QUERY_TOTAL).fillFromObject({
            dataset: item.dataset, iso: this.iso
          });
          $promises.push(this._getTotalData(url, item.slug));
        }
      }.bind(this));

      $.when.apply($, $promises).then(function(schemas) {
        return $deferred.resolve();
      }.bind(this));

      return $deferred;
    },

    _getTotalData: function(url, slug) {
      var $deferred = $.Deferred();

      $.ajax({
        url: url,
        type: 'GET'
      })
      .done(function(res) {
        if (res.data && res.data.length > 0) {
          var value = res.data[0] && res.data[0].value ? res.data[0].value : null;

          this.datasets.push({
            slug: slug,
            value: NumbersHelper.addNumberDecimals(Math.round(value)) || ''
          });
        }
        return $deferred.resolve();
      }.bind(this))
      .fail(function(error) {
        return $deferred.reject();
      });
      return $deferred;
    },

    _getTotalCoverLoss: function() {
      var dataset = _.findWhere(this.datasets, { slug: 'loss'});
      var totalValue = 'N/A';

      if (dataset) {
        totalValue = dataset.value;
      }
      return totalValue;
    },

    _getAvailableDatasets: function() {
      var allDatasets = _.where(DATASETS, { show: true });
      var datasets = [];

      if(allDatasets) {
        _.each(allDatasets, function(dataset) {
          var datasetData = _.extend({}, dataset);
          var data = _.findWhere(this.datasets, { slug: datasetData.slug });
          var value = data && data.value ? data.value : null;

          if (value) {
            datasetData.value = value;
            datasets.push(datasetData);
          }
        }.bind(this));
      }
      return datasets;
    },

    _initWidget: function(res) {
      this.data = [
        { label:"2001", "0": 20, "1": 40},
        { label:"2002", "0": 20, "1": 40},
        { label:"2003", "0": 20, "1": 40},
        { label:"2004", "0": 20, "1": 40},
        { label:"2005", "0": 20, "1": 40},
        { label:"2006", "0": 20, "1": 40},
        { label:"2007", "0": 20, "1": 40},
        { label:"2008", "0": 20, "1": 40},
        { label:"2009", "0": 20, "1": 40},
        { label:"2010", "0": 20, "1": 40},
        { label:"2011", "0": 20, "1": 40},
        { label:"2012", "0": 20, "1": 40},
        { label:"2013", "0": 20, "1": 40}
      ];

      this.render();
      this.lineGraph = new GroupedGraphView({
        el: '#annual-tree-cover-loss-graph',
        data: this.data
      });
    }
  });
  return AnnualTreeCoverLossView;

});
