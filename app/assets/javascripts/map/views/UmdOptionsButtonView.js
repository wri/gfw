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
      'click #umd_options-control'      : '_onClick',
      'click .umdoptions_dialog .close' : 'toggleDialog',
      'change #canopy_slider'           : '_onChangeSlider',
      'input #canopy_slider'            : '_onDragSlider',
      'mouseup #canopy_slider'          : '_onDragEndSlider',
      'click .slider_option'            : '_onClickOption',
      'click .compression_option'       : '_onClickCompression'
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
    _onClick: function(e) {
      e && e.preventDefault();
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
     * Returns jQuery object representing the #umd_options-control DOM element.
     * It's an optimization to avoid calling the jQuery selector multiple
     * times.
     *
     * @return {jQuery} The #umd_options-control jQuery object
     */
    _getDialog: function() {
      if (!this.dialog) {
        this.dialog = this.$('.umdoptions_dialog');
      }
      return this.dialog;
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
    },

    /**
     * Displays the UMD Options dialog box.
     *
     * @param  {Event} e The click event
     */
    toggleDialog: function(e) {
      e && e.preventDefault();

      var target = this._getDialog();
      if (target.is(':visible')) {
        target.fadeOut();
      } else {
        target.fadeIn();
      }
    },

_onDragSlider: function() {
    this._paintRange(document.getElementById('canopy_slider').value)
  },

  _onChangeSlider: function() {
    this._paintRange(document.getElementById('canopy_slider').value)
  },

  _onDragEndSlider: function() {
    if (config.BASELAYER.slice(-2) == this.canopy) return;
    //this._onClickApply();
  },
  _onClickOption: function(e) {
    if (config.BASELAYER && config.BASELAYER.slice(-2) == $(e.target).data('option')) return;
    switch($(e.target).data('option')) {
      case 0:
      case 100:
        return true;
      break;
      case 10:
        this._paintRange(15)
      break;
      case 15:
        this._paintRange(25)
      break;
      case 20:
        this._paintRange(35)
      break;
      case 25:
        this._paintRange(45)
      break;
      case 30:
        this._paintRange(55)
      break;
      case 50:
        this._paintRange(65)
      break;
      case 75:
        this._paintRange(75)
      break;
    }
    this._onClickApply();
  },

  _onClickCompression: function(){
    config.compression = parseFloat( $('input[name=compression]:checked', '.form').val() );
    this._onClickApply();
  },

  loadCanopyUrl: function() {
    switch((config.BASELAYER === 'loss' || config.BASELAYER === null) ? 10 : parseInt(config.BASELAYER.slice(-2)) ) {
      case 0:
      case 100:
        return true;
      break;
      case 10:
        this._paintRange(15)
      break;
      case 15:
        this._paintRange(25)
      break;
      case 20:
        this._paintRange(35)
      break;
      case 25:
        this._paintRange(45)
      break;
      case 30:
        this._paintRange(55)
      break;
      case 50:
        this._paintRange(65)
      break;
      case 75:
        this._paintRange(75)
      break;
    }
  },

  _paintRange: function(slider_val) {
    switch(true) {
      case slider_val >= 10 && slider_val < 18:
        slider_val = 10;
        this.canopy = 10;
        $('.visible_range').css('width', 60 + 281);
      break;
      case slider_val >= 18 && slider_val < 28:
        slider_val = 21; //15
        this.canopy = 15;
        $('.visible_range').css('width', 60 + 233);
      break;
      case slider_val >= 28  && slider_val < 38:
        slider_val = 31; //20
        this.canopy = 20;
        $('.visible_range').css('width', 60 + 192);
      break;
      case slider_val >= 38  && slider_val < 48:
        slider_val = 42; //25
        this.canopy = 25;
        $('.visible_range').css('width', 60 + 143);
      break;
      case slider_val >= 48  && slider_val < 58:
        slider_val = 53; //30
        this.canopy = 30;
        $('.visible_range').css('width', 60 + 97);
      break;
      case slider_val >= 58  && slider_val < 69:
        slider_val = 64; //50
        this.canopy = 50;
        $('.visible_range').css('width', 60 + 54);
      break;
      case slider_val >= 69  && slider_val < 100:
      default:
        slider_val = 75;
        this.canopy = 75;
        $('.visible_range').css('width', 60);
      break;
    }
    document.getElementById('canopy_slider').value = slider_val;
  },

  _onClickApply: function(e) {
    e && e.preventDefault();
    if (config.BASELAYER) {
      config.BASELAYER = 'loss' + this.canopy;
    }
    config.canopy_choice = this.canopy;
    if (typeof GFW !== 'undefined' && GFW.app) {
      updateHash();
      GFW.app.updateBaseLayer(config.BASELAYER)
    }
  },
  });

  return UmdOptionsButtonView;

});
