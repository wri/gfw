/**
 * The Countries.
 *
 */
define([
  'backbone',
  'underscore',
  'chosen',
  'map/presenters/tabs/CountriesPresenter',
  'map/collections/CountryCollection',
  'handlebars',
  'text!map/templates/tabs/countries.handlebars',
  'text!map/templates/tabs/countriesMore.handlebars',
], function(Backbone, _, chosen, Presenter, CountryCollection, Handlebars, tpl, tplMore) {

  'use strict';

  var LayersCountryView = Backbone.View.extend({

    el: '#countries-tab',

    template: Handlebars.compile(tpl),
    templateMore: Handlebars.compile(tplMore),

    model: new (Backbone.Model.extend({
      country: null,
      countryName: null,
      countryLayers: null
    })),

    events: {
      'change #countries-country-select' : 'changeIso'
    },

    initialize: function(map, countries) {
      // Init presenter
      this.presenter = new Presenter(this);        
      this.map = map;
      this.countries = countries;
      
      this.render();
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

    listeners: function() {
      this.model.on('change:country', this.setCountryLayers.bind(this));
    },

    cache: function() {
      this.$select = this.$el.find('#countries-country-select');
      this.$more = this.$el.find('#countries-more');
    },

    more: function(data) {
      this.$more.html(this.templateMore(data));
    },

    // Plugins    
    chosen: function() {
      this.$select.val(this.model.get('country'));
      this.$select.chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      })
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

      this.presenter.countryMore();
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

    // LAYERS
    toggleSelected: function(layers) {
      var activeLayers = _.keys(layers);
      _.each(this.model.get('countryLayers'), function(layer){

        var $layer = this.$el.find('[data-layer="'+layer.slug+'"]'),
            $toggle = $layer.find('.onoffradio, .onoffswitch'),
            // Is selected?
            is_selected = _.contains(activeLayers, layer.slug);

        // Toggle simple layers
        $layer.toggleClass('selected', is_selected);
        $toggle.toggleClass('checked', is_selected).css('background', (is_selected) ? layer.title_color : '');

        // Toggle wrapped layers

      }.bind(this));
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

  });

  return LayersCountryView;

});
