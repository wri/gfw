/**
 * The AnalysisResultsView selector view.
 *
 * @return AnalysisResultsView instance (extends Widget).
 */
define([
  'underscore',
  'views/Widget',
  'presenters/AnalysisResultsPresenter',
  'handlebars',
  'text!templates/analysisResults.handlebars'
], function(_, Widget, Presenter, Handlebars, tpl) {

  'use strict';

  var AnalysisResultsView = Widget.extend({

    className: 'widget analysis-results',
    template: Handlebars.compile(tpl),

    widgetOpts: {
      hidden: true,
    },

    events: function(){
      return _.extend({}, AnalysisResultsView.__super__.events, {
      });
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      AnalysisResultsView.__super__.initialize.apply(this);
    }
  });

  return AnalysisResultsView;

});