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
  'map/services/LayerSpecService'
], function(_, Backbone, mps, PresenterClass, layerSpecService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layerSpec: null,
      threshold: null,
      hresolution: null,
      iso: null
    }
  });

  var LegendPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'Place/go': function(place) {
        this.status.set('layerSpec', place.layerSpec);
        this.status.set('threshold', place.params.threshold);
        this.status.set('hresolution', place.params.hresolution);

        if(!!place.params.iso.country && place.params.iso.country !== 'ALL'){
          this.status.set('iso', place.params.iso);
        }

        this._updateLegend();
        this._toggleSelected();
        this.view.updateLinkToGFW();
      }
    },{
      'Place/update': function(place) {
        this.view.updateLinkToGFW();
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
        this._updateLegend();
        // Toggle sublayers
        this._toggleSelected();
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
        this._updateLegend();
      }
    }, {
      'Hresolution/update': function(hresolution) {
        this.status.set('hresolution', hresolution);
        this._updateLegend();
      }
    }, {
      'Country/update': function(iso) {
        this.status.set('iso', _.clone(iso));
        this._updateLegend();
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
    _updateLegend: function() {
      var categories = this.status.get('layerSpec').getLayersByCategory(),
          options = {
            threshold: this.status.get('threshold'),
            hresolution: this.hresolutionParams()
          },
          iso = this.status.get('iso'),
          geographic = !! this.status.get('layerSpec').attributes.geographic_coverage;

      this.view.update(categories, options, geographic, iso);
    },

    /**
     * Toggle selected class sublayers by calling view.toggleSelected.
     */
    _toggleSelected: function() {
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

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
    },

    hresolutionParams: function () {
      if (!!this.status.get('hresolution')) {
        return JSON.parse(atob(this.status.get('hresolution')));
      }
      return {};
    }


  });

  return LegendPresenter;
});
