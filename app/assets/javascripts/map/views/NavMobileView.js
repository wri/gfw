/**
 * The NavMobileView view.
 *
 * @return NavMobileView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/presenters/NavMobilePresenter',
  'text!map/templates/navmobile.handlebars'
], function(_, Handlebars, enquire, Presenter, tpl) {

  'use strict';

  var NavMobileView = Backbone.View.extend({

    el: '#module-navmobile',

    events: {
      'click .toggleMobileViews' : 'showView',
      'click #country-navmobile-btn' : 'toggleCountriesTab'
    },

    template: Handlebars.compile(tpl),

    initialize: function() {
      // We should refactor this view...
      // It has a lot of hacks without any explanation (i.e.: line 58 ¿¿?¿?¿?)
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.presenter = new Presenter(this);
          this.render(true);
        },this)
      });
      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.render(false);
        },this)
      });

    },

    render: function (bool) {
      if(bool){
        this.$el.html(this.template());
        this.cacheVars();
      } else {
        this.$el.html('');
      }
      this.$el.find('.timeline-mobile-call-to-action a').attr('href',location.href.replace('/embed',''));
    },

    cacheVars: function(){
      this.$toggleMobileViews = this.$el.find('.toggleMobileViews');
      this.$timelineBtn = $('#timeline-navmobile-btn');
      this.$layersBtn = $('#layers-navmobile-btn');
      this.$analysisBtn = $('#analysis-navmobile-btn');
      this.$countryBtn = $('#country-navmobile-btn');
    },

    showView: function(e){
      e && e.preventDefault();
      if (!$(e.currentTarget).hasClass('disabled')) {
        if (!$(e.currentTarget).hasClass('active')) {
          this.presenter.toggleCurrentTab($(e.currentTarget).data('tab'), true);
        }else{
          this.presenter.toggleCurrentTab($(e.currentTarget).data('tab'), false);
        }
      }
    },

    // Reset buttons
    resetBtns: function () {
      this.$toggleMobileViews.removeClass('active');
    },

    // Timeline
    toogleTimeline: function(toggle){
      this.resetBtns();
      this.$timelineBtn.toggleClass('active', toggle);
      this.$countryBtn.toggleClass('timeline-open',toggle);
    },

    enableTimelineBtn: function(toggle){
      this.$timelineBtn.toggleClass('disabled',toggle);
    },


    // Analysis
    toogleAnalysis: function(toggle){
      this.resetBtns();
      this.$analysisBtn.toggleClass('active', toggle);
    },

    enableAnalysisBtn: function(toggle){
      this.$analysisBtn.toggleClass('disabled',toggle);
    },

    currentAnalysisBtn: function(current) {
      this.$analysisBtn.toggleClass('current', current);
    },


    // Country
    toogleCountry: function (name) {
      this.$countryBtn.toggleClass('active', !!name);
      this.$countryBtn.find('.name').text(name);
    },

    toggleCountriesTab: function(){
      this.presenter.openCountriesTab();
    },

  });

  return NavMobileView;

});
