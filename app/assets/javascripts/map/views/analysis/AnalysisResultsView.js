/**
 * The Analysis view.
 *
 * @return Analysis view
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'map/presenters/analysis/AnalysisResultsPresenter',
  'map/views/analysis/AdvancedAnalysisView',
  'views/ShareView',
  'text!map/templates/analysis/analysisResults.handlebars',
  'text!map/templates/analysis/analysisResultsFailure.handlebars',
  'text!map/templates/analysis/analysisResultsFailureAPI.handlebars',
], function(_, Handlebars, enquire, Presenter, AdvancedAnalysisView, ShareView, tpl, failureTpl, failureAPITpl) {

  'use strict';

  var AnalysisResultsModel = Backbone.Model.extend({
    defaults: {
      boxHidden: true
    }
  });

  var AnalysisResultsView = Backbone.View.extend({

    el: '#analysis-result',

    template: Handlebars.compile(tpl),

    templates: {
      failure: Handlebars.compile(failureTpl),
      failureAPI: Handlebars.compile(failureAPITpl),
    },

    events:{
      'click #analysis-delete': '_deleteAnalysis',
      'click #analysis-subscribe': '_subscribe',
      'click #analysis-share' : '_share',
      'click .js-dropdown-btn' :'_toggleDownloads',
      'click .canopy-button' : '_showCanopy',
      'click .advanced-analysis-button' : '_showAdvancedAnalysis',
      'click .close' : 'toogleAnalysis',
      'click #toggleIFL' : 'toogleIFL',
      'click #btn-analysis-refresh' : 'refreshAnalysis',
    },

    initialize: function() {
      this.model = new AnalysisResultsModel();
      this.presenter = new Presenter(this);
      this.$resultsHide = $('.results-hide');
      this.$tab = $('#analysis-tab');
      this.$analysisTab = $('#analysis-nav');
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

    _cacheSelector: function() {
      this.$subscribeButton = $('#analysis-subscribe');
      this.$switchIFLabels = $('.ifl-switch .label');
    },

    /**
     * Render analysis results.
     *
     * @param  {Object} params Analysis html params
     */
    renderAnalysis: function(params) {
      this.setParams(params);
      this.$el.html(this.template(this.params)).removeClass('hidden');
      this._cacheSelector();
      this.$resultsHide.addClass('hidden');
      this.presenter.toggleSubscribeButton();
      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + this.params.layer.title);
    },

    /**
     * Render failure analysis request message.
     */
    renderFailure: function() {
      this.$el.html(this.templates.failure()).removeClass('hidden');
      this._cacheSelector();
      this.$resultsHide.addClass('hidden');
    },

    /**
     * Render failure analysis on API request message.
     */
    renderFailureOnApi: function() {
      this.$el.html(this.templates.failureAPI()).removeClass('hidden');
      this._cacheSelector();
      this.$resultsHide.addClass('hidden');
    },

    setParams: function(params){
      this.params = params;
      this.params.warning_text = (this.$analysisTab.find('li.active').data('analysis') === 'draw-tab');
      this.params.warning_extent_text = this.presenter.status.get('loss_gain_and_extent');
      this.params.downloadVisible = ((this.params.loss || this.params.forestgain) && this.mobile) ? false : true;
      this.params.url = this.setDownloadLink(params.layer.slug);
    },

    _deleteAnalysis: function() {
      this.$resultsHide.removeClass('hidden');
      this.$el.addClass('hidden');
      this.presenter.deleteAnalysis();
      ga('send', 'event', 'Map', 'Delete-Analysis', 'Layer: ' + this.params.layer.title);
    },

    _deleteAnalysisView: function(){
      this.$resultsHide.removeClass('hidden');
      this.$el.addClass('hidden');
    },

    _subscribe: function(event) {
      event.preventDefault();
      event.stopPropagation();

      if ($(event.target).hasClass('disabled')) { return; }

      this.presenter.subscribeAnalysis();
      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + this.params.layer.title);
    },

    _share: function(e) {
      var shareView = new ShareView().share(e);
      $('body').append(shareView.el);
    },

    _toggleDownloads: function(e) {
      if (e.target.tagName.toLowerCase() !== 'a') {
        $(e.currentTarget).toggleClass('-active');
        $(e.currentTarget).find('.js-dropdown').toggleClass('-active')
        ga('send', 'event', 'Map', 'Download', 'Downloads-' + 'Layer: ' + this.params.layer.title);
      };
    },

    _showCanopy: function(e){
      e && e.preventDefault();
      this.presenter.showCanopy();
    },

    _showAdvancedAnalysis: function(e) {
      e && e.preventDefault();

      var view = new AdvancedAnalysisView({
        resource: this.presenter.status.get('resource')});
      $('#advanced-analysis').html(view.render().el);
    },

    setDownloadLink: function(layer){
      var links = {
        'loss' : 'http://data.globalforestwatch.org/datasets/93ecbfa0542c42fdaa8454fa42a6cc27',
        'forestgain' : 'http://data.globalforestwatch.org/datasets/6c9f379a362e4926ad24b58444f4ba67',
        'forma' : 'http://data.globalforestwatch.org/datasets/39a527e300ff4146962a3c74ec476f64',
        'terrailoss' : 'http://www.terra-i.org/terra-i/data.html',
        'imazon' : 'http://www.imazongeo.org.br/doc/downloads.php',
      }
      return links[layer];
    },

    toggleSubscribeButton: function(toggle) {
      this.$subscribeButton.toggleClass('disabled', toggle);
    },

    toogleAnalysis: function(to){
      this.$el.toggleClass('active', to);
    },

    toogleIFL: function(e){
      $(e.currentTarget).find('.onoffswitch').toggleClass('checked');
      this.$switchIFLabels.toggleClass('checked')
    },

    refreshAnalysis: function() {
      this.presenter.refreshAnalysis();
    }

  });

  return AnalysisResultsView;

});
