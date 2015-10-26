/**
 * The BasemapsView selector view.
 *
 * @return BasemapsView instance (extends Backbone.View).
 */
define([
  'underscore',
  'handlebars',
  'enquire',
  'moment',
  'map/presenters/tabs/HighresolutionPresenter',
  'text!map/templates/tabs/highresolution.handlebars'
], function(_, Handlebars, enquire, moment, Presenter, tpl) {

  'use strict';

  var HighresolutionView = Backbone.View.extend({

    el: '#hd-tab',

    template: Handlebars.compile(tpl),

    events: {
      'change #hres-provider-select' : 'changeProvider',
      'click  .onoffswitch' : 'toggleLayer',
      'oninput #range-clouds' : 'setVisibleRange',
      'change #range-clouds' : 'setVisibleRange',
      'change input' : '_setParams',
      'change select' : '_setParams',
      'click button' : '_setParams',
      'click .advanced-controls' : '_toggleAdvanced'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.params_new_url;
      this.render();
    },

    cacheVars: function() {
      this.$selects            = this.$el.find('.chosen-select');
      this.$hresSelectProvider = $('#hres-provider-select');
      this.$hresSelectProFil   = $('#hres-filter-select');
      this.$hresSelectFilter   = $('#hres-filter-select');
      this.$onoffswitch        = this.$el.find('.onoffswitch');
      this.$range              = $('#range-clouds');
      this.$progress           = $('#progress-clouds');
      this.$mindate            = this.$el.find('.mindate');
      this.$maxdate            = this.$el.find('.maxdate');
      this.$advanced_options   = this.$el.find('.advanced-options');
      this.$advanced_controls  = this.$el.find('.advanced-controls');
      this.$apply              = this.$el.find('.btn');
    },

    render: function() {
      this.$el.html(this.template({today: moment().format('YYYY-MM-DD'), mindate: moment().subtract(3,'month').format('YYYY-MM-DD')}));
      this.cacheVars();
      this.printSelects();
    },

    _getParams: function(e) {
      var $objTarget = $(e.target).closest('.maptype');
      return {
          'satellite' : $objTarget.data('slug'),
           'color_filter': ($objTarget.find('#hres-filter-select').val().length > 0) ? $objTarget.find('#hres-filter-select').val() : 'rgb',
           'cloud': this.$range.val(),
           'mindate': (this.$mindate.val().length > 0) ? this.$mindate.val() : '2000-09-01',
           'maxdate': (this.$maxdate.val().length > 0) ? this.$maxdate.val() : '2015-09-01'
         };
    },

    _setParams: function(e) {
      if (! !!this.$onoffswitch.hasClass('checked')) {
        this.toggleLayer(e);
      } else {
        this.$apply.removeClass('disabled');
      }
      this.presenter.setHres(this._getParams(e));
      this.presenter.updateLayer($(e.target).closest('.maptype').data('slug'));
    },

    _fillParams: function(params) {
      this.$hresSelectProFil.val(params.color_filter).trigger("liszt:updated");
      this.$range.val(params.cloud);
      this.$mindate.val(params.mindate);
      this.$maxdate.val(params.maxdate);
      this.setVisibleRange();
    },

    toggleLayer: function(e) {
      this.switchToggle();
      this.$apply.toggleClass('disabled');
      this.presenter.setHres(this._getParams(e));
      this.presenter.toggleLayer($(e.target).closest('.maptype').data('slug'));
    },

    _toggleAdvanced: function(e) {
      this.$advanced_controls.toggleClass('active');
      this.$advanced_options.toggle('250');
    },

    switchToggle: function() {
      // this.$onoffswitch.toggleClass('checked');
      this.$el.find('.onoffswitch').toggleClass('checked');
    },


    printSelects: function() {
      this.printProviders();
      // this.printFilters();
      this.triggerChosen();
    },

    triggerChosen: function() {
      this.$selects.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
    },

    printProviders: function() {
      var options = '<option value="urthe">Urthecast</option><option value="digiglobe">Digital Globe</option><option value="skybox">Skybox</option>';
      this.$hresSelectProvider.append(options);
      this.$hresSelectFilter.append('<option value="rgb">RGB (Red Green Blue)</option><option value="ndvi">NDVI (Normalized Difference Vegetation Index)</option><option value="evi">EVI (Enhanced vegetation index)</option><option value="ndwi">NDWI (Normalized Difference Water Index)</option><option value="false-nir">False Color NIR (Near Infra Red)</option>'); //temporary hardcoded

    },

    printFilters: function(options) {
      if (!!options) return;
      this.$hresSelectFilter.append(options);
      this.triggerChosen();
    },

    changeProvider: function(e) {
      return;
      var providers = {
        'urthe' : '<option value="ndvi">NDVI (Normalized Difference Vegetation Index)</option><option value="evi">EVI (Enhanced vegetation index)</option><option value="ndwi">NDWI (Normalized Difference Water Index)</option><option value="false-nir">False Color NIR (Near Infra Red)</option>',
        'digiglobe' : '',
        'skybox' : ''
      }
      this.printFilters(providers[$(e.currentTarget).val()]);
    },

    setVisibleRange: function(){
      var width = this.$range.val();
      this.$progress.width(width + '%')
    },

  });

  return HighresolutionView;

});

