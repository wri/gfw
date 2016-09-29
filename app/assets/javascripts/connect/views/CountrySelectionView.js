/**
 * The CountrySelectionView view.
 *
 * @return CountrySelectionView view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'map/services/CountryService',
  'map/services/RegionService',
  'text!connect/templates/countrySelection.handlebars',
  'text!connect/templates/regionSelection.handlebars',
], function(_, Handlebars, mps, CountryService, RegionService, countryTpl, regionTpl) {

  'use strict';

  var CountrySelectionView = Backbone.View.extend({
    model: new (Backbone.Model.extend({
      country: null,
      region: null,
    })),

    el: '#country-selection',

    templateCountries: Handlebars.compile(countryTpl),
    templateRegions: Handlebars.compile(regionTpl),

    events: {
      'change .js-select-country' : 'onChangeCountry',
      'change .js-select-region' : 'onChangeRegion',
    },

    initialize: function(map) {
      if (!this.$el.length) {
        return;
      }

      // Load countries
      CountryService.get()
        .then(function(results) {
          this.countries = results.countries;
          this.renderCountries();
          this.renderRegions();
        }.bind(this))

        .error(function(error) {
          console.log(error);
        }.bind(this))

      this.map = map;
      this.cache();
      this.listeners();
    },

    listeners: function() {
      // We should start using listenTo and handle the remove views
      this.model.on('change:country', this.changeCountry.bind(this));
      this.model.on('change:region', this.changeRegion.bind(this));
    },

    cache: function() {
      this.$countryField = this.$el.find('#country-field');
      this.$regionField = this.$el.find('#region-field');
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

      // Get the regions for this country
      RegionService.get(country)
        .then(function(results) {
          this.regions = results.rows;
          this.renderRegions();
        }.bind(this))
    },

    changeRegion: function() {
      var country = this.model.get('country');
      var region = this.model.get('region');
      if (!!region) {
        // Publish the current country-region selection
        mps.publish('Country/update', [{
          country: country,
          region: region
        }])
      }
    },


    /**
     * RENDERS
    */
    renderCountries: function() {
      this.$countryField.html(this.templateCountries({
        name: 'Country',
        placeholder: 'Select a country',
        countries: this.countries
      }));
      this.renderChosen();
    },

    renderRegions: function() {
      this.$regionField.html(this.templateRegions({
        regions: this.regions
      }));

      // Set the state of the region select
      var disabled = (!!this.model.get('country')) ? false : true;
      var $regionSelect = this.$regionField.find('select');
      $regionSelect
        .toggleClass('disabled', disabled)
        .prop('disabled', disabled);

      this.renderChosen();
    },

    renderChosen: function() {
      _.each(this.$el.find('select'), function(select){
        var $select = $(select);
        if (! !!$select.data('chosen')) {
          $select.chosen({
            width: '100%',
            disable_search: true,
            inherit_select_classes: true,
            no_results_text: "Oops, nothing found!"
          });
        }
      });
    },

    /**
     * UI EVENTS
    */
    onChangeCountry: function(e) {
      e && e.preventDefault();
      var country = $(e.currentTarget).val();
      this.model.set({
        country: country,
        region: null
      });
    },

    onChangeRegion: function(e) {
      e && e.preventDefault();
      var region = $(e.currentTarget).val();
      this.model.set('region', region);
    },

  });

  return CountrySelectionView;

});
