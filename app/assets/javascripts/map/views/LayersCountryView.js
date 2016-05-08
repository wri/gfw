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
], function(Backbone, _, chosen, Presenter, CountryCollection, Handlebars, tpl) {

  'use strict';

  var LayersCountryModel = Backbone.Model.extend({});


  var LayersCountryView = Backbone.View.extend({

    el: '#country-layers',

    template: Handlebars.compile(tpl),

    model: new (Backbone.Model.extend({
      country: null,
      countryName: null,
      countryLayers: null
    })),

    events: {
      'change #layers-country-select' : 'changeIso',
      'click #layers-country-reset' : 'resetIso'
    },

    initialize: function() {
      // Init presenter
      this.presenter = new Presenter(this);        

      // Init country service
      this.countries = new CountryCollection();
      this.countries.fetch().done(function(){
        this.render();
      }.bind(this))

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
      this.chosen();
    },

    cache: function() {
      this.$select = this.$el.find('#layers-country-select');
    },

    listeners: function() {
      this.model.on('change:country', this.setCountryLayers.bind(this));
    },

    // Plugins    
    chosen: function() {
      this.$select.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
      this.$select.trigger('liszt:open');
    },

    // Layers
    setLayers: function(layers) {
      this.model.set('layers', layers);
    },

    setCountryLayers: function() {
      var country = this.model.get('country');
      var layers = this.model.get('layers');
      if (!!country) {
        var countryLayers = _.where(layers, {iso: country});
        this.model.set('countryLayers', countryLayers);
      } else {
        this.model.set('countryLayers', null);
      }
      this.render();
    },

    // Country
    setCountry: function(iso) {
      var country = (!!iso && !!iso.country) ? iso.country : null; 
      var countryName = (!!iso && !!iso.country) ? _.findWhere(this.countries.toJSON(), {iso: iso.country }).name : null;
      this.model.set('countryName', countryName);
      this.model.set('country', country);
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
    }

  });

  return LayersCountryView;

});
