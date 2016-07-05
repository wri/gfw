/**
 * The AnalysisCountryView selector view.
 *
 * @return AnalysisCountryView instance (extends Backbone.View).
 */
define([
  'underscore', 
  'handlebars', 
  'amplify', 
  'chosen', 
  'turf', 
  'mps',
  'helpers/geojsonUtilsHelper',
  'map/presenters/analysis/AnalysisCountryPresenter',
  'text!map/templates/analysis/analysis-country.handlebars',
], function(_, Handlebars, amplify, chosen, turf, mps, geojsonUtilsHelper, Presenter, tpl) {

  'use strict';


  var AnalysisCountryView = Backbone.View.extend({

    el: '#analysis-country-tab',

    template: Handlebars.compile(tpl),

    events: {
      // selects
      'change #analysis-country-select' : 'selectIso',
      'change #analysis-region-select' : 'selectRegion',
      // buttons
      'click #analysis-country-button' : 'analyzeCountry',
      'click #subscribe-country-button' : 'subscribeCountry',
    },

    initialize: function(map, countries) {
      this.map = map;
      this.countries = countries;
      this.presenter = new Presenter(this);

      this.render();
    },

    render: function(){
      this.$el.removeClass('-results').html(this.template({
        countries: this.countries
      }));

      this.cache();

      this.renderChosen();
    },

    cache: function() {
      this.$selects = this.$el.find('.chosen-select');
      
      // Select
      this.$analysisCountrySelect = this.$el.find('#analysis-country-select');
      this.$analysisRegionSelect = this.$el.find('#analysis-region-select');

      // Buttons
      this.$buttonContainer = this.$el.find('#country-button-container');
      this.$analysisBtn = this.$el.find('#analysis-country-button');
      this.$subscribeBtn = this.$el.find('#subscribe-country-button');
    },

    renderChosen: function() {
      this.$selects.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });      
    },







    /**
     * UI EVENTS
     * 
     * selectIso & selectRegion
     * @param  {object} e
     * @return {void}
     */
    selectIso: function(e) {
      e && e.preventDefault();
      // Reset region whenever a user selects a new country
      this.presenter.status.set('iso', {
        country: $(e.currentTarget).val(),
        region: null
      });
    },

    selectRegion: function(e) {
      e && e.preventDefault();
      this.presenter.status.set('iso', {
        country: this.presenter.status.get('iso').country,
        region: $(e.currentTarget).val()
      });
    },

    /**
     * analyzeCountry
     * @param  {object} e
     * @return {void}
     */
    analyzeCountry: function(e) {
      e && e.preventDefault();
      this.presenter.status.set('isoDisabled', false);
    },

    /**
     * subscribeCountry
     * @param  {object} e
     * @return {void}
     */
    subscribeCountry: function(e) {
      e && e.preventDefault();
      this.presenter.subscribeCountry();
    },









    /**
     * PRESENTER ACTIONS
     * 
     * loadRegions
     * @return {void}
     */    
    toggleEnabledButtons: function() {
      var iso = this.presenter.status.get('iso');
      
      if (!!iso && !!iso.country && iso.country != 'ALL') {
        this.$analysisBtn.toggleClass('disabled', !this.presenter.status.get('enabled'));
        this.$subscribeBtn.toggleClass('disabled', !this.presenter.status.get('enabledSubscription'));        
      } else {
        this.$analysisBtn.toggleClass('disabled', true);
        this.$subscribeBtn.toggleClass('disabled', true);
      }
    },

    setSelects: function() {
      var iso = this.presenter.status.get('iso'),
          country = (iso && iso.country != 'ALL') ? iso.country : null,
          region = iso.region;

      // Country
      this.$analysisCountrySelect.val(country).trigger('chosen:updated');

      // Region
      this.$analysisRegionSelect.val(region).attr('disabled', !country).trigger('chosen:updated');
    }


  });
  return AnalysisCountryView;

});
