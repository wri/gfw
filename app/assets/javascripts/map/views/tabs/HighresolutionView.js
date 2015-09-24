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
  'text!map/templates/tabs/Highresolution.handlebars'
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
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.params_new_url;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({today: moment().format('YYYY-MM-DD'), mindate: moment().subtract(3,'month').format('YYYY-MM-DD')}));
      this.cacheVars();
      this.printSelects();
      if (window.location.search.contains('&hresolution=') && window.location.search.indexOf('=', window.location.search.indexOf('&hresolution=') + 13) !== -1) this.$onoffswitch.toggleClass('checked');
    },

    _setParams: function(e) {
      (! !!this.$onoffswitch.hasClass('checked')) ? this.toggleLayer(e) : null;
      var $objTarget = $(e.target).closest('.maptype');
      var params = {
          'satellite' : $objTarget.data('slug'),
           'color_filter': $objTarget.find('#hres-filter-select').val(),
           'cloud': $objTarget.find('.cloud').val(),
           'mindate': ($objTarget.find('.mindate').val().length > 0) ? $objTarget.find('.mindate').val() : '2000-09-01',
           'maxdate': ($objTarget.find('.maxdate').val().length > 0) ? $objTarget.find('.maxdate').val() : '2015-09-01'
         };
      this.presenter.setHres(btoa(JSON.stringify(params)));
      this.presenter.updateLayer($(e.target).closest('.maptype').data('slug'));
    },

    toggleLayer: function(e) {
      this.$onoffswitch.toggleClass('checked');
      this.presenter.toggleLayer($(e.target).closest('.maptype').data('slug')); //this one hides the layer
    },

    cacheVars: function() {
      this.$selects = this.$el.find('.chosen-select');
      this.$hresSelectProvider = $('#hres-provider-select');
      this.$hresSelectFilter   = $('#hres-filter-select');
      this.$onoffswitch        = $('.onoffswitch');
      this.$range              = $('#range-clouds');
      this.$progress           = $('#progress-clouds');
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
        'urthe' : '<option value="rgb">RGB (Red Green Blue)</option><option value="ndvi">NDVI (Normalized Difference Vegetation Index)</option><option value="evi">EVI (Enhanced vegetation index)</option><option value="ndwi">NDWI (Normalized Difference Water Index)</option><option value="false-nir">False Color NIR (Near Infra Red)</option>',
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

