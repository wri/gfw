/**
 * The CountrySelectionView view.
 *
 * @return CountrySelectionView view (extends Backbone.View)
 */
define(
  [
    'underscore',
    'handlebars',
    'mps',
    'core/View',
    'services/CountryService',
    'text!connect/templates/countrySelection.handlebars',
    'text!connect/templates/regionSelection.handlebars'
  ],
  function(_, Handlebars, mps, View, CountryService, countryTpl, regionTpl) {
    var CountrySelectionView = View.extend({
      model: new (Backbone.Model.extend({
        country: null,
        region: null
      }))(),

      el: '#country-selection',

      templateCountries: Handlebars.compile(countryTpl),
      templateRegions: Handlebars.compile(regionTpl),

      events: {
        'change .js-select-country': 'onChangeCountry',
        'change .js-select-region': 'onChangeRegion'
      },

      initialize: function(map, params) {
        if (!this.$el.length) {
          return;
        }

        View.prototype.initialize.apply(this);

        this.params = params;
        this.map = map;
        this.cache();
        this.listeners();
        this._setParams();

        // Load countries
        CountryService.getCountries()
          .then(function(results) {
            this.countries = _.sortBy(results, 'name');
            this.renderCountries();
            this.renderRegions();
          }.bind(this))

          .error(function(error) {
            console.log(error);
          });
      },

      listeners: function() {
        // We should start using listenTo and handle the remove views
        this.listenTo(
          this.model,
          'change:country',
          this.changeCountry.bind(this)
        );
        this.listenTo(
          this.model,
          'change:region',
          this.changeRegion.bind(this)
        );
      },

      cache: function() {
        this.$countryField = this.$el.find('#country-field');
        this.$regionField = this.$el.find('#region-field');
      },

      /**
       * Sets params from the URL
       */
      _setParams: function() {
        if (this.params.params.iso.country) {
          this.model.set(
            {
              country: this.params.params.iso.country
            },
            { silent: true }
          );
          this.changeCountry();
        }

        if (this.params.params.iso.region) {
          this.model.set(
            {
              region: this.params.params.iso.region
            },
            { silent: true }
          );
          this.changeRegion();
        }
      },

      /**
       * CHANGE EVENTS
       */
      changeCountry: function() {
        var country = this.model.get('country');

        // Publish the current country selection
        mps.publish('Country/update', [
          {
            country,
            region: null
          }
        ]);

        mps.publish('Datasets/refresh', []);

        // Get the regions for this country
        CountryService.getRegionsList({ iso: country }).then(
            function(results) {
            this.regions = results;
            this.renderRegions();
          }.bind(this)
        );
      },

      changeRegion: function() {
        var country = this.model.get('country');
        var region = this.model.get('region');

        // Publish the current country-region selection
        mps.publish('Country/update', [
          {
            country,
            region
          }
        ]);

        mps.publish('Datasets/refresh', []);
      },

      /**
       * RENDERS
       */
      renderCountries: function() {
        this.$countryField.html(
          this.templateCountries({
            name: 'Select a country',
            placeholder: 'Select a country...',
            countries: this._getParsedCountries()
          })
        );
        this.renderChosen();
      },

      renderRegions: function() {
        this.$regionField.html(
          this.templateRegions({
            name: 'Select a jurisdiction',
            placeholder: 'Select a jurisdiction...',
            regions: this._getParsedRegions()
          })
        );

        // Set the state of the region select
        var disabled = !this.model.get('country');
        var $regionSelect = this.$regionField.find('select');
        $regionSelect
          .toggleClass('disabled', disabled)
          .prop('disabled', disabled);

        this.renderChosen();
      },

      renderChosen: function() {
        _.each(this.$el.find('select'), function(select) {
          var $select = $(select);
          if (!$select.data('chosen')) {
            $select.chosen({
              width: '100%',
              allow_single_deselect: true,
              inherit_select_classes: true,
              no_results_text: 'Oops, nothing found!'
            });
          }
        });
      },

      _getParsedCountries: function() {
        var countriesData = [];
        var selectedCountry = this.model.attributes.country || null;

        _.each(this.countries, function(country) {
          var currentCountry = _.extend({}, country);
          if (selectedCountry && currentCountry.iso === selectedCountry) {
            currentCountry.selected = true;
          }
          countriesData.push(currentCountry);
        });

        return countriesData;
      },

      _getParsedRegions: function() {
        var regionsData = [];
        var selectedRegion =
          parseInt(this.model.attributes.region, 10) || null;

        _.each(this.regions, function(region) {
          var currentRegion = _.extend({}, region);
          if (selectedRegion && currentRegion.id_1 === selectedRegion) {
            currentRegion.selected = true;
          }
          regionsData.push(currentRegion);
        });

        return regionsData;
      },

      /**
       * UI EVENTS
       */
      onChangeCountry: function(e) {
        e && e.preventDefault();
        var country = $(e.currentTarget).val();
        this.model.set({
          country,
          region: null
        });
      },

      onChangeRegion: function(e) {
        e && e.preventDefault();
        var region = $(e.currentTarget).val();
        this.model.set('region', region);
      }
    });

    return CountrySelectionView;
  }
);
