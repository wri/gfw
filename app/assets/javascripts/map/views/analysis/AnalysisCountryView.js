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

    model: new (Backbone.Model.extend({
      country: null,
      region: null
    })),

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

      this.listeners();
    },

    render: function(){
      this.$el.html(this.template({
        countries: this.countries.toJSON()
      }));

      this.cache();

      this.renderChosen();
    },

    cache: function() {
      this.$selects = this.$el.find('.chosen-select');
    },

    listeners: function() {
      // Countries collection
      this.countries.on('sync', this.render.bind(this));
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
      this.model.set('region', null);
      this.model.set('country', $(e.currentTarget).val());
    },

    selectRegion: function(e) {
      e && e.preventDefault();
      this.model.set('region', $(e.currentTarget).val());
    },

    /**
     * analyzeCountry
     * @param  {object} e
     * @return {void}
     */
    analyzeCountry: function(e) {
      e && e.preventDefault();
    },

    /**
     * subscribeCountry
     * @param  {object} e
     * @return {void}
     */
    subscribeCountry: function(e) {
      e && e.preventDefault();
    },







    /**
     * LISTENERS
     * 
     * loadRegions
     * @return {void}
     */    



  });
  return AnalysisCountryView;

});
