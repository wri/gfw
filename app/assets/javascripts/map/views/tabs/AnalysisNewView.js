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
  'map/views/analysis/AnalysisDrawView',
  'map/views/analysis/AnalysisCountryView',
  'map/views/analysis/AnalysisShapeView',
  'map/views/analysis/AnalysisResultsNewView',
  'map/presenters/tabs/AnalysisNewPresenter',
  'text!map/templates/tabs/analysis-new.handlebars',
  'text!map/templates/tabs/analysis-mobile-new.handlebars'
], function(_, Handlebars, amplify, chosen, turf, AnalysisDrawView, AnalysisCountryView, AnalysisShapeView, AnalysisResultsNewView, Presenter, tpl, tplMobile) {

  'use strict';

  var AnalysisNewView = Backbone.View.extend({

    el: '#analysis-tab',

    template: Handlebars.compile(tpl),
    templateMobile: Handlebars.compile(tplMobile),

    model: new (Backbone.Model.extend({
      subtab: 'default'
    })),

    events: {
      //tabs
      'click #analysis-nav li' : 'onClickSubTabs',
      'click .btn-delete-analysis' : 'onClickDelete',
    },

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

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
      this.$subTabs = this.$el.find('#analysis-nav li');
      this.$subTabsContent = this.$el.find('.analysis-tab-content');

      //spinner
      this.$spinner = this.$el.find('#analysis-spinner');
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
      this.analysisShapeView = new AnalysisShapeView(this.map,this.countries);
      this.analysisResultsNewView = new AnalysisResultsNewView(this.map,this.countries);
    },

    reRenderChildrenViews: function() {
      this.analysisDrawView.render();
      this.analysisCountryView.render();
      this.analysisShapeView.render();
    },





    /**
     * UI EVENTS
     * onClickSubTabs
     * @param  {[object]} e
     * @return {void}
     */
    onClickSubTabs: function(e){
      // Check if the subtabs don't have the -disabled class
      if (!$(e.currentTarget).hasClass('-disabled')) {
        var subtab = $(e.currentTarget).data('subtab');
        this.presenter.status.set('subtab', subtab);
      } else {
        this.presenter.publishNotification('notification-delete-analysis');
      }
    },

    onClickDelete: function(e) {
      this.presenter.publishDeleteAnalysis();
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
      // Current subtab
      this.$subTabs.removeClass('-active');
      $('#'+subtab+'-button').addClass('-active');

      // Current content subtab
      this.$subTabsContent.removeClass('-active');
      $('#'+subtab).addClass('-active');
    },


  });
  return AnalysisNewView;

});
