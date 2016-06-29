/**
 * The AnalysisNewView selector view.
 *
 * @return AnalysisNewView instance (extends Backbone.View).
 */
define([
  'underscore', 
  'handlebars', 
  'amplify', 
  'chosen', 
  'turf', 
  'mps',
  'map/views/analysis/AnalysisDrawView',
  'map/views/analysis/AnalysisCountryView',
  'map/views/analysis/AnalysisShapeView',
  'map/presenters/tabs/AnalysisNewPresenter',
  'text!map/templates/tabs/analysis-new.handlebars',
  'text!map/templates/tabs/analysis-mobile-new.handlebars'
], function(_, Handlebars, amplify, chosen, turf, mps, AnalysisDrawView, AnalysisCountryView, AnalysisShapeView, Presenter, tpl, tplMobile) {

  'use strict';

  var AnalysisNewView = Backbone.View.extend({

    el: '#analysis-tab',

    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    model: new (Backbone.Model.extend({
      tab: 'default'
    })),

    events: {
      //tabs
      'click #analysis-nav li' : 'onClickTabs',
    },

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);
      this.listeners();

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = false;
          this.render();
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = true;
          this.render();
        },this)
      });
    },

    cache: function(){
      this.$tabButton = $('#analysis-tab-button');
      //tabs
      this.$tabs = $('#analysis-nav li');
      this.$tabsContent = $('.analysis-tab-content');
    },

    listeners: function() {
      this.model.on('change:tab', this.changeTab.bind(this));
    },

    render: function(){
      var template = (this.mobile) ? this.templateMobile : this.template;
      this.$el.html(template());
      this.cache();
      
      this.initChildrenViews();
    },

    initChildrenViews: function() {
      this.analysisDrawView = new AnalysisDrawView(this.map,this.countries);
      this.analysisCountryView = new AnalysisCountryView(this.map,this.countries);
    },





    /**
     * UI EVENTS
     * onClickTabs
     * @param  {[object]} e
     * @return {void}
     */
    onClickTabs: function(e){
      // Check if the tabs don't have the -disabled class
      if (!$(e.currentTarget).hasClass('-disabled')) {
        var tab = $(e.currentTarget).data('tab');
        this.model.set('tab', tab);
      } else {
        this.presenter.notificate('notification-delete-analysis');
      }
    },





    /**
     * UI LISTENERS
     * changeTab
     * @return {void}
     */
    changeTab: function() {
      var tab = this.model.get('tab');
      // Current tab
      this.$tabs.removeClass('-active');
      $('#'+tab+'-button').addClass('-active');

      // Current content tab
      this.$tabsContent.removeClass('-active');
      $('#'+tab).addClass('-active');
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

  });
  return AnalysisNewView;

});
