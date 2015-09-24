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
      'click button' : '_setParams',
      'change #hres-provider-select' : 'changeProvider'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.params_new_url;
      this.render();
    },

    render: function() {
      this.$el.html(this.template({today: moment().format('YYYY-MM-DD'), mindate: moment().subtract(3,'month').format('YYYY-MM-DD')}));
      this.renderVars();
      this.printSelects();
    },

    _setParams: function(e) {
      var $objTarget = $(e.target).closest('.maptype');
      var params = {
          'satellite' : $objTarget.data('maptype'),
           'color_filter': $objTarget.find('#hres-filter-select').val(),
           'cloud': $objTarget.find('.cloud').val(),
           'mindate': ($objTarget.find('.mindate').val().length > 0) ? $objTarget.find('.mindate').val() : '2000-09-01',
           'maxdate': ($objTarget.find('.maxdate').val().length > 0) ? $objTarget.find('.maxdate').val() : '2015-09-01'
         };
      var b64 = btoa(JSON.stringify(params));
      sessionStorage.setItem('high-resolution', b64);
      this.toggleLayer($objTarget.data('maptype'), b64);
    },

    toggleLayer: function(slug, params) {
        this.presenter.toggleLayer(slug); //this one hides the layer
        this.presenter.setHres(params);
    },

    renderVars: function() {
      this.$selects = this.$el.find('.chosen-select');
      this.$hresSelectProvider = $('#hres-provider-select');
      this.$hresSelectFilter   = $('#hres-filter-select');
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
    }
  });

  return HighresolutionView;

});

