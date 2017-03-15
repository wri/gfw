/**
 * The TabsView view.
 *
 * @return TabsView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'd3',
  'mps',
  'enquire',
  'map/presenters/TabsPresenter',
  'map/views/tabs/AnalysisNewView',
  'map/views/tabs/CountriesView',
  'map/views/tabs/BasemapsView',
  'map/views/tabs/HighresolutionView',
  'map/views/tabs/SubscribeView',
  'views/ShareView',
  'text!map/templates/tabs.handlebars',
  'text!map/templates/tabs-mobile.handlebars'
], function(_, Handlebars, d3, mps, enquire, Presenter, AnalysisNewView, CountriesView, BasemapsView, HighresolutionView, SubscribeView, ShareView, tpl, tplMobile) {

  'use strict';

  var TabsView = Backbone.View.extend({

    el: '#module-tabs',

    events: {
      'click .tab' : 'toggleTabs',
      'click .share-mobile' : 'toggleShareMobile',
      'click .tab-mobile' : 'toggleTabsMobile',
      'click .tab-mobile-close' : 'hideTabsMobile',
      'click .tab-mobile-reset-country' : 'resetCountry',
      'click li' : 'checkForestChangeAvailability'
    },

    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);
      // Render
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render();
          this.cacheVars();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.renderMobile();
          this.cacheVars();
        },this)
      });
      // this.setListeners();
    },

    cacheVars: function(){
      this.$tabs = this.$el.find('.tab');
      this.$tabList = this.$el.find('.tab-list');
      this.$tabMobileButtons = $('.tab-mobile');
      this.$tabMobileBackButtons = $('.tab-mobile-back');
      this.$settingsTabButton = $('#settings-tab-button');
      this.$tabsMobileContent = this.$el.find('.tab-mobile-content');
      this.$tabsContent = this.$el.find('.tab-content');
      this.$container = this.$el.find('.content');
    },

    // setListeners: function(){

    // },

    render: function(){
      this.$el.html(this.template());
      this.$el.removeClass('hide');
      this.initCustomViews();
    },

    renderMobile: function(){
      this.$el.html(this.templateMobile());
      this.$el.removeClass('hide');
      this.initCustomViews();
    },

    initCustomViews: function(){
      new AnalysisNewView(this.map, this.countries);
      new CountriesView(this.map, this.countries);
      new BasemapsView(this.map, this.countries);
      new HighresolutionView(this.map, this.countries);
      new SubscribeView(this.map, this.countries);
    },

    toggleTab: function(id, active) {
      var id = id,
          active = active,
          $tabButton = this.$tabList.find('[data-tab="'+id+'"]'),
          is_active = $tabButton.hasClass('active');

      // If it's already closed or opened we don't need to do anything
      if (active != is_active) {
        if (active) {
          // container
          this.$container.toggleClass('active', active);

          // tabs
          this.$tabs.removeClass('active').addClass('inactive');
          $tabButton.toggleClass('inactive', !active).toggleClass('active', active);

          // tabs content
          this.$tabsContent.removeClass('selected');
          this.$el.find('#'+ id).toggleClass('selected', active);

        } else {
          this.$container.removeClass('active')
          this.$tabs.removeClass('inactive active');
          this.$tabsContent.removeClass('selected');
        }
      }


    },

    toggleTabs: function(e){
      if ($(e.currentTarget).hasClass('active')) {
        // Close all tabs and reset tabs styles
        this.$container.removeClass('active')
        this.$tabs.removeClass('inactive active');
        this.$tabsContent.removeClass('selected');
      }else{
        if (!$(e.currentTarget).hasClass('disabled')) {
          // Open current tab
          var id = $(e.currentTarget).data('tab');
          this.$container.addClass('active');

          // tabs
          this.$tabs.removeClass('active').addClass('inactive');
          $(e.currentTarget).removeClass('inactive').addClass('active');

          // tabs content
          this.$tabsContent.removeClass('selected');
          $('#'+ id).addClass('selected');

          //publish open tab
          this.presenter.onTabOpen(id);
        }
      }
    },

    toggleShareMobile: function(event){
      var shareView = new ShareView().share(event);
      $('body').append(shareView.el);
    },

    toggleTabsMobile: function(e){
      var tab = $(e.currentTarget).data('tab');
      var $tab = $('#'+tab);
      if (tab) {
        this.$tabMobileBackButtons.data('tab', 'settings-tab-mobile');
        if ($tab.hasClass('active') || $(e.currentTarget).hasClass('active')) {
          this.$tabMobileButtons.removeClass('active');
          this.$tabsMobileContent.removeClass('active');
        }else{
          this.$tabMobileButtons.removeClass('active');
          this.$settingsTabButton.addClass('active');
          this.$tabsMobileContent.removeClass('active');
          $tab.addClass('active');
        }
      }else{
        this.hideTabsMobile();
      }
    },

    hideTabsMobile: function(){
      this.$settingsTabButton.removeClass('active');
      this.$tabMobileButtons.removeClass('active');
      this.$tabsMobileContent.removeClass('active');
      this.presenter.onTabMobileClose();
    },

    resetCountry: function() {
      this.presenter.publishIso({
        country: null,
        region: null
      });
    },

    toggleMobileLayers: function(){
      var $tab = $('#settings-tab-mobile');
      // this.$tabMobileButtons.removeClass('active');
      // this.$settingsTabButton.addClass('active');
      // this.$tabsMobileContent.removeClass('active');
      $tab.addClass('active');
    },

    openTab: function(id, backbutton){
      if (!$(id).hasClass('active')) {
        $(id).trigger('click');

        // To control back buttons
        // if (backbutton) { $(id+'-back').data('tab', null);}
      }
    },

    checkForestChangeAvailability: function(e) {
      // If the user clicks the analysis icon and having this LI item an EVENT POINTER NONE style attribute, what the user actually clicks is the UL
      if ($(e.currentTarget).data('tab') === 'analysis-tab' && $('#analysis-tab-button').hasClass('disabled')) {
        mps.publish('Notification/open', ['notification-select-forest-change-layer']);
      }
    }
  });

  return TabsView;

});
