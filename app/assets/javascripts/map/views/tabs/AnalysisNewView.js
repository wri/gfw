/* eslint-disable */
/**
 * The AnalysisNewView selector view.
 *
 * @return AnalysisNewView instance (extends Backbone.View).
 */
define(
  [
    'underscore',
    'handlebars',
    'amplify',
    'chosen',
    'turf',
    'enquire',
    'views/ShareView',
    'helpers/gaEventsHelper',
    'map/views/analysis/AnalysisDrawView',
    'map/views/analysis/AnalysisCountryView',
    'map/views/analysis/AnalysisShapeView',
    'map/views/analysis/AnalysisResultsNewView',
    'map/views/analysis/AnalysisDownloadView',
    'map/presenters/tabs/AnalysisNewPresenter',
    'text!map/templates/tabs/analysis-new.handlebars',
    'text!map/templates/tabs/analysis-mobile-new.handlebars'
  ],
  function(
    _,
    Handlebars,
    amplify,
    chosen,
    turf,
    enquire,
    ShareView,
    GaEventsHelper,
    AnalysisDrawView,
    AnalysisCountryView,
    AnalysisShapeView,
    AnalysisResultsNewView,
    AnalysisDownloadView,
    Presenter,
    tpl,
    tplMobile
  ) {
    'use strict';

    var AnalysisNewView = Backbone.View.extend({
      el: '#analysis-tab',

      template: Handlebars.compile(tpl),
      templateMobile: Handlebars.compile(tplMobile),

      events: {
        //tabs
        'click #analysis-nav li': 'onClickSubTabs',
        'click .btn-analysis-delete': 'onClickDelete',
        'click .btn-analysis-refresh': 'onClickRefresh',
        'click .btn-analysis-subscribe': 'onClickSubscribe',
        'click .btn-analysis-canopy': 'onClickCanopy',
        'click .btn-analysis-share': 'onClickShare',
        'click .btn-analysis-advanced': 'onClickAdvanced',
        'click .btn-analysis-downloads': 'onClickDownloads',
        'click .btn-analysis-toggle': 'onClickToggle'
      },

      initialize: function(map, countries) {
        this.map = map;
        this.countries = countries;
        this.presenter = new Presenter(this);

        enquire.register(
          'screen and (min-width:' + window.gfw.config.GFW_MOBILE + 'px)',
          {
            match: _.bind(function() {
              this.mobile = false;
              this.render();
            }, this)
          }
        );
        enquire.register(
          'screen and (max-width:' + window.gfw.config.GFW_MOBILE + 'px)',
          {
            match: _.bind(function() {
              this.mobile = true;
              this.render();
            }, this)
          }
        );
      },

      cache: function() {
        this.$tabButton = $('#analysis-tab-button');

        //tabs
        this.$subTabs = this.$el.find('#analysis-nav li');
        this.$subTabsContent = this.$el.find('.analysis-tab-content');

        //spinner
        this.$spinner = this.$el.find('#analysis-spinner');
      },

      render: function() {
        var template = this.mobile ? this.templateMobile : this.template;
        this.$el.html(template());
        this.cache();

        this.initChildrenViews();
      },

      initChildrenViews: function() {
        this.analysisDrawView = new AnalysisDrawView(this.map, this.countries);
        this.analysisCountryView = new AnalysisCountryView(
          this.map,
          this.countries
        );
        this.analysisShapeView = new AnalysisShapeView(
          this.map,
          this.countries
        );
        this.analysisResultsNewView = new AnalysisResultsNewView(
          this.map,
          this.countries
        );
        this.analysisDownloadView = new AnalysisDownloadView(
          this.map,
          this.countries
        );
      },

      reRenderChildrenViews: function() {
        this.analysisDrawView.render();
        this.analysisCountryView.render();
        this.analysisShapeView.render();
      },

      /**
       * UI EVENTS
       * - onClickSubTabs
       * - onClickDelete
       * - onClickRefresh
       * - onClickCanopy
       * - onClickSubscribe
       * - onClickDownloads
       * @param  {[object]} e
       */
      onClickSubTabs: function(e) {
        // Check if the subtabs don't have the -disabled class
        if (!$(e.currentTarget).hasClass('-disabled')) {
          var subtab = $(e.currentTarget).data('subtab');
          this.presenter.status.set('subtab', subtab);
        } else {
          this.presenter.publishNotification('notification-delete-analysis');
        }
      },

      onClickDelete: function(e) {
        e && e.preventDefault();
        this.presenter.publishDeleteAnalysis();
      },

      onClickRefresh: function(e) {
        e && e.preventDefault();
        this.presenter.publishRefreshAnalysis();
      },

      onClickCanopy: function(e) {
        e && e.preventDefault();
        this.presenter.publishCanopyAnalysis();
      },

      onClickSubscribe: function(e) {
        e && e.preventDefault() && e.stopPropagation();
        if (this.presenter.status.get('enabledSubscription')) {
          this.presenter.publishSubscribtion();

          var params = this.presenter.status.toJSON();
          var eventData = GaEventsHelper.getSubscription(params);
          ga(
            'send',
            'event',
            'Subscribe',
            'Click right menu to subscribe',
            eventData
          );
        }
      },

      onClickShare: function(e) {
        e && e.preventDefault() && e.stopPropagation();
        var shareView = new ShareView().share(e);
        $('body').append(shareView.el);
      },

      onClickAdvanced: function(e) {
        e && e.preventDefault() && e.stopPropagation();
      },

      onClickDownloads: function(e) {
        var $current = $(e.currentTarget),
          is_active = $current.hasClass('-active'),
          is_disabled = $current.hasClass('-disabled');

        if (!is_disabled) {
          this.$el
            .find('.btn-analysis-downloads')
            .toggleClass('-active', !is_active);
          this.presenter.publishDownloadsAnalysis(!is_active);
        } else {
          this.presenter.publishNotification('notification-download-analysis');
        }
      },

      onClickToggle: function(e) {
        e && e.preventDefault() && e.stopPropagation();
        this.presenter.publishMobileActive(
          !this.presenter.status.get('mobileActive')
        );
      },

      /**
       * PRESENTER ACTIONS
       *
       * loadRegions
       * @return {void}
       */
      toggleEnabledButtons: function() {
        var enabled = this.presenter.status.get('enabled');
        // Toggle disabled class
        this.$tabButton.toggleClass('disabled', !enabled);
      },

      toggleSpinner: function() {
        var active = this.presenter.status.get('spinner');
        this.$spinner.toggleClass('-active', active);
      },

      toggleSubtab: function() {
        var subtab = this.presenter.status.get('subtab');
        this.$subTabs.toggleClass(
          '-disabled',
          this.presenter.status.get('active')
        );

        // Current subtab
        this.$subTabs.removeClass('-active');
        $('#' + subtab + '-button')
          .removeClass('-disabled')
          .addClass('-active');

        // Current content subtab
        this.$subTabsContent.removeClass('-active');
        $('#' + subtab).addClass('-active');
      },

      toggleMobile: function() {
        this.$el.toggleClass(
          '-active',
          this.presenter.status.get('mobileActive')
        );
      }
    });
    return AnalysisNewView;
  }
);
