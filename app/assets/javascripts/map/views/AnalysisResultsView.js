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

  var AnalysisResultsView = Backbone.View.extend({

    el: '#analysis-result',

    template: Handlebars.compile(tpl),

    templates: {
      failure: Handlebars.compile(failureTpl),
      unavailable: Handlebars.compile(unavailableTpl),
      loading: Handlebars.compile(loadingTpl)
    },

    options: {
      hidden: false,
      boxHidden: true,
      boxClosed: false
    },

    events: function() {
      return _.extend({}, AnalysisResultsView.__super__.events, {
        'click .analysis-control-delete': '_deleteAnalysis',
        'click .download-links span' :'_toggleDownloads',
        'click .analysis-control-subscribe': '_subscribe'
      });
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this._cacheSelector();

      AnalysisResultsView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      this.$downloadDropdown = this.$('.download-dropdown');
      this.$subscribeButton = this.$('#subscribeButton');
      this.$subscribeButton_title = this.$('#subscribeButton-title');
    },

    /**
     * Render analysis results.
     *
     * @param  {Object} params Analysis html params
     */
    renderAnalysis: function(params) {
      this.params = params;
      this.$el.html(this.template(params));
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
      this.$subscribeButton_title.toggleClass('disabled', toggle);
    },

    /**
     * Render failure analysis request message.
     */
    renderFailure: function() {
      this._update(this.templates.failure());
    },

    _deleteAnalysis: function() {
      this.presenter.deleteAnalysis();
      ga('send', 'event', 'Map', 'Delete-Analysis', 'Layer: ' + this.params.layer.title);
    },
    _subscribe: function() {
      this.presenter.subscribeAnalysis();
      ga('send', 'event', 'Map', 'Subscribe', 'Layer: ' + this.params.layer.title);
    },

    _toggleDownloads: function() {
      this.$downloadDropdown.toggleClass('hidden');
      ga('send', 'event', 'Map', 'Download', 'Downloads-' + 'Layer: ' + this.params.layer.title);
    }
  });

  return AnalysisResultsView;

});
