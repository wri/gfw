define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AdvancedAnalysisResultsPresenter',
  'map/views/tabs/SpinnerView',
  'text!map/templates/analysis/advancedAnalysisResults.handlebars',
  'countries/abstract/ForestTenureGraph'
], function(_, Handlebars, Presenter, SpinnerView, tpl, ForestTenureGraph) {

  'use strict';

  var AdvancedAnalysisView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    events: {
      'click .close' : 'close'
    },

    initialize: function(options) {
      options = options || {};
      this.resource = options.resource;

      this.presenter = new Presenter(this);
      this.presenter.requestAnalysis();
    },

    render: function() {
      this.$el.html(this.template());

      new SpinnerView({
        el: this.$('#advanced-analysis-spinner')
      }).start();

      return this;
    },

    _renderResults: function(results) {
      this._hideSpinner();

      results = _.omit(results, 'params', 'meta');

      if (_.isEmpty(results)) {
        return this._renderFailure();
      }

      results = _.map(results, function(value, key) {
        return {
          name: key,
          percent: value
        };
      });

      new ForestTenureGraph({
        data: results,
        el: this.$('.line-graph'),
        valueFormatter: function(d) {
          return d['percent'] + ' ha';
        }
      });
    },

    _hideSpinner: function() {
      this.$('#advanced-analysis-spinner').hide();
    },

    _renderFailure: function() {
      this._hideSpinner();
      this.$('.no-data').show();
      this.$('.line-graph').hide();
    },

    close: function(e) {
      e && e.preventDefault();
      this.remove();
      this.presenter.unsubscribe();
    }

  });

  return AdvancedAnalysisView;

});
