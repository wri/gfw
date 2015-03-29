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
      hidden: false
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
      this.umdoptions_dialog = new UmdoptionsDialogView();
      // if (this.options && this.options.target) {
      //   $(this.options.target).append(this.umdoptions_dialog.render());
      // } else {
      //   $('#map').append(this.umdoptions_dialog.render());
      // }
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
      this.$el.append(this.template.render( this.model.toJSON() ));
      this.$umd_options_control = (this.$el.find('.umd_options-control').length > 0) ? this.$el.find('.umd_options-control') : null;
      if (!!this.$umd_options_control) {
        $(this.$umd_options_control).tipsy({ title: 'data-tip', fade: true, gravity: 'w' });
      }

      return this.$el;
    }
  });







  var UmdoptionsDialogView = Backbone.View.extend({

    el: '#control-threshold',

    template: Handlebars.compile(TPLDialog),


    events: {
      // slider
      'change #range-threshold': 'updateThreshold',
      'input #range-threshold': 'setVisibleRange',
      // labels
      'click #labels-threshold li' : 'clickLabel',
      // hide buttons
      'click .overlay' : 'hide',
      'click .close' : 'hide'
    },

    valuesMap: [10,15,20,25,30,50,75],

    initialize: function() {
      this.model = new UmdoptionsDialogModel();
      this.helper = CountryHelper;
      this.render();
      this.setListeners();
    },

    cacheVars: function(){
      this.$button = $('#'+this.$el.attr('id')+'-button');
      this.$range = $('#range-threshold');
      this.$labels = $('#labels-threshold').find('li');
      this.$progress = $('#progress-threshold');
    },

    setListeners: function(){
      this.model.on('change:hidden', this.toggle, this);
    },

    render: function(){
      this.$el.html(this.template({values: this.valuesMap }));
      this.cacheVars();
    },

    toggle: function(){
      if (this.model.get('hidden')) {
        this.$el.show(0);
      }else{
        this.$el.hide(0);
      }
    },
    show: function(){
      this.model.set('hidden', true);
    },
    hide: function(e){
      e && e.preventDefault();
      this.model.set('hidden', false);
    },


    // input range change
    updateThreshold: function() {
      var value = this.$range.val();
      this.setVisibleRange(value);
      this.canopy = this.valuesMap[value];

      if (this.helper.config.BASELAYER) {
        this.helper.config.BASELAYER = 'loss' + this.canopy;
      }

      this.helper.config.canopy_choice = this.canopy;
      ga('send', 'event', 'Country show', 'Settings', 'Threshold: ' + this.canopy);

      mps.publish('Threshold:change', [this.helper.config.canopy_choice]);

      if (typeof GFW !== 'undefined' && GFW.app) {
        this.helper.updateHash();
        GFW.app.updateBaseLayer(this.helper.config.BASELAYER)
      }
    },

    setVisibleRange: function(){
      var width = (100/(this.valuesMap.length - 1)) * this.$range.val();
      this.$progress.width(width + '%')
    },

    // click on label
    clickLabel: function(e){
      this.$range.val($(e.currentTarget).data('slider-value'));
      this.updateThreshold();
    },

    // update Presenter
    updatePresenter: function(value){
      this.$range.val(this.valuesMap.indexOf(value));
      this.updateThreshold();
    },

    // disable on-off
    toggleVisibility: function(bool){
      var value = this.$range.val();
      if (bool) {
        (this.$button.hasClass('active')) ? this.$button.trigger('click') : null;
        this.$button.removeClass('changed').addClass('disabled');
      }else{
        this.$button.removeClass('disabled');
        (this.valuesMap[value] !== 30) ? this.$button.addClass('changed') : this.$button.removeClass('changed');
      }
    }

  });

  return UmdOptionsView;
});
