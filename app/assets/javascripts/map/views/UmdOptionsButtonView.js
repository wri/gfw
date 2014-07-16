/**
 * The UmdOptionsButtonView class for enabling analysis on the map.
 *
 * @return UmdOptionsButton class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'presenters/UmdOptionsButtonPresenter',
  'handlebars',
  'text!templates/UmdOptionsButtonTemplate.handlebars'
], function(Backbone, _, Presenter, Handlebars, tpl) {

  'use strict';

  var UmdOptionsButtonView = Backbone.View.extend({

    // UI event handlers.
    events: {
      'click #umd_options-control': '_onClick'
    },

    // The view template.
    template: Handlebars.compile(tpl),

    /**
     * Constructs a new UmdOptionsButtonView and its presenter.
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
    _onClick: function() {
      this.presenter.onClick();
    },

    /**
     * Returns jQuery object representing the #umd_options-control DOM element.
     * It's an optimization to avoid calling the jQuery selector multiple
     * times.
     *
     * @return {jQuery} The #umd_options-control jQuery object
     */
    _getControl: function() {
      if (!this.control) {
        this.control = this.$('#umd_options-control');
      }
      return this.control;
    },

    /**
     * Enable or disable the view.
     *
     * @param {Boolean} enable True to enable view, false to disable it.
     */
    setEnabled: function(enable) {
      var control = this._getControl();

      if (enable) {
        control.removeClass('disabled');
      } else {
        control.addClass('disabled');
      }
    }
  });

  return UmdOptionsButtonView;

});
