/**
 * The Analysis view.
 *
 * @return Analysis view
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AnalysisResultsPresenter',
  'text!map/templates/analysis/analysisResults.handlebars',
  'text!map/templates/analysis/analysisResultsFailure.handlebars',
  'text!map/templates/analysis/analysisResultsUnavailable.handlebars',
  'text!map/templates/analysis/analysisResultsLoading.handlebars',
], function(_, Handlebars, Presenter, tpl, failureTpl, unavailableTpl, loadingTpl) {

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
      unavailable: Handlebars.compile(unavailableTpl),
      loading: Handlebars.compile(loadingTpl)
    },

    events:{
      'click #analysis-delete': '_deleteAnalysis',
      'click #analysis-subscribe': '_subscribe',
      'click .dropdown-button' :'_toggleDownloads',
      'click .canopy-button' : '_showCanopy',
      'click .close' : 'toogleAnalysis',
    },

    initialize: function() {
      this.model = new AnalysisResultsModel();
      this.presenter = new Presenter(this);
      this.$resultsHide = $('.results-hide');
      this.$tab = $('#analysis-tab');
      this.$analysisTab = $('#analysis-nav');
    },

    _cacheSelector: function() {
      this.$downloadDropdown = $('.download-dropdown');
      this.$subscribeButton = $('#analysis-subscribe');
    },

    /**
     * Render analysis results.
     *
     * @param  {Object} params Analysis html params
     */
    renderAnalysis: function(params) {
      this.params = params;
      this.params.warning_text = (this.$analysisTab.find('li.active').data('analysis') === 'draw-tab');
      this.params.url = this.setDownloadLink(params.layer.slug);
      this.$el.html(this.template(this.params)).removeClass('hidden');
      this._cacheSelector();
      this.$resultsHide.addClass('hidden');
      ga('send', 'event', 'Map', 'Analysis', 'Layer: ' + this.params.layer.title);
    },

    /**
     * Render loading analysis message.
     */
    renderLoading: function() {
      //this._update(this.templates.loading());
    },

    renderUnavailable: function() {
      //this._update(this.templates.unavailable());
    },

    toggleSubscribeButton: function(toggle) {
      this.$subscribeButton.toggleClass('disabled', toggle);
    },

    /**
     * Render failure analysis request message.
     */
    renderFailure: function() {
      // this._update(this.templates.failure());
      this.$el.html(this.templates.failure()).removeClass('hidden');
      this._cacheSelector();
      this.$resultsHide.addClass('hidden');
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

    _subscribe: function() {
      this.presenter.subscribeAnalysis();
      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + this.params.layer.title);
    },

    _toggleDownloads: function(e) {
      e && e.preventDefault();
      this.$downloadDropdown.toggleClass('hidden');
      ga('send', 'event', 'Map', 'Download', 'Downloads-' + 'Layer: ' + this.params.layer.title);
    },

    _showCanopy: function(e){
      e && e.preventDefault();
      this.presenter.showCanopy();
    },

    setDownloadLink: function(layer){
      var links = {
        'loss' : 'http://data.globalforestwatch.org/datasets/93ecbfa0542c42fdaa8454fa42a6cc27',
        'forestgain' : 'http://data.globalforestwatch.org/datasets/6c9f379a362e4926ad24b58444f4ba67',
        'forma' : 'http://data.globalforestwatch.org/datasets/39a527e300ff4146962a3c74ec476f64',
        'terrailoss' : 'http://www.terra-i.org/terra-i/data.html',
        'imazon' : 'http://www.imazongeo.org.br/doc/downloads.php',
        'fires' : 'https://earthdata.nasa.gov/data/near-real-time-data/firms',
        'modis' : 'http://data.globalforestwatch.org/datasets/e7bfe60d90ea4e5aa808eba4723ad3f8_0'

      }
      return links[layer];
    },
    toogleAnalysis: function(to){
      this.$el.toggleClass('active', to);
    },


  });

  return AnalysisResultsView;

});
