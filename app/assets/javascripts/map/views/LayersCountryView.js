/**
 * The layers filter module.
 *
 * @return singleton instance of layers fitler class (extends Backbone.View).
 */
define([
  'backbone',
  'underscore',
  'chosen',
  'map/presenters/LayersCountryPresenter',
  'map/collections/CountryCollection',
  'handlebars',
  'text!map/templates/layersCountry.handlebars',
  'text!map/templates/layersCountryAtlas.handlebars',
], function(Backbone, _, chosen, Presenter, CountryCollection, Handlebars, tpl, tplAtlas) {

  'use strict';

  var LayersCountryModel = Backbone.Model.extend({});


  var LayersCountryView = Backbone.View.extend({

    el: '#country-layers',

    template: Handlebars.compile(tpl),
    templateAtlas: Handlebars.compile(tplAtlas),

    model: new (Backbone.Model.extend({
      country: null,
      countryName: null,
      countryLayers: null
    })),

    events: {
      'change #layers-country-select' : 'changeIso',
      'click #layers-country-reset' : 'resetIso',
      'click #layers-country-analyze' : 'analyzeIso',
      'click #layers-country-subscribe' : 'subscribeIso',
    },

    initialize: function(map, countries) {
      // Init presenter
      this.presenter = new Presenter(this);        
      this.map = map;
      this.countries = countries;
      
      this.listeners();
    },

    render: function() {
      this.$el.html(this.template({
        countries: this.countries.toJSON(),
        country: this.model.get('country'),
        countryName: this.model.get('countryName') || 'Country',
        countryLayers: this.model.get('countryLayers')
      }));
      
      this.cache();
      this.renderChosen();
    },

    cache: function() {
      this.$select = this.$el.find('#layers-country-select');
      this.$selectChosenId = '#layers_country_select_chosen';
      this.$atlas = this.$el.find('#layers-country-atlas');

      this.$btnAnalysis = this.$el.find('#layers-country-analyze');
      this.$btnSubscribe = this.$el.find('#layers-country-subscribe');
    },

    listeners: function() {
      this.countries.on('sync', this.render.bind(this));
      this.model.on('change:country', this.setCountryLayers.bind(this));
    },

    // Plugins & helpers    
    renderChosen: function() {
      this.$select.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      })

      this.$select.trigger('chosen:open');

      // BUG:solved, whenever you mousedown inside chosen container the scroll of the countries go back to top
      // It would be nice if we can improve this code :)
      $(this.$selectChosenId + ' .chosen-results, '+this.$selectChosenId+' .chosen-single').on("mousedown", function(e){
        e && e.stopPropagation() && e.preventDefault();
        if (!$(e.currentTarget).hasClass('chosen-results')) {
          this.$select.trigger('chosen:open');  
        }
        return false;
      }.bind(this))
    },

    renderAtlas: function(data) {
      this.$atlas.html(this.templateAtlas(data));
    },

    // SETTERS
    setLayers: function(layers) {
      this.model.set('layers', layers);
    },

    setCountry: function(iso) {
      var country = (!!iso && !!iso.country) ? iso.country : null; 
      var countryName = (!!iso && !!iso.country) ? _.findWhere(this.countries.toJSON(), {iso: iso.country }).name : null;
      this.model.set('countryName', countryName);
      this.model.set('country', country);
    },

    setCountryLayers: function() {
      var country = this.model.get('country'),
          layers = this.model.get('layers'),
          countryLayers = (!!country) ? _.where(layers, {iso: country}) : null;
      
      // Set country layers, if they don't exists we need to 
      // set it to null because visualization depends 
      // on the existence of countryLayers
      this.model.set('countryLayers', countryLayers);
      
      this.render();
    },

    // EVENTS //
    changeIso: function(e) {
      var country = this.$select.val();
      this.presenter.publishIso({
        country: country, 
        region: null
      });
    },

    resetIso: function() {      
      this.presenter.publishIso({
        country: null, 
        region: null
      });
    },

    resetCountryLayers: function(){
      _.each(this.model.get('countryLayers'),_.bind(function(layer){
        this.presenter._removeLayer(layer);
      }, this ))
    },

    analyzeIso: function(e) {
      e && e.preventDefault();
      this.presenter.analyzeIso();
    },

    subscribeIso: function(e) {
      e && e.preventDefault();
      this.presenter.subscribeIso();
    },

    setAnalysisButtonStatus: function(boolean) {
      this.$btnAnalysis.toggleClass('-disabled', !boolean);
    },

    setSubscribeButtonStatus: function(boolean) {
      this.$btnSubscribe.toggleClass('-disabled', !boolean);
    }

  });

  return LayersCountryView;

});
