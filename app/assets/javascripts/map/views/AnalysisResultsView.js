/**
 * The Analysis view.
 *
 * @return Analysis view
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/AnalysisResultsPresenter',
  'text!map/templates/analysisResults.handlebars',
  'text!map/templates/analysisResultsFailure.handlebars',
  'text!map/templates/analysisResultsUnavailable.handlebars',
  'text!map/templates/analysisResultsLoading.handlebars',
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
    },

    initialize: function() {
      this.model = new AnalysisResultsModel();
      this.presenter = new Presenter(this);
    },

    _cacheSelector: function() {
      this.$tab = $('#analysis-tab');
      this.$resultsHide = $('.results-hide');
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
      this.$el.html(this.template(params)).removeClass('hidden');
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
    _subscribe: function() {
      this.presenter.subscribeAnalysis();
      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + this.params.layer.title);
    },

    _toggleDownloads: function(e) {
      e && e.preventDefault();
      this.$downloadDropdown.toggleClass('hidden');
      ga('send', 'event', 'Map', 'Download', 'Downloads-' + 'Layer: ' + this.params.layer.title);
    }
  });

  return AnalysisResultsView;

});
