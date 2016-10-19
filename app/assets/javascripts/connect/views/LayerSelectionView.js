/**
 * The LayerSelectionView view.
 *
 * @return LayerSelectionView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'core/View',
  'map/services/LayerSpecService',
  'map/services/CountryService',
  'text!connect/templates/countrySelection.handlebars',
  'text!connect/templates/layerSelection.handlebars',
], function(_, Handlebars, mps, View, LayerSpecService, CountryService, countryTpl, layerTpl) {

  'use strict';

  var LayerSelectionView = View.extend({
    model: new (Backbone.Model.extend({
      country: null,
      layers: null,
      layerSelectId: null
    })),

    el: '#layer-selection',

    templateCountries: Handlebars.compile(countryTpl),
    templateLayers: Handlebars.compile(layerTpl),

    events: {
      'change .js-select-country' : 'onChangeCountry',
      'change .js-select-layer' : 'onChangeLayer',
    },

    initialize: function(map) {
      if (!this.$el.length) {
        return;
      }

      View.prototype.initialize.apply(this);

      this.map = map;
      this.cache();
      this.listeners();

      // Load global layers
      LayerSpecService._getAllLayers(
        // Filter
        function(layer){
          return !layer.iso && !!layer.analyzable;
        }.bind(this),

        // Success
        function(layers){
          this.layers = _.groupBy(_.sortBy(layers, 'title'), 'category_name');
          this.renderLayers();
        }.bind(this),

        // Error
        function(error){
          console.log(error);
        }.bind(this)
      );

      // Load countries
      CountryService.get()
        .then(function(results) {
          this.countries = results.countries;
          this.renderCountries();
          this.renderCountryLayers();
        }.bind(this))

        .error(function(error) {
          console.log(error);
        }.bind(this))
    },

    listeners: function() {
      this.listenTo(this.model, 'change:country', this.changeCountry.bind(this));
      this.listenTo(this.model, 'change:layers', this.changeLayers.bind(this));
      this.listenTo(this.model, 'change:layerSelectId', this.changeLayerSelectId.bind(this));
    },

    cache: function() {
      this.$layersField = this.$el.find('#layers-field');
      this.$layersCountryField = this.$el.find('#layers-country-field');
      this.$countryField = this.$el.find('#country-field');
    },


    /**
     * CHANGE EVENTS
    */
    changeCountry: function() {
      var country = this.model.get('country');

      // Publish the current country selection
      mps.publish('Country/update', [{
        country: country,
        region: null
      }])

      LayerSpecService._getAllLayers(
        // Filter
        function(layer){
          return layer.iso == country && !!layer.analyzable;
        }.bind(this),

        // Success
        function(layers){
          this.countryLayers = _.groupBy(_.sortBy(layers, 'title'), 'category_name');
          this.renderCountryLayers();
        }.bind(this),

        // Error
        function(error){
          console.log(error);
        }.bind(this)
      );

    },

    changeLayers: function() {
      var layers = this.model.get('layers');
      var where = [{ slug: layers[0] }];

      LayerSpecService._removeAllLayers();

      LayerSpecService.toggle(where,
        function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }.bind(this));
    },

    changeLayerSelectId: function() {
      var layerSelectId = this.model.get('layerSelectId');
      _.each(this.$el.find('select.js-select-layer'), function(select){
        var id = $(select).attr('id');

        if (id != layerSelectId) {
          $(select).val('').trigger('chosen:updated');
        }
      }.bind(this));
    },


    /**
     * RENDERS
    */
    renderCountries: function() {
      // Filter to show only the countries that have layers
      LayerSpecService._getAllLayers(
        // Filter
        function(layer){
          return !!layer.iso && !!layer.analyzable;
        }.bind(this),

        // Success
        function(layers){
          var isos = _.uniq(_.pluck(layers, 'iso'));

          this.$countryField.html(this.templateCountries({
            name: 'Select an area from a country-specific data set',
            placeholder: 'Select a country...',
            countries: _.filter(this.countries, function(country) {
              return (isos.indexOf(country.iso) != -1)
            })
          }));
          this.renderChosen();

        }.bind(this),

        // Error
        function(error){
          console.log(error);
        }.bind(this)
      );
    },

    renderLayers: function() {
      this.$layersField.html(this.templateLayers({
        id: 'select-layers',
        name: 'Select an area from a global data set',
        placeholder: 'Select a data set...',
        layers: this.layers,
        hint: 'Select an area by clicking a shape on the map'
      }));
      this.renderChosen();
    },

    renderCountryLayers: function() {
      this.$layersCountryField.html(this.templateLayers({
        id: 'select-country-layers',
        name: '',
        placeholder: 'Select a data set...',
        layers: (!_.isEmpty(this.countryLayers)) ? this.countryLayers : null,
        hint: ''
      }));
      this.renderChosen();
    },

    renderChosen: function() {
      _.each(this.$el.find('select'), function(select){
        var $select = $(select);
        if (! !!$select.data('chosen')) {
          $select.chosen({
            width: '100%',
            disable_search: true,
            allow_single_deselect: true,
            inherit_select_classes: true,
            no_results_text: "Oops, nothing found!"
          });
        }
      });
    },

    /**
     * UI EVENTS
     * - onChangeCountry
     * - onChangeLayer
    */
    onChangeCountry: function(e) {
      e && e.preventDefault();
      var country = $(e.currentTarget).val();
      this.model.set({
        country: country,
        layers: (! !!country) ? [] : this.model.get('layers')
        // layers: [],
      });
    },

    onChangeLayer: function(e) {
      e && e.preventDefault();
      var layers = [$(e.currentTarget).val()];
      var id = $(e.currentTarget).attr('id');

      this.model.set({
        layers: _.clone(layers),
        layerSelectId: id
      });
    }
  });

  return LayerSelectionView;

});
