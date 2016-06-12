/**º
 * The LegendPresenter class for the LegendPresenter view.
 *º
 * @return LegendPresenter class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService',
  'map/services/CountryService',
], function(_, Backbone, mps, PresenterClass, layerSpecService, countryService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layerSpec: null,
      threshold: null,
      hresolution: null,
      iso: null,
      layerOptions: []
    },

    toggleLayerOption: function(option) {
      var options = this.get('layerOptions') || [],
          index = options.indexOf(option);
      if (index > -1) {
        options.splice(index, 1);
        this.set('layerOptions', options);
      } else {
        options.push(option);
        this.set('layerOptions', options);
      }
    }
  });

  var LegendPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this.status.set('layerSpec', place.layerSpec);
        this.status.set('threshold', place.params.threshold);
        this.status.set('hresolution', place.params.hresolution);
        this.status.set('layerOptions', place.params.layer_options);

        if(!!place.params.iso.country && place.params.iso.country !== 'ALL'){
          this.status.set('iso', place.params.iso);
        }

        this.updateLegend();
        this.toggleSelected();
        this.toggleLayerOptions();
        this.view.updateLinkToGFW();
      }
    },{
      'Place/update': function(place) {
        this.view.updateLinkToGFW();
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
        this.updateLegend();
        // Toggle sublayers
        this.toggleSelected();
      }
    }, {
      'AnalysisTool/stop-drawing': function() {
        this.view.model.set({ hidden: false });
      }
    }, {
      'AnalysisTool/start-drawing': function() {
        this.view.model.set({ hidden: true });
      }
    }, {
      'Threshold/update': function(threshold) {
        this.status.set('threshold', threshold);
        this.updateLegend();
      }
    }, {
      'Hresolution/update': function(hresolution) {
        this.status.set('hresolution', hresolution);
        this.updateLegend();
      }
    }, {
      'Country/update': function(iso) {
        this.status.set('iso', _.clone(iso));
        this.updateLegend();
      }
    },
    // Mobile events... we should standardise them
    {
      'Dialogs/close': function() {
        this.view.toogleLegend(false);
      }
    }, {
      'LegendMobile/open': function() {
        this.view.toogleLegend();
      }
    }],

    /**
     * Update legend by calling view.update.
     */
    updateLegend: function() {
      var categories = this.status.get('layerSpec').getLayersByCategory(),
          options = {
            threshold: this.status.get('threshold'),
            hresolution: this.getHresolutionParams()
          },
          iso = this.status.get('iso'),
          geographic = !! this.status.get('layerSpec').attributes.geographic_coverage;

      this.view.update(categories, options, geographic, iso);

      // There is no other way...we should refactor the legend behaviour
      this.getCountryMore();
    },

    toggleLayerOption: function(option) {
      this.status.toggleLayerOption(option);
      this.toggleLayerOptions();
      mps.publish('Place/update', [{go: false}]);
    },

    toggleLayerOptions: function() {
      mps.publish('LayerNav/changeLayerOptions',
        [this.status.get('layerOptions')]);
      this.view.toggleLayerOptions(this.status.get('layerOptions') || []);
    },

    /**
     * Toggle selected class sublayers by calling view.toggleSelected.
     */
    toggleSelected: function() {
      this.view.toggleSelected(this.status.get('layerSpec').getLayers());
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];

      layerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    },

    toggleThreshold: function(){
      mps.publish('ThresholdControls/toggle');
    },

    toggleOverlay: function(to){
      mps.publish('Overlay/toggle', [to])
    },

    /**
     * Country bounds
     *
     * @param  {object} iso: {country:'xxx', region: null}
     */
    getCountryMore: function() {
      var iso = this.status.get('iso');

      if(!!iso && !!iso.country && iso.country !== 'ALL'){
        countryService.execute(iso.country, _.bind(function(results) {
          var is_more = (!!results.indepth);
          var is_idn = (!!iso && !!iso.country && iso.country == 'IDN');

          if (is_more) {
            this.view.renderMore({
              name: results.name,
              url: results.indepth,
              is_idn: is_idn
            });
          }

        },this));
      }
    },

    getHresolutionParams: function () {
      if (!!this.status.get('hresolution')) {
        return JSON.parse(atob(this.status.get('hresolution')));
      }
      return {};
    },

    /**
     * Used by PlaceService
     */
    getPlaceParams: function() {
      var params = {};

      var layerOptions = this.status.get('layerOptions');
      if (layerOptions && layerOptions.length > 0) {
        params.layer_options = this.status.get('layerOptions');
      }

      return params;
    }

  });

  return LegendPresenter;
});
