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
  (_, Handlebars, mps, View, CountryService, countryTpl, regionTpl) => {
    const CountrySelectionView = View.extend({
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

      initialize(map, params) {
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
          .then(
            (results) => {
              this.countries = _.sortBy(results, 'name');
              this.renderCountries();
              this.renderRegions();
            }
          )

          .error((error) => {
            console.log(error);
          });
      },

      listeners() {
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

      cache() {
        this.$countryField = this.$el.find('#country-field');
        this.$regionField = this.$el.find('#region-field');
      },

      /**
       * Sets params from the URL
       */
      _setParams() {
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
      changeCountry() {
        const country = this.model.get('country');

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
          (results) => {
            this.regions = results;
            this.renderRegions();
          }
        );
      },

      changeRegion() {
        const country = this.model.get('country');
        const region = this.model.get('region');

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
      renderCountries() {
        this.$countryField.html(
          this.templateCountries({
            name: 'Select a country',
            placeholder: 'Select a country...',
            countries: this._getParsedCountries()
          })
        );
        this.renderChosen();
      },

      renderRegions() {
        this.$regionField.html(
          this.templateRegions({
            name: 'Select a jurisdiction',
            placeholder: 'Select a jurisdiction...',
            regions: this._getParsedRegions()
          })
        );

        // Set the state of the region select
        const disabled = !this.model.get('country');
        const $regionSelect = this.$regionField.find('select');
        $regionSelect
          .toggleClass('disabled', disabled)
          .prop('disabled', disabled);

        this.renderChosen();
      },

      renderChosen() {
        _.each(this.$el.find('select'), (select) => {
          const $select = $(select);
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

      _getParsedCountries() {
        const countriesData = [];
        const selectedCountry = this.model.attributes.country || null;

        _.each(this.countries, (country) => {
          const currentCountry = _.extend({}, country);
          if (selectedCountry && currentCountry.iso === selectedCountry) {
            currentCountry.selected = true;
          }
          countriesData.push(currentCountry);
        });

        return countriesData;
      },

      _getParsedRegions() {
        const regionsData = [];
        const selectedRegion = parseInt(this.model.attributes.region, 10) || null;

        _.each(this.regions, (region) => {
          const currentRegion = _.extend({}, region);
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
      onChangeCountry(e) {
        e && e.preventDefault();
        const country = $(e.currentTarget).val();
        this.model.set({
          country,
          region: null
        });
      },

      onChangeRegion(e) {
        e && e.preventDefault();
        const region = $(e.currentTarget).val();
        this.model.set('region', region);
      }
    });

    return CountrySelectionView;
  }
);
