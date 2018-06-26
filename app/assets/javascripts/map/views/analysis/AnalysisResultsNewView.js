/* eslint-disable */
/**
 * The AnalysisResultsNewView view.
 *
 * @return AnalysisResultsNewView view
 */
define(
  [
    'underscore',
    'handlebars',
    'enquire',
    'map/presenters/analysis/AnalysisResultsNewPresenter',
    'text!map/templates/analysis/analysis-results.handlebars',
    'text!map/templates/analysis/analysis-results-error.handlebars'
  ],
  function(_, Handlebars, enquire, Presenter, tpl, errorTpl) {
    'use strict';

    var AnalysisResultsNewView = Backbone.View.extend({
      templates: {
        success: Handlebars.compile(tpl),
        error: Handlebars.compile(errorTpl)
      },

      types: [
        // GEOSTORE
        {
          el: '#analysis-draw-tab',
          type: 'draw'
        },

        // COUNTRY
        {
          el: '#analysis-country-tab',
          type: 'country'
        },

        // SHAPE
        {
          el: '#analysis-shape-tab',
          type: 'use'
        },
        {
          el: '#analysis-shape-tab',
          type: 'wdpaid'
        }
      ],

      initialize: function(map, countries) {
        this.map = map;
        this.countries = countries;
        this.presenter = new Presenter(this);

        enquire.register(
          'screen and (min-width:' + window.gfw.config.GFW_MOBILE + 'px)',
          {
            match: _.bind(function() {
              this.mobile = false;
            }, this)
          }
        );
        enquire.register(
          'screen and (max-width:' + window.gfw.config.GFW_MOBILE + 'px)',
          {
            match: _.bind(function() {
              this.mobile = true;
            }, this)
          }
        );
      },

      render: function() {
        var el = this.setEl();
        var country = this.presenter.status.get('iso').country;
        var showRegions = this._showRegions();

        // Set element to render
        this.setElement(el);

        this.$el.addClass('-results').html(
          this.templates.success({
            resource: this.presenter.status.get('resource'),
            countries: !!country && country != 'ALL' ? this.countries : null,
            showRegions: showRegions,
            showSubRegions: showRegions
          })
        );

        this.cache();
        this.renderChosen();
        this.setSelects();
      },

      renderError: function() {
        var type = this.presenter.status.get('type');
        if (!!type) {
          this.setElement(this.setEl());
          this.$el.addClass('-results').html(
            this.templates.error({
              errors: this.presenter.status.get('errors')
            })
          );
        }
      },

      cache: function() {
        this.$selects = this.$el.find('.chosen-select');

        // Select
        this.$analysisCountrySelect = this.$el.find('#analysis-country-select');
        this.$analysisRegionSelect = this.$el.find('#analysis-region-select');
        this.$analysisSubRegionSelect = this.$el.find(
          '#analysis-subregion-select'
        );
      },

      /**
       * UI EVENTS
       * - onClickDelete
       */

      /**
       * HELPERS
       * - setEl
       */
      setEl: function() {
        var type = this.presenter.status.get('type');
        return _.findWhere(this.types, { type: type }).el;
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
          this.$analysisRegionSelect.html('<option></option>');
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
          this.$analysisRegionSelect.html('<option></option>');
          this.$analysisSubRegionSelect.html('<option></option>');

          // Remove the selected value
          this.$analysisRegionSelect
            .val(null)
            .attr('disabled', true)
            .trigger('chosen:updated');
          this.$analysisSubRegionSelect
            .val(null)
            .attr('disabled', true)
            .trigger('chosen:updated');
        }
      },

      renderChosen: function() {
        this.$selects.chosen({
          width: '100%',
          allow_single_deselect: true,
          inherit_select_classes: true,
          no_results_text: 'Oops, nothing found!'
        });
      },

      // Temp to disable GLAD and terra-i
      _showRegions: function() {
        var layers = this.presenter.status.attributes.baselayers_full;
        var layersSlugs = [];
        var showRegions = true;

        _.each(layers, function(val, key) {
          layersSlugs.push(key);
        });

        if (layersSlugs.indexOf('terrailoss') !== -1) {
          showRegions = false;
        }
        return showRegions;
      }
    });

    return AnalysisResultsNewView;
  }
);
