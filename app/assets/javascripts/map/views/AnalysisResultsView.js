/**
 * The Analysis view.
 *
 * @return Analysis view (extends Widget.View)
 */
define([
  'underscore',
  'handlebars',
  'map/views/Widget',
  'map/presenters/AnalysisResultsPresenter',
  'text!map/templates/analysisResults.handlebars',
  'text!map/templates/analysisResultsFailure.handlebars',
  'text!map/templates/analysisResultsUnavailable.handlebars',
  'text!map/templates/analysisResultsLoading.handlebars',
], function(_, Handlebars, Widget, Presenter, tpl, failureTpl, unavailableTpl, loadingTpl) {

  'use strict';

  var AnalysisResultsView = Widget.extend({

    className: 'widget widget-analysis-results',

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
      AnalysisResultsView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      AnalysisResultsView.__super__._cacheSelector.apply(this);
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
      this._update(this.template(params));
    },

    /**
     * Render loading analysis message.
     */
    renderLoading: function() {
      this._update(this.templates.loading());
    },

    renderUnavailable: function() {
      this._update(this.templates.unavailable());
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
      ga('send', 'event', 'Map', 'Analysis', 'Delete');
    },
    _subscribe: function() {
      this.presenter.subscribeAnalysis();
      ga('send', 'event', 'Map', 'Analysis', 'Subscribe');
    },

    _toggleDownloads: function() {
      this.$downloadDropdown.toggleClass('hidden');
      ga('send', 'event', 'Map', 'Analysis', 'Downloads');
    }
  });

  return AnalysisResultsView;

});
