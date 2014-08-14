/**
 * The Analysis view.
 *
 * @return Analysis view (extends Widget.View)
 */
define([
  'underscore',
  'handlebars',
  'views/Widget',
  'presenters/AnalysisResultsPresenter',
  'text!templates/analysisResults.handlebars'
], function(_, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var AnalysisResultsView = Widget.extend({

    className: 'widget widget-analysis-results',

    template: Handlebars.compile(tpl),

    options: {
      hidden: false,
      boxHidden: true,
      boxClosed: false
    },

    events: function(){
      return _.extend({}, AnalysisResultsView.__super__.events, {
        'click .analysis-control-delete': '_deleteAnalysis',
        'click .download-links span' :'_toggleDownloads'
      });
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      AnalysisResultsView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      AnalysisResultsView.__super__._cacheSelector.apply(this);
      this.$downloadDropdown = this.$('.download-dropdown');
    },

    /**
     * Render analysis results.
     *
     * @param  {Object} params Analysis html params
     */
    renderAnalysis: function(params) {
      this._update(this.template(params));
      this.model.set('boxHidden', false);
    },

    /**
     * Render loading analysis message.
     */
    renderLoading: function() {
      var p = {loading: true};
      this._update(this.template(p));
      this.model.set('boxHidden', false);
    },

    renderUnavailable: function() {
      var p = {unavailable: true};
      this._update(this.template(p));
      this.model.set('boxHidden', false);
    },

    /**
     * Render failure analysis request message.
     */
    renderFailure: function() {
      var p = {failure: true};
      this._update(this.template(p));
      this.model.set('boxHidden', false);
    },

    _deleteAnalysis: function() {
      this.presenter.deleteAnalysis();
    },

    _toggleDownloads: function() {
      this.$downloadDropdown.toggleClass('hidden');
    }
  });

  return AnalysisResultsView;

});
