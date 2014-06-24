/**
 * The AnalysisButtonPresenter class for the AnalysisButtonView.
 *
 * @return AnalysisButtonPresenter class.
 */
define([
  'Class',
  'underscore',
  'mps'
], function(Class, _, mps) {

  var AnalysisButtonPresenter = Class.extend({

    /**
     * Constructs new AnalysisButtonPresenter.
     * 
     * @param  {AnalysisButtonView} view Instance of AnalysisButtonView
     * 
     * @return {class} The AnalysisButtonPresenter class
     */
    init: function(view) {
      this.view = view;
      this.subscribe();
    },

    /**
     * Subscribe to application events.
     */
    subscribe: function() {
      mps.subscribe('AnalysisButton/disabled', _.bind(function(disabled) {
        this.view.disabled(disabled);
      }, this));
    },

    /**
     * Handles an onClick UI event from the view by publishing a new
     * 'AnalysisButton/enabled' event and setting updating the view.
     */
    onClick: function() {
      var enabled = this.view.isEnabled();

      console.log('AnalysisButtonPresenter handling onClick event');
      mps.publish('analysisButton/enabled', [enabled]);
      this.view.setEnabled(enabled);
    }

  });

  return AnalysisButtonPresenter;

});