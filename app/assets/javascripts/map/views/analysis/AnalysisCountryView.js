/* eslint-disable */
/**
 * The AnalysisCountryView selector view.
 *
 * @return AnalysisCountryView instance (extends Backbone.View).
 */
define(
  [
    'underscore',
    'handlebars',
    'amplify',
    'chosen',
    'turf',
    'mps',
    'core/View',
    'helpers/geojsonUtilsHelper',
    'map/presenters/analysis/AnalysisCountryPresenter',
    'text!map/templates/analysis/analysis-country.handlebars'
  ],
  function(
    _,
    Handlebars,
    amplify,
    chosen,
    turf,
    mps,
    View,
    geojsonUtilsHelper,
    Presenter,
    tpl
  ) {
    'use strict';

    var AnalysisCountryView = View.extend({
      el: '#analysis-country-tab',

      template: Handlebars.compile(tpl),

      events: {
        // selects
        'change #analysis-country-select': 'selectIso',
        'change #analysis-region-select': 'selectRegion',
        'change #analysis-subregion-select': 'selectSubRegion',
        // buttons
        'click #analysis-country-button': 'analyzeCountry'
      },

      initialize: function(map, countries) {
        View.prototype.initialize.apply(this);
        this.map = map;
        this.countries = countries;
        this.presenter = new Presenter(this, this.map, this.countries);

        this.render();
      },

      render: function() {
        this.$el.removeClass('-results').html(
          this.template({
            countries: this.countries
          })
        );

        this.cache();

        this.renderChosen();
      },

      cache: function() {
        this.$selects = this.$el.find('.chosen-select');

        // Select
        this.$analysisCountrySelect = this.$el.find('#analysis-country-select');
        this.$analysisRegionSelect = this.$el.find('#analysis-region-select');
        this.$analysisSubRegionSelect = this.$el.find(
          '#analysis-subregion-select'
        );

        // Buttons
        this.$buttonContainer = this.$el.find('#country-button-container');
        this.$analysisBtn = this.$el.find('#analysis-country-button');
        this.$subscribeBtn = this.$el.find('#subscribe-country-button');
      },

      renderChosen: function() {
        this.$selects.chosen({
          width: '100%',
          allow_single_deselect: true,
          inherit_select_classes: true,
          no_results_text: 'Oops, nothing found!'
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
        this.presenter.status.set('iso', {
          country: $(e.currentTarget).val(),
          region: null
        });
      },

      selectRegion: function(e) {
        e && e.preventDefault();
        this.presenter.status.set('iso', {
          country: this.presenter.status.get('iso').country,
          region: $(e.currentTarget).val()
        });
      },

      selectSubRegion: function(e) {
        e && e.preventDefault();
        this.presenter.status.set('iso', {
          country: this.presenter.status.get('iso').country,
          region: this.presenter.status.get('iso').region,
          subRegion: $(e.currentTarget).val()
        });
      },

      /**
       * analyzeCountry
       * @param  {object} e
       * @return {void}
       */
      analyzeCountry: function(e) {
        e && e.preventDefault();
        this.presenter.status.set('isoDisabled', false);
      },

      /**
       * PRESENTER ACTIONS
       *
       * loadRegions
       * @return {void}
       */
      toggleEnabledButtons: function() {
        var iso = this.presenter.status.get('iso');

        if (!!iso && !!iso.country && iso.country != 'ALL') {
          this.$analysisBtn.toggleClass(
            'disabled',
            !this.presenter.status.get('enabled')
          );
          this.$subscribeBtn.toggleClass(
            'disabled',
            !this.presenter.status.get('enabledSubscription')
          );
        } else {
          this.$analysisBtn.toggleClass('disabled', true);
          this.$subscribeBtn.toggleClass('disabled', true);
        }
      },

      setSelects: function() {
        var iso = this.presenter.status.get('iso'),
          country = iso && iso.country != 'ALL' ? iso.country : null,
          region = iso.region,
          subRegion = iso.subRegion;

        // Country
        this.$analysisCountrySelect.val(country).trigger('chosen:updated');

        // Region
        if (!!this.presenter.status.get('regions')) {
          // Append the regions
          this.$analysisRegionSelect.html('');
          _.each(
            this.presenter.status.get('regions'),
            function(region) {
              this.$analysisRegionSelect.append(
                $('<option />')
                  .val(region.id_1)
                  .text(region.name_1)
              );
            }.bind(this)
          );

          // Set the selected value
          this.$analysisRegionSelect
            .val(region)
            .attr('disabled', false)
            .trigger('chosen:updated');

          if (!!this.presenter.status.get('subRegions')) {
            this.$analysisSubRegionSelect.html('<option></option>');
            _.each(
              this.presenter.status.get('subRegions'),
              function(subRegion) {
                this.$analysisSubRegionSelect.append(
                  $('<option />')
                    .val(subRegion.id)
                    .text(subRegion.name)
                );
              }.bind(this)
            );

            this.$analysisSubRegionSelect
              .val(subRegion)
              .attr('disabled', false)
              .trigger('chosen:updated');
          }
        } else {
          // Remove the regions
          this.$analysisRegionSelect.html('');

          // Remove the selected value
          this.$analysisRegionSelect
            .val(null)
            .attr('disabled', true)
            .trigger('chosen:updated');
        }
      },

      /**
       * HELPERS
       * getGeojson
       * @param  {object} overlay
       * @return {object:geojson}
       */
      getGeojson: function(overlay) {
        var paths = overlay.getPath().getArray();
        return geojsonUtilsHelper.pathToGeojson(paths);
      },

      /**
       * deleteGeojson
       * @param undefined
       * @return {void}
       */
      deleteGeojson: function() {
        var overlay = this.presenter.status.get('overlay_country');
        if (!!overlay) {
          overlay.setMap(null);
          this.presenter.status.set('overlay_country', null);
          this.presenter.status.set('geojson_country', null);
        }
      },

      /**
       * showGeojson
       * @param undefined
       * @return {void}
       */
      showGeojson: function() {
        var overlay = this.presenter.status.get('overlay_country');
        this.presenter.status.set('overlay_stroke_weight', 2);
        if (!!overlay) {
          overlay.setOptions({ strokeWeight: 2 });
        }
      },

      /**
       * hideGeojson
       * @param undefined
       * @return {void}
       */
      hideGeojson: function() {
        var overlay = this.presenter.status.get('overlay_country');
        this.presenter.status.set('overlay_stroke_weight', 0);
        if (!!overlay) {
          overlay.setOptions({ strokeWeight: 0 });
        }
      },

      /**
       * drawGeojson
       * @param  {object:geojson} geojson
       * @return {void}
       */
      drawGeojson: function(geojson) {
        // Delete previous overlay if it exists
        this.deleteGeojson();

        var paths = geojsonUtilsHelper.geojsonToPath(geojson);
        var overlay = new google.maps.Polygon({
          paths: paths,
          editable: false,
          strokeWeight: this.presenter.status.get('overlay_stroke_weight'),
          fillOpacity: 0,
          fillColor: '#FFF',
          strokeColor: '#A2BC28'
        });

        overlay.setMap(this.map);

        this.presenter.status.set('overlay_country', overlay, { silent: true });
        this.presenter.status.set('geojson_country', this.getGeojson(overlay), {
          silent: true
        });

        if (this.presenter.status.get('fit_to_geom')) {
          var bounds = geojsonUtilsHelper.getBoundsFromGeojson(geojson);
          this.map.fitBounds(bounds);
        }
      }
    });
    return AnalysisCountryView;
  }
);
