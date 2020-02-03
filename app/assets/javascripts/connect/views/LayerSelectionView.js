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
  'services/CountryService',
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

    initialize: function(map, params) {
      if (!this.$el.length) {
        return;
      }
      this.params = params;

      View.prototype.initialize.apply(this);

      this.map = map;
      this.cache();
      this.listeners();
      this._setParams();

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
      CountryService.getCountries()
        .then(function(results) {
          this.countries = _.sortBy(results, 'name');
          this.renderCountries();
          this.renderCountryLayers();

          if (this.model.attributes.country) {
            this.changeCountry();
          }
          return null;
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
      }]);

      // this.resetLayers();

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
            countries: this._getParsedCountries(isos)
          }));
          this.renderChosen(this.$countryField.find('#select-country'), {
            search: true
          });
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
        layers: this._getParsedLayers(),
        hint: ''
      }));
      this.renderChosen(this.$layersField.find('#select-layers'));
    },

    renderCountryLayers: function() {
      this.$layersCountryField.html(this.templateLayers({
        id: 'select-country-layers',
        name: '',
        placeholder: 'Select a data set...',
        layers: (!_.isEmpty(this.countryLayers)) ? this._getParsedCountryLayers() : null,
        hint: ''
      }));
      this.renderChosen(this.$layersCountryField.find('#select-country-layers'));
    },

    renderChosen: function(el, searchOption) {
      var opts = {
        width: '100%',
        disable_search: true,
        allow_single_deselect: true,
        inherit_select_classes: true
      };

      if (searchOption && searchOption.search) {
        opts.disable_search = false;
        opts.no_results_text = 'Oops, nothing found!';
      }

      el.chosen(opts);
    },

    resetLayers: function() {
      LayerSpecService._removeAllLayers();
      this.model.set({
        layerSelectId: '',
        layers: []
      });
    },

    /**
     * Sets params from the URL
     */
    _setParams: function() {
      if (this.params.activeLayers) {
        this.model.set({
          layers: [this.params.activeLayers]
        }, { silent: true });
        this.changeLayers();
      }
      if (this.params.params.iso.country) {
        this.model.set({
          country: this.params.params.iso.country
        }, { silent: true });
      }
    },

    _getParsedLayers: function() {
      var layersGroup = {};
      var selectedLayer = this.model.attributes.layers &&
        this.model.attributes.layers[0] ? this.model.attributes.layers[0] : null;

      _.each(this.layers, function(group, key) {
        var currentGroup = _.extend({}, group);
        currentGroup = _.map(currentGroup, function(layer) {
          var currentLayer = _.extend({}, layer);
          if (selectedLayer && currentLayer.slug === selectedLayer) {
            currentLayer.selected = true;
          }
          return currentLayer;
        });
        layersGroup[key] = currentGroup;
      });

      return layersGroup;
    },

    _getParsedCountries: function(isos) {
      var countriesData = [];
      var selectedCountry = this.model.attributes.country || null;
      var countries = _.filter(this.countries, function(country) {
        return (isos.indexOf(country.iso) != -1)
      });

      _.each(countries, function(country) {
        var currentCountry = _.extend({}, country);
        if (selectedCountry && currentCountry.iso === selectedCountry) {
          currentCountry.selected = true;
        }
        countriesData.push(currentCountry);
      });

      return countriesData;
    },

    _getParsedCountryLayers: function() {
      var layersGroup = {};
      var selectedLayer = this.model.attributes.layers &&
        this.model.attributes.layers[0] ? this.model.attributes.layers[0] : null;

      _.each(this.countryLayers, function(group, key) {
        var currentGroup = _.extend({}, group);
        currentGroup = _.map(currentGroup, function(layer) {
          var currentLayer = _.extend({}, layer);
          if (selectedLayer && layer.slug === selectedLayer) {
            currentLayer.selected = true;
          }
          return currentLayer;
        });
        layersGroup[key] = currentGroup;
      });

      return layersGroup;
    },

    /**
     * UI EVENTS
     * - onChangeCountry
     * - onChangeLayer
    */
    onChangeCountry: function(e) {
      e && e.preventDefault();
      //
      mps.publish('MapSelection/clear', []);

      var country = $(e.currentTarget).val();
      this.model.set({
        country: country,
        layers: []
      });
      this.renderLayers();

      // mps.publish('Datasets/clear', []);
      mps.publish('Selected/reset', []);
    },

    onChangeLayer: function(e) {
      mps.publish('MapSelection/clear', []);

      e && e.preventDefault();
      var layers = [$(e.currentTarget).val()];
      var id = $(e.currentTarget).attr('id');

      if (id === 'select-layers') {
        this.model.set({
          country: null,
          region: null
        }, { silent: true });

        mps.publish('Country/update', [{
          country: null,
          region: null
        }]);

        this.countryLayers = [];
        this.renderCountries();
        this.renderCountryLayers();
      }

      this.model.set({
        layers: _.clone(layers),
        layerSelectId: id
      });

      // mps.publish('Datasets/clear', []);
      mps.publish('Selected/reset', []);
    }
  });

  return LayerSelectionView;

});
