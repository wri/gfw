define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AdvancedAnalysisResultsPresenter',
  'text!map/templates/analysis/advancedAnalysisResults.handlebars',
  'countries/abstract/ForestTenureGraph'
], function(_, Handlebars, Presenter, tpl, ForestTenureGraph) {

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

      return this;
    },

    _renderResults: function(results) {
      results = _.omit(results, 'params', 'meta');

      if (_.isEmpty(results)) {
        return this._renderFailure();
      }

      var tenures = [{
        name: 'Public lands administered by the government',
        percent: 150000000
      }, {
        name: 'Public lands reserved for communities and indigenous groups',
        percent: 3000000
      }, {
        name: 'Private lands owned by communities and indigenous groups',
        percent: 10000000
      }, {
        name: 'Private lands owned by firms and individuals',
        percent: 430000
      }];

      new ForestTenureGraph({
        data: tenures,
        el: this.$('.line-graph'),
        valueFormatter: function(d) {
          return d['percent']/1000000 + 'Mha';
        }
      });
    },

    _renderFailure: function() {
      this.$('.no-data').show();
      this.$('.line-graph').hide();
    },

    close: function(e) {
      e && e.preventDefault();
      this.remove();
    }

  });

  return AdvancedAnalysisView;

});
