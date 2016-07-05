/**
 * The AnalysisResultsNewView view.
 *
 * @return AnalysisResultsNewView view
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AnalysisResultsNewPresenter',
  'text!map/templates/analysis/analysis-results.handlebars',
  'text!map/templates/analysis/analysis-results-error.handlebars'
], function(_, Handlebars, Presenter, tpl, errorTpl) {

  'use strict';

  var AnalysisResultsNewView = Backbone.View.extend({

    events: {
      'click #btn-analysis-delete': 'onClickDelete',
      'click #btn-analysis-refresh': 'onClickRefresh',
      // 'click #analysis-subscribe': '_subscribe',
      // 'click .js-dropdown-btn' :'_toggleDownloads',
      // 'click .canopy-button' : '_showCanopy',
      // 'click .advanced-analysis-button' : '_showAdvancedAnalysis',
      // 'click .close' : 'toogleAnalysis',
      // 'click #toggleIFL' : 'toogleIFL',
      // 'click #btn-analysis-refresh' : 'refreshAnalysis'
    },

    templates: {
      success: Handlebars.compile(tpl),
      error: Handlebars.compile(errorTpl),
    },

    types: [
      // GEOSTORE
      {
        el: '#analysis-draw-tab',
        type: 'draw',
      },
      
      // COUNTRY
      {
        el: '#analysis-country-tab',
        type: 'country',
      },

      // SHAPE
      {
        el: '#analysis-shape-tab',
        type: 'use',
      },
      {
        el: '#analysis-shape-tab',
        type: 'wdpaid',
      },
      
    ],

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = false;
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = true;
        },this)
      });
    },

    render: function() {
      this.setElement(this.setEl())
      this.$el.addClass('-results').html(this.templates.success(this.presenter.status.get('resource')));
    },

    renderError: function() {
      this.setElement(this.setEl())
      this.$el.addClass('-results').html(this.templates.error({
        errors: this.presenter.status.get('errors')
      }));      
    },

    cache: function() {

    },

    /**
     * UI EVENTS
     * - onClickDelete
     */
    onClickDelete: function(e) {
      e && e.preventDefault();
      this.presenter.publishDeleteAnalysis();
    },

    onClickRefresh: function(e) {
      e && e.preventDefault();
      this.presenter.publishRefreshAnalysis();
    },


    /**
     * HELPERS
     * - setEl
     */
    setEl: function() {
      return _.findWhere(this.types, { type: this.presenter.status.get('type') }).el
    },

  });

  return AnalysisResultsNewView;

});
