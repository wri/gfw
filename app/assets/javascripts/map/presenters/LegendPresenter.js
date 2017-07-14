/**º
 * The LegendPresenter class for the LegendPresenter view.
 *º
 * @return LegendPresenter class.
 */
define([
  'underscore',
  'backbone',
  'bluebird',
  'mps',
  'moment',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService',
  'services/CountryService',
], function(_, Backbone, Promise, mps, moment, PresenterClass, layerSpecService, CountryService) {

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
        this.status.set('startYear', moment.utc(place.params.begin).year());

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
      'LayerNav/change': function(layerSpec) { //third part
        this.status.set('layerSpec', layerSpec);
        this.updateLegend();
        // Toggle sublayers
        this.toggleSelected();
      }
    }, {
      'LayerOptions/update': function(options) {
        this.status.set({
          layerOptions: options
        });
        this.toggleLayerOptions();
      }
    }, {
      'LayerOptions/delete': function() {
        this.status.set({
          layerOptions: []
        });
        this.toggleLayerOptions({
          reset: true
        });
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
    },{
      'Analysis/iso': function(iso,isoDisabled) {
        if(!!iso.country && iso.country !== 'ALL' && !isoDisabled){
          this.status.set('iso', _.clone(iso));
          this.updateLegend();
        }
      }
    },{
      'Timeline/date-change': function(layerSlug, date) {
        var startDate = date[0];
        if (!moment.isMoment(startDate)) {
          startDate = moment.utc(startDate);
        }
        this.status.set('startYear', startDate.year());
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
      this.getCountryMore().then(function() {
        var categories = [],
          options = {
            threshold: this.status.get('threshold'),
            hresolution: this.getHresolutionParams(),
            startYear: this.status.get('startYear')
          },
          geographic = null,
          iso = this.status.get('iso'),
          more = this.status.get('more');

        if (this.status.get('layerSpec')) {
          categories = this.status.get('layerSpec').getLayersByCategory();
          geographic = !! this.status.get('layerSpec').attributes.geographic_coverage;
        }
        this.view.update(categories, options, geographic, iso, more);
      }.bind(this));
    },

    toggleLayerOption: function(option) {
      this.status.toggleLayerOption(option);
      this.toggleLayerOptions();
      mps.publish('Place/update', [{go: false}]);
    },

    toggleLayerOptions: function(opts) {
      if (this.status.get('layerOptions') || (opts && opts.reset)) {
        mps.publish('LayerNav/changeLayerOptions',
          [this.status.get('layerOptions')]);
        this.view.toggleLayerOptions(this.status.get('layerOptions') || []);
      }
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

    hiddenLayer: function(layerSlug) {
      var where = [{slug: layerSlug}];
      layerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
        }, this));
    },

    toggleThreshold: function(){
      mps.publish('ThresholdControls/show');
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
      return new Promise(function(resolve) {
        var iso = this.status.get('iso');

        if(!!iso && !!iso.country && iso.country !== 'ALL'){
          CountryService.showCountry({ iso: iso.country })
            .then(function(results) {
              var is_more = (!!results.indepth);
              var is_idn = (!!iso && !!iso.country && iso.country == 'IDN');
              if (is_more) {
                this.status.set('more', {
                  name: results.name,
                  url: results.indepth,
                  is_idn: is_idn
                });
              } else {
                this.status.set('more', null);
              }
              resolve();
            }.bind(this));
        } else {
          this.status.set('more', null);
          resolve();
        }
      }.bind(this));
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
