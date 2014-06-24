/**
 * The AnalysisButtonView class for enabling analysis on the map.
 *
 * @return AnalysisButton class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/AnalysisButtonPresenter',
  'text!templates/AnalysisButtonTemplate.html'
], function(Backbone, _, Presenter, template) {

  var AnalysisButtonView = Backbone.View.extend({

    // UI event handlers.
    events: {
      'click #analysis_control': '_onClick'
    },

    // The view template.
    template: _.template(template),

    /**
     * Constructs a new AnalysisButtonView.
     */
    initialize: function() {
      this.presenter = new Presenter(this);
      this.render();
    },

    render: function() {
      this.$el.append(this.template());
    },

    /**
     * Click handler that delegates to the presenter.
     * 
     * @param  {Event} e The click event
     */
    _onClick: function(e) {
      console.log('AnalysisButtonView routing event to AnalysisButtonPresenter');
      this.presenter.onClick();
    },

    /**
     * Enable or disable the view.
     * 
     * @param {Boolean} enable True to enable view, false to disable it.
     */
    setEnabled: function(enable) {
      if (enable) {
        this.$el.removeClass('disabled');
      } else {
        this.$el.addClass('disabled');
      }
    },

    /**
     * Return true if view is enabled, otherwise return false.
     * 
     * @return {Boolean} true if view enabled, otherwise false
     */
    isEnabled: function() {
      return !this.$el.hasClass('disabled');
    }

  });

  return AnalysisButtonView;

});