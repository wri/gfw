/**
 * The AnalysisButtonView class for enabling analysis on the map.
 *
 * @return AnalysisButton class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/AnalysisButtonPresenter',
  'handlebars',
  'text!templates/AnalysisButtonTemplate.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var AnalysisButtonView = Backbone.View.extend({

    // UI event handlers.
    events: {
      'click #analysis_control': '_onClick'
    },

    // The view template.
    template: Handlebars.compile(tpl),

    /**
     * Constructs a new AnalysisButtonView and its presenter.
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
      e && e.preventDefault();
      var $control = this._getControl();
      if ($control.hasClass('disabled')) return;
      
      this.presenter.onClick();
    },

    /**
     * Returns jQuery object representing the #analysis_control DOM element.
     * It's an optimization to avoid calling the jQuery selector multiple
     * times.
     *
     * @return {jQuery} The #analysis_control jQuery object
     */
    _getControl: function() {
      if (!this.control) {
        this.control = this.$('#analysis_control');
      }
      return this.control;
    },

    /**
     * Enable or disable the view.
     *
     * @param {Boolean} enable True to enable view, false to disable it.
     */
    setEnabled: function(enable) {
      var $control = this._getControl();

      if (enable) {
        $control.removeClass('disabled');
      } else {
        $control.addClass('disabled');
      }
    },

    showHelperBar: function() {
      var self = this;
      $('.timeline').fadeOut(function(){
        self.$el.find('.helper_bar').fadeIn()
      })
    },
  });

  return AnalysisButtonView;

});
