/**
 * The Country Header view.
 */
define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'd3',
  'mps',
  'countries/helpers/CountryHelper',
  'text!countries/templates/umdOptions.handlebars',
  'text!countries/templates/umdOptionsDialog.handlebars',

], function($, Backbone, _, Handlebars, d3, mps, CountryHelper, TPLOptions, TPLDialog) {

  'use strict';

  var UmdOptionsModel = Backbone.Model.extend({
    defaults: {
      tooltip: "Settings"
    }
  });

  var UmdoptionsDialogModel = Backbone.Model.extend({
    defaults: {
      tooltip: "Settings"
    }
  });






  var UmdOptionsView = Backbone.View.extend({
    className: 'umdoptions',

    template: Handlebars.compile(TPLOptions),

    events: {
      'click #umd_options-control' : '_openUMDoptions'
    },

    initialize: function(options) {
      _.bindAll( this, '_toggle' );

      this.model = new UmdOptionsModel();

      this.options = _.extend({}, this.defaults, options);

      this.model.on('change:hidden', this._toggle);

      this._initViews();
    },

    _initViews: function() {
      this.umdoptions_dialog = new UmdoptionsDialogView({});
      if (this.options && this.options.target) {
        $(this.options.target).append(this.umdoptions_dialog.render());
      } else {
        $('#map').append(this.umdoptions_dialog.render());
      }
    },

    _openUMDoptions: function(e) {
      e && e.preventDefault();
      this.umdoptions_dialog.show();
    },

    _toggle: function() {
      if (this.model.get('hidden')) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
    },

    show: function() {
      this.model.set('hidden', false);
    },

    hide: function() {
      this.model.set('hidden', true);
    },

    render: function() {
      console.log(this.$el);
      this.$el.append(this.template.render( this.model.toJSON() ));
      this.$umd_options_control = (this.$el.find('.umd_options-control').length > 0) ? this.$el.find('.umd_options-control') : null;
      if (!!this.$umd_options_control) {
        $(this.$umd_options_control).tipsy({ title: 'data-tip', fade: true, gravity: 'w' });
      }

      return this.$el;
    }
  });







  var UmdoptionsDialogView = Backbone.View.extend({
    className: 'umdoptions_dialog',

    events: {
      'click .close':           'hide',
      'click .cancel':          'hide',
      'click .apply':           '_onClickApply',
      'change #canopy_slider':  '_onChangeSlider',
      'input #canopy_slider':   '_onDragSlider',
      'mouseup #canopy_slider': '_onDragEndSlider',
      'click .slider_option':   '_onClickOption',
      'click .compression_option': '_onClickCompression'
    },

    template: Handlebars.compile(TPLDialog),


    initialize: function() {

      this.options = _.extend(this.options, this.defaults);

      this.model = new UmdoptionsDialogModel();

      this.helper = CountryHelper;

      this.model.on('change:hidden', this.toggle);
      this.model.on('change:mode', this._toggleMode);
      this.canopy = 75;
    },

    _onDragSlider: function() {
      this._paintRange(document.getElementById('canopy_slider').value)
    },

    _onChangeSlider: function() {
      this._paintRange(document.getElementById('canopy_slider').value)
    },

    _onDragEndSlider: function() {
      if (this.helper.config.BASELAYER.slice(-2) == this.canopy) return;
      this._onClickApply();
    },
    _onClickOption: function(e) {
      if (this.helper.config.BASELAYER && this.helper.config.BASELAYER.slice(-2) == $(e.target).data('option')) return;
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
      this.helper.config.compression = parseFloat( $('input[name=compression]:checked', '.form').val() );
      this._onClickApply();
    },

    loadCanopyUrl: function() {
      switch((this.helper.config.BASELAYER === 'loss' || this.helper.config.BASELAYER === null) ? 30 : parseInt(this.helper.config.BASELAYER.slice(-2)) ) {
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
      var $slider = $('#canopy_slider');
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
      if (this.helper.config.BASELAYER) {
        this.helper.config.BASELAYER = 'loss' + this.canopy;
      }
      this.helper.config.canopy_choice = this.canopy;
      ga('send', 'event', 'Country show', 'Settings', 'Threshold: ' + this.canopy);

      console.log(this.helper.config.canopy_choice);

      mps.publish('Threshold:change', [this.helper.config.canopy_choice]);

      if (typeof GFW !== 'undefined' && GFW.app) {
        this.helper.updateHash();
        GFW.app.updateBaseLayer(this.helper.config.BASELAYER)
      }
    },

    show: function() {
      this.$el.fadeIn(250);
      this.loadCanopyUrl();
    },

    hide: function(e) {
      e && e.preventDefault();
      this.$el.fadeOut(250);
    },

    render: function() {

      this.$el.append(this.template( this.model.toJSON() ));

      return this.$el;
    }


  });

  return UmdOptionsView;
});
