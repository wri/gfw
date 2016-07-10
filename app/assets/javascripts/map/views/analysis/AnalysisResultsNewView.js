/**
 * The AnalysisResultsNewView view.
 *
 * @return AnalysisResultsNewView view
 */
define([
  'underscore',
  'handlebars',
  'map/presenters/analysis/AnalysisResultsNewPresenter',
  'text!map/templates/analysis/analysis-results.handlebars',
  'text!map/templates/analysis/analysis-results-error.handlebars'
], function(_, Handlebars, Presenter, tpl, errorTpl) {

  'use strict';

  var AnalysisResultsNewView = Backbone.View.extend({

    events: {
      // 'click #analysis-subscribe': '_subscribe',
      // 'click .js-dropdown-btn' :'_toggleDownloads',
      // 'click .canopy-button' : '_showCanopy',
      // 'click .advanced-analysis-button' : '_showAdvancedAnalysis',
      // 'click .close' : 'toogleAnalysis',
      // 'click #toggleIFL' : 'toogleIFL',
      // 'click #btn-analysis-refresh' : 'refreshAnalysis'
    },

    templates: {
      success: Handlebars.compile(tpl),
      error: Handlebars.compile(errorTpl),
    },

    types: [
      // GEOSTORE
      {
        el: '#analysis-draw-tab',
        type: 'draw',
      },
      
      // COUNTRY
      {
        el: '#analysis-country-tab',
        type: 'country',
      },

      // SHAPE
      {
        el: '#analysis-shape-tab',
        type: 'use',
      },
      {
        el: '#analysis-shape-tab',
        type: 'wdpaid',
      },
      
    ],

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

      enquire.register("screen and (min-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = false;
        },this)
      });
      enquire.register("screen and (max-width:"+window.gfw.config.GFW_MOBILE+"px)", {
        match: _.bind(function(){
          this.mobile = true;
        },this)
      });
    },

    render: function() {
      var el = this.setEl();
      var country = this.presenter.status.get('iso').country;
      
      // Set element to render
      this.setElement(el)

      this.$el.addClass('-results').html(this.templates.success({
        resource: this.presenter.status.get('resource'),
        countries: (!!country && country != 'ALL') ? this.countries : null
      }));

      this.cache();
      this.renderChosen();
      this.setSelects();
    },

    renderError: function() {
      var type = this.presenter.status.get('type');
      if (!!type) {
        this.setElement(this.setEl())
        this.$el.addClass('-results').html(this.templates.error({
          errors: this.presenter.status.get('errors')
        }));        
      }
    },

    cache: function() {
      this.$selects = this.$el.find('.chosen-select');

      // Select
      this.$analysisCountrySelect = this.$el.find('#analysis-country-select');
      this.$analysisRegionSelect = this.$el.find('#analysis-region-select');
    },

    /**
     * UI EVENTS
     * - onClickDelete
     */


    /**
     * HELPERS
     * - setEl
     */
    setEl: function() {
      var type = this.presenter.status.get('type');
      return _.findWhere(this.types, { type: type }).el
    },

    setSelects: function() {
      var iso = this.presenter.status.get('iso'),
          country = (iso && iso.country != 'ALL') ? iso.country : null,
          region = iso.region;

      // Country
      this.$analysisCountrySelect.val(country).trigger('chosen:updated');

      // Region
      this.$analysisRegionSelect.val(region).attr('disabled', !country).trigger('chosen:updated');
    },

    renderChosen: function() {
      this.$selects.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });      
    },


  });

  return AnalysisResultsNewView;

});
