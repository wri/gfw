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
      'change #countries-country-select' : 'changeIso',
      'click .layer': 'toggleLayer',
      'click .wrapped-layer': 'toggleWrappedLayer',
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

    // SELECTED LAYERS
    _toggleSelected: function(layers) {
      var activeLayers = _.keys(layers);
      
      _.each(this.model.get('countryLayers'), function(layer){
        if (!layer.wrappers) {
          // Toggle simple layers
          var $layer = this.$el.find('[data-layer="'+layer.slug+'"]'),
              $toggle = $layer.find('.onoffradio, .onoffswitch'),
              // Is selected?
              is_selected = _.contains(activeLayers, layer.slug);
          
          $layer.toggleClass('selected', is_selected);
          $toggle.toggleClass('checked', is_selected).css('background', (is_selected) ? layer.title_color : '');
        
        } else {
          // Toggle wrapped layers
          var $wraplayer = this.$el.find('[data-layer="'+layer.slug+'"]'),
              $wraptoggle = $wraplayer.find('.onoffradio, .onoffswitch'),
              layers = layer.wrappers,
              is_wrapSelected = false;

          _.each(layer.wrappers, function(_layer){
            var $layer = this.$el.find('[data-layer="'+_layer.slug+'"]'),
                is_selected = _.contains(activeLayers, _layer.slug);

            $layer.toggleClass('selected', is_selected);
            
            if (is_selected) {
              is_wrapSelected = true;
            }

          }.bind(this));

          $wraplayer.toggleClass('selected', is_wrapSelected);
          $wraptoggle.toggleClass('checked', is_wrapSelected).css('background', (is_wrapSelected) ? '#cf7fec' : '');

        }
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

    toggleLayer: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      var is_source = $(e.target).hasClass('source') || $(e.target).parents().hasClass('source');
      var is_wrapped = $(e.target).hasClass('wrapped') || $(e.target).parents().hasClass('wrapped');
      
      // this prevents layer change when you click in source link or in a wrapped layer
      if (!is_source && !is_wrapped) {
        var layerSlug = $(e.currentTarget).data('layer');
        this.publishToggleLayer(layerSlug);
      }      
    },

    toggleWrappedLayer: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      var is_source = $(e.target).hasClass('source') || $(e.target).parents().hasClass('source');
      var is_wrapped = $(e.target).hasClass('wrapped');
      var $layers = $(e.currentTarget).find('.layer');

      if (!is_source) {
        if (is_wrapped) {
          // selected index & clicked index
          var $selected = $layers.filter('.selected'),
              indexSelected = $layers.index($selected),

              $clicked = $layers.filter($(e.target)),
              index = $layers.index($clicked);

          if (indexSelected != index) {
            var layerSlug = $($layers[indexSelected]).data('layer');
            this.publishToggleLayer(layerSlug);
          }

        } else {
          var $selected = $layers.filter('.selected'),
              index = ($layers.index($selected) == -1) ? 0 : $layers.index($selected);          
        }

        // Publish toggle layer
        var layerSlug = $($layers[index]).data('layer')
        this.publishToggleLayer(layerSlug);
      }
    },

    publishToggleLayer: function(layerSlug) {
      this.presenter._toggleLayer(layerSlug);
      ga('send', 'event', 'Map', 'Toggle', 'Layer: ' + layerSlug);
    }

  });

  return LayersCountryView;

});
