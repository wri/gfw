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
  'common/views/GroupedGraphView',
  'countries/views/widgets/AnnualTreeCoverLossRankingView',
  'countries/helpers/AreasCountries',
  'countries/views/widgets/modals/TreeCoverLossModal',
  'text!countries/templates/widgets/annualTreeCoverLoss.handlebars'
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
  GroupedGraphView,
  AnnualTreeCoverLossRankingView,
  AreasCountries,
  TreeCoverLossModal,
  tpl) {

  'use strict';

  var API = window.gfw.config.GFW_API_HOST_PROD;
  var QUERY_YEARLY = '/query?sql=select sum(area) as value, year as date from {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {region}';
  var QUERY_TOTAL = '/query/?sql=SELECT sum(area) as value FROM {dataset} WHERE iso=\'{iso}\' AND year >= {minYear} AND year <= {maxYear} AND thresh >= {threshValue} {region}';
  var YEARS_TOTAL = '/query/?sql=SELECT year FROM a9a32dd2-f7e1-402a-ba6f-48020fbf50ea WHERE iso=\'{iso}\' {region}';
  var THRESH_TOTAL = '/query/?sql=SELECT thresh FROM a9a32dd2-f7e1-402a-ba6f-48020fbf50ea WHERE iso=\'{iso}\' {region}';

  // Datasets
  var DATASETS = [
    {
      slug: 'loss',
      name: 'Tree cover loss',
      show: false,
      dataset: 'a9a32dd2-f7e1-402a-ba6f-48020fbf50ea',
      color: '#ff6599'
    },
    {
      slug: 'wdpa',
      name: 'Protected areas',
      show: true,
      dataset: 'ce4f3eb6-8636-4292-a75f-9ce9ef5e8334',
      color: '#2681bf'
    },
    {
      slug: 'ifl',
      name: 'Intact Forest Landscapes',
      show: true,
      dataset: 'e9748561-4361-4267-bb9c-ef678cda0795',
      color: '#2681bf'
    },
    {
      slug: 'biodiversity',
      name: 'Biodiversity hotspots',
      show: true,
      dataset: 'd386d1aa-e710-4b50-92a2-6bbc4f4be19a',
      color: '#2681bf'
    },
    {
      slug: 'high-carbon',
      name: 'High carbon stocks',
      show: false,
      dataset: '',
      color: '#2681bf'
    },
    {
      slug: 'peat',
      name: 'Peat',
      show: true,
      dataset: '949aa256-14cc-4d32-b71f-725c060fdd01',
      color: '#2681bf'
    },
    {
      slug: 'moratorium-areas',
      name: 'Moratorium areas',
      show: true,
      dataset: '7f8b8d9e-7f38-4089-9f58-5c38351e6ff2',
      color: '#2681bf'
    },
    {
      slug: 'primary-forests',
      name: 'Primary forests',
      show: true,
      dataset: 'ac5a509a-e9a9-4880-8107-7699dae9fdfe',
      color: '#2681bf'
    },
    {
      slug: 'indigenous-community-forests',
      name: 'Indigenous and community forests',
      show: true,
      dataset: '7f8b8d9e-7f38-4089-9f58-5c38351e6ff2',
      color: '#2681bf'
    }
  ];

  var AnnualTreeCoverLossView = View.extend({
    el: '#widget-annual-tree-cover-loss',

    events: {
      'click .js-dataset': '_updateChart',
      'change #annual-tree-cover-loss-start-year': '_checkDates',
      'change #annual-tree-cover-loss-end-year': '_checkDates',
      'change #annual-tree-cover-loss-thresh': '_checkThresh',
    },

    status: new (Backbone.Model.extend({
      defaults: {
        years: null,
        minYear: null,
        maxYear: null,
        thresh: null,
        threshValue: 30,
        region: 0,
        modalCreate: false,
        arrayAreas: null,
      }
    })),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          $('.back-loading').addClass('-show');
          this.datasets = [];
          this.$el.addClass('-loading');
          this.region = parseInt(value);
          this.datasets = [];
          this._getList()
          .done(this._initWidget.bind(this));
        }
      },
    ],

    defaults: {
      currentDatasets: ['loss', 'wdpa']
    },

    template: Handlebars.compile(tpl),

    initialize: function(params) {
      View.prototype.initialize.apply(this);
      this.iso = params.iso;
      this.region = params.region;
      this.currentDatasets = this.defaults.currentDatasets;
      this.datasets = [];
      this._getDates()
        .done(function() {
          this._getList();
        }.bind(this))
        .done(function() {
          this._getThresh();
        }.bind(this))
        .done(function() {
          this._initWidget();
        }.bind(this));
    },

    render: function() {
      if(!this.status.get('modalCreate')) {
        this._initModal();
        this.status.set('modalCreate', true);
      }

      this.$el.html(this.template({
        totalCoverLoss: this._getTotalCoverLoss(),
        datasets: this._getAvailableDatasets(),
        years: this.status.get('years'),
        minYear: this.status.get('minYear'),
        maxYear: this.status.get('maxYear'),
        thresh: this.status.get('thresh'),
        iso: this.iso,
        region: this.region
      }));

      $('.data-time-range').html(this.status.get('minYear')+' to '+this.status.get('maxYear'));
      $('.data-thresh').html('>'+this.status.get('threshValue'));
      $('.data-measure').html('ha');
      $('.data-source').html('GFW');
      $('.back-loading-annual-cover-loss').removeClass('-show');
      this._areasCountries('#country-aprox-annual-tree-cover-loss', this._getTotalCoverLoss());
      this.$el.removeClass('-loading');
    },

    initTreeCoverLossModal: function(datasets, years, thresh) {
      this.initTreeCoverLossModal = new TreeCoverLossModal({
        datasets: datasets,
        years: years,
        thresh: thresh,
      });
    },

    _initModal: function() {
      this.initTreeCoverLossModal(
        this._getAvailableDatasets(),
        this.status.get('years'),
        this.status.get('thresh')
      );

      this.listenTo(
        this.initTreeCoverLossModal,
        'updateDataModal',
        this.updateDataModal
      );
    },

    _areasCountries: function(container, number, random) {
      this.areasCountries = new AreasCountries({
        container: container,
        totalNumber: number,
        random: random
      });
    },

    _getDates: function() {
      var $deferred = $.Deferred();
      var datesList = [];

      var url = API + new UriTemplate(YEARS_TOTAL).fillFromObject({
        iso: this.iso,
        region: this.region === 0 ? 'GROUP BY year' : 'AND adm1 = '+this.region+' GROUP BY year, adm1',
      });

      $.ajax({
        url: url,
        type: 'GET'
      })
      .done(function(res) {
        for (var i = 0; i < res.data.length; i++) {
          datesList[i] = {
            year: res.data[i].year,
            enable: true,
          }

          if (i === 0) {
            datesList[i].selectedMin = true;
          } else if (i === res.data.length - 1) {
            datesList[i].selectedMax = true;
          }
        }
        this.status.set('years', datesList);
        this.status.set('minYear', res.data[0].year);
        this.status.set('maxYear', res.data[res.data.length - 1].year);

        return $deferred.resolve();
      }.bind(this))
      .fail(function(error) {
        return $deferred.reject();
      });
      return $deferred;
    },

    _getThresh: function() {
      var $deferred = $.Deferred();
      var threshList = [];

      var url = API + new UriTemplate(THRESH_TOTAL).fillFromObject({
        iso: this.iso,
        region: this.region === 0 ? 'GROUP BY thresh' : 'AND adm1 = '+this.region+' GROUP BY thresh, adm1',
      });

      $.ajax({
        url: url,
        type: 'GET'
      })
      .done(function(res) {
        for (var i = 0; i < res.data.length; i++) {
          threshList[i] = {
            value: res.data[i].thresh,
            selected: (res.data[i].thresh === 30)
          }
        }
        this.status.set('thresh', threshList);
        return $deferred.resolve();
      }.bind(this))
        .fail(function(error) {
          return $deferred.reject();
        });
      return $deferred;
    },

    _getList: function() {
      var $deferred = $.Deferred();
      var $promises = [];
      _.each(DATASETS, function(item) {
        if (item.dataset) {
          var url = API + new UriTemplate(QUERY_TOTAL).fillFromObject({
            dataset: item.dataset,
            iso: this.iso,
            minYear: this.status.get('minYear'),
            maxYear: this.status.get('maxYear'),
            threshValue: this.status.get('threshValue'),
            region: this.region === 0 ? 'GROUP BY iso' : 'AND adm1 = '+this.region+' GROUP BY iso, adm1',
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
      var totalValue = 0;

      for (var i = 0; i < this.data.length; i++) {
        totalValue += parseInt(this.data[i].loss);
      }

      var text = totalValue.toString();
      var commaText = text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      return commaText;
    },

    _getAvailableDatasets: function() {
      var allDatasets = _.where(DATASETS, { show: true });
      var datasets = [];
      var totalValue = parseFloat(this._getTotalCoverLoss().replace(',',''));
      if(allDatasets) {
        _.each(allDatasets, function(dataset) {
          var datasetData = _.extend({}, dataset);
          var data = _.findWhere(this.datasets, { slug: datasetData.slug });
          var value = data && data.value ? data.value : null;

          if (value) {
            this._areasCountries('#dataset-country-aprox-'+datasetData.slug, value, true);
            datasetData.value = value;
            datasetData.percentage = ((parseFloat(value) / totalValue) * 100).toFixed(2);
            datasets.push(datasetData);
          }
        }.bind(this));
      }
      return datasets;
    },

    _getGraphData: function() {
      var $deferred = $.Deferred();
      var $promises = [];
      var data = [];

      _.each(this.currentDatasets, function(item) {
        var current = _.findWhere(DATASETS, { slug: item });

        if (current.dataset) {
          var url = API + new UriTemplate(QUERY_YEARLY).fillFromObject({
            dataset: current.dataset,
            iso: this.iso,
            minYear: this.status.get('minYear'),
            maxYear: this.status.get('maxYear'),
            threshValue: this.status.get('threshValue'),
            region: this.region === 0 ? 'GROUP BY year' : 'AND adm1 = '+this.region+' GROUP BY year, adm1',
          });

          $promises.push(
            $.ajax({
              url: url,
              type: 'GET'
            })
            .done(function(res) {
              data.push({
                data: res.data,
                slug: item
              });
            })
          );
        }
      }.bind(this));

      $.when.apply($, $promises).then(function(schemas) {
        return $deferred.resolve(data);
      }.bind(this));

      return $deferred;
    },

    _initWidget: function() {
      this._getGraphData().done(function(data) {
        this._setData(data);
        this.render();
        this._renderGraph();
        this.annualRanking = new AnnualTreeCoverLossRankingView({
          iso: this.iso
        });
      }.bind(this));
    },

    _setData: function(data) {
      this.data = [];
      _.each(data, function(item) {
        _.each(item.data, function(elem) {
          var year = elem.date.toString();
          var current = _.findWhere(this.data, { label: year });
          if (!current) {
            var indicator = {
              label: year
            };
            indicator[item.slug] = elem.value;
            this.data.push(indicator);
          } else {
            current[item.slug] = elem.value;
          }
        }.bind(this));
      }.bind(this));
    },

    _getBucket: function() {
      var buckets = [];
      var selectedDatsets = _.reject(DATASETS, function(item){
        return this.currentDatasets.indexOf(item.slug) === -1;
      }.bind(this));

      selectedDatsets.forEach(function(dataset) {
        buckets[dataset.slug] = dataset.color;
      });

      return buckets;
    },

    _renderGraph: function() {
      this.lineGraph = new GroupedGraphView({
        el: '#annual-tree-cover-loss-graph',
        data: this.data,
        bucket: this._getBucket(),
        defaultIndicator: this.currentDatasets[0]
      });
    },

    _updateChart: function(ev) {
      var slug = $(ev.currentTarget).data('slug');
      this.currentDatasets.pop();
      this.currentDatasets.push(slug);

      this._getGraphData().done(function(data) {
        this._setData(data);
        this.lineGraph.updateChart({
          data: this.data,
          bucket: this._getBucket()
        });
      }.bind(this));
    },

    _changeDates: function() {
      var datesList = [];

      for (var i = 0; i < this.status.get('years').length; i++) {
        datesList[i] = {
          year: this.status.get('years')[i].year,
          enable: this.status.get('years')[i].year >= this.status.get('minYear'),
        }

        if (this.status.get('years')[i].year === this.status.get('minYear')) {
          datesList[i].selectedMin = true;
        } else if (this.status.get('years')[i].year === this.status.get('maxYear')) {
          datesList[i].selectedMax = true;
        }
      }

      this.status.set('years', datesList);
    },

    _checkDates: function(e) {
      this.datasets = [];
      if (e === 'modal') {
        var minDate = $('#annual-tree-cover-loss-start-year-modal').val();
        var maxDate = $('#annual-tree-cover-loss-end-year-modal').val();
        this.status.set('minYear', minDate);
        this.status.set('maxYear', maxDate);
        this._changeDates();
      } else {
        $('.back-loading-annual-cover-loss').addClass('-show');
        this.$el.addClass('-loading');
        var idTarget = e.currentTarget.id;
        var value = parseInt(e.currentTarget.value);

        if (idTarget === 'annual-tree-cover-loss-start-year') {
          this.status.set('minYear', value);
          this._changeDates(value);
        }

        if (idTarget === 'annual-tree-cover-loss-end-year') {
          this.status.set('maxYear', value);
          this._changeDates(value);
        }
      }
      this._getList()
      .done(this._updateData.bind(this));
    },

    _checkThresh: function(e) {
      this.datasets = [];
      $('.back-loading-annual-cover-loss').addClass('-show');
      this.$el.addClass('-loading');
      var threshList = [];
      var value = '';
      if (e === 'modal') {
        value = parseInt($('#thresh-modal').val());
      } else {
        value = parseInt(e.currentTarget.value);
      }
      this.status.set('threshValue', value);
      for (var i = 0; i < this.status.get('thresh').length; i++) {
        threshList[i] = {
          value: this.status.get('thresh')[i].value,
          selected: this.status.get('threshValue') === this.status.get('thresh')[i].value
        }
      }
      this.status.set('thresh', threshList);
      this._getList()
      .done(this._initWidget.bind(this));
    },

    _updateData: function () {
      this._initWidget();
      mps.publish('AnnualTreeCoverLoss/update');
    }
  });
  return AnnualTreeCoverLossView;

});
