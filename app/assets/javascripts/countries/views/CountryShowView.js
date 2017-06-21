define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'core/View',
  'mps',
  'services/CountryService',
  'views/ShareView',
  'views/SourceWindowView',
  'countries/views/CountryHeaderView',
  'countries/views/widgets/TreeCoverView',
  'countries/views/widgets/TreeCoverLossRankingView',
  'countries/views/widgets/AnnualTreeCoverLossView',
  'countries/views/widgets/TreeCoverGainView',
  'countries/views/widgets/TreeCoverReforestationView',
  'countries/views/widgets/TreeCoverLossView',
  'countries/views/widgets/TreeCoverLossAlertsView',
  'countries/views/widgets/FiresAlertsView',
  'countries/views/widgets/NearRealTimeAlertsView',
  'countries/views/widgets/MapCountry',
  'countries/helpers/StickyMap',
  'countries/helpers/SwitchOptions',
  'text!countries/templates/countryDashboard.handlebars',
  'text!countries/templates/countryTooltip.handlebars'
], function($,
  Backbone,
  _,
  Handlebars,
  View,
  mps,
  CountryService,
  ShareView,
  SourceWindowView,
  CountryHeaderView,
  TreeCoverView,
  TreeCoverLossRankingView,
  AnnualTreeCoverLossView,
  TreeCoverGainView,
  TreeCoverReforestationView,
  TreeCoverLossView,
  TreeCoverLossAlertsView,
  FiresAlertsView,
  NearRealTimeAlertsView,
  MapCountry,
  StickyMap,
  SwitchOptions,
  tpl,
  tplTooltip) {

  'use strict';

  var CountryShowView = View.extend({
    el: '#countryShowView',

    events: {
      'click .summary-option' : 'changeSection',
      'click .js-share-link' : 'shareOpen',
    },

    template: Handlebars.compile(tpl),
    templateTooltip: Handlebars.compile(tplTooltip),

    _subscriptions:[
      {
        'Regions/update': function(value) {
          this.region = value;
          if(this.region != 0){
            $('#first-option-region-select').html('The whole country');
            this.getDataRegions().then(function(results) {
              this.data = results;
            }.bind(this));
          } else {
            $('#first-option-region-select').html('Select a jurisdiction');
            this.getData(false).then(function(results) {
              this.data = results;
            }.bind(this));
          }
        }
      },
    ],

    initialize: function(params) {
      $('html,body').scrollTop(0);
      View.prototype.initialize.apply(this);
      this.region = params.region;
      this.iso = params.iso;
      this.modules = {
        snapshot: [],
        treeCoverLoss: [],
        treeCoverGain: [],
        treeCoverLossAlerts: [],
        firesAlerts: [],
      };

      this.cache();
      this.render();

      if(this.region != 0){
        this.getDataRegions().then(function(results) {
          this.data = results;
          this.start();
        }.bind(this));
      } else {
        this.getData(false).then(function(results) {
          this.data = results;
          this.start();
        }.bind(this));
      }
      new SourceWindowView();
    },

    cache: function() {
      this.$dashboard = this.$el.find('#countryDashboard');
    },

    getData: function(showArea) {
      return CountryService.showCountry(
        {
           iso: this.iso,
           showArea: showArea
         }
       );
    },

    getDataRegions: function() {
      return CountryService.showRegion({ iso: this.iso, region: this.region });
    },

    render: function() {
      this.$dashboard.html(this.template({}));
      $('body').append(this.templateTooltip({}));
      this.$el.removeClass('-loading');
      this.$dashboard.removeClass('-loading');
    },

    start: function() {
      this.initHeader();
      this.initSnapshot();
      this.initTreeCoverLoss();
      this.initCoverGain();
      this.initCoverLossAlerts();
      this.initFiresAlerts();
      this.initMapCountry();
      this.initStickyMap();
      this.listenTo(
         this.header,
         'updateUrl',
         this.updateUrl
      );
      this.initSwitchOptions();
      this.$el.find('.widgets > .content').removeClass('-loading');
    },

    initHeader: function() {
      this.header = new CountryHeaderView({
        iso: this.iso,
        region: this.region,
        countryData: this.data
      });
    },

    initStickyMap: function() {
      this.stickyMap = new StickyMap();
    },

    initSwitchOptions: function() {
      this.switchOptions = new SwitchOptions();
    },

    initMapCountry: function() {
      this.mapCountry = new MapCountry(
        {
          iso: this.iso,
          countryData: this.data,
          region: this.region > 0,
        },
        {
          modules: this.modules
        }
      );
    },

    initSnapshot: function() {
      this.modules.snapshot.push(new TreeCoverView({
        iso: this.iso,
        region: this.region,
      }));

      this.modules.snapshot.push(new TreeCoverLossRankingView({
        iso: this.iso,
        region: this.region,
      }));

      this.modules.snapshot.push(new TreeCoverLossView({
        iso: this.iso,
        region: this.region,
        countryData: this.data
      }));

      this.modules.snapshot.push(new NearRealTimeAlertsView({
        iso: this.iso,
        region: this.region,
      }));
    },

    initTreeCoverLoss: function() {
      this.modules.treeCoverLoss.push(new AnnualTreeCoverLossView({
        iso: this.iso,
        region: this.region,
      }));
    },

    initCoverGain: function() {
      this.modules.treeCoverGain.push(new TreeCoverGainView({
        iso: this.iso,
        region: this.region,
      }));
      this.modules.treeCoverGain.push(new TreeCoverReforestationView({
        iso: this.iso,
        region: this.region,
      }));
    },

    initCoverLossAlerts: function() {
      this.modules.treeCoverLossAlerts.push(new TreeCoverLossAlertsView({
        iso: this.iso,
        region: this.region,
        latitude: JSON.parse(this.data.centroid).coordinates[0],
        longitude: JSON.parse(this.data.centroid).coordinates[1]
      }));
    },

    initFiresAlerts: function() {
      this.modules.firesAlerts.push(new FiresAlertsView({
        iso: this.iso,
        region: this.region,
      }));
    },


    updateUrl: function() {
      this.trigger('updateUrl');
    },

    changeSection: function(e) {
      var data = $(e.target).data('value');
      $('html, body').animate({
        scrollTop: $('#'+data).offset().top
      }, 1000);
    },

    shareOpen: function(event){
      var shareView = new ShareView().share(event);
      $('body').append(shareView.el);
    },

  });
  return CountryShowView;

});
