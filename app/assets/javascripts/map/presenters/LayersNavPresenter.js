/**
 * The LayersNavPresenter class for the LayersNavView.
 *
 * @return LayersNavPresenter class.
 */

/* eslint-disable */
define(
  [
    'underscore',
    'mps',
    'map/presenters/PresenterClass',
    'map/services/LayerSpecService'
  ],
  function(_, mps, PresenterClass, layerSpecService) {
    'use strict';

    var LayersNavPresenter = PresenterClass.extend({
      init: function(view) {
        this.view = view;
        this._super();
        this.listeners();
      },

      listeners: function() {
        if (!!window.Transifex) {
          window.Transifex.live.onTranslatePage(
            function(language_code) {
              this.view.fixLegibility();
            }.bind(this)
          );
          window.Transifex.live.onDynamicContent(
            function(new_strings) {
              this.view.fixLegibility();
            }.bind(this)
          );
        }
      },

      /**
       * Application subscriptions.
       */
      _subscriptions: [
        {
          'Place/go': function(place) {
            this.view._toggleSelected(place.layerSpec.getLayers());
          }
        },
        {
          'LayerNav/change': function(layerSpec) {
            this.view._toggleSelected(layerSpec.getLayers());
          }
        },
        {
          'Country/update': function(iso) {
            this.view.fixLegibility();
          }
        },
        {
          'Analysis/iso': function(iso, isoDisabled) {
            this.view.fixLegibility();
          }
        }
      ],

      initExperiment: function(id) {
        mps.publish('Experiment/choose', [id]);
      },

      notificate: function(id) {
        mps.publish('Notification/open', [id]);
      },

      /**
       * Publish a a Map/toggle-layer.
       *
       * @param  {string} layerSlug
       */
      toggleLayer: function(layerSlug, checkedSublayer) {
        var where = [{ slug: layerSlug }];

        layerSpecService.toggle(
          where,
          _.bind(function(layerSpec) {
            mps.publish('LayerNav/change', [layerSpec]);
            mps.publish('Place/update', [{ go: false }]);

            if (checkedSublayer !== null) {
              this.toggleLayer(checkedSublayer, null);
            }
          }, this)
        );
      }
    });

    return LayersNavPresenter;
  }
);
