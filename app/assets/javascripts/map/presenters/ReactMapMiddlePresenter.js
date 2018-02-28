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

    var StatusModel = Backbone.Model.extend({
      defaults: {
        layers: [],
        hresolution: null
      }
    });

    var ReactMapMiddlePresenter = PresenterClass.extend({
      init: function(view) {
        this.view = view;
        this.status = new StatusModel();
        this._super();
        mps.publish('Place/register', [this]);
      },

      _subscriptions: [
        {
          'LayerNav/change': function(layerSpec) {
            this.status.set('layerSpec', layerSpec);
            var is_sentinel = !!this.status
              .get('layerSpec')
              .getLayer({ slug: 'sentinel_tiles' });
            this.setSentinel(is_sentinel ? this.view._getParams() : null);
          }
        }
      ],

      updateLayer: function(name, params) {
        this.setSentinel(this.view._getParams());
        mps.publish('Layer/update', [name]);
      },

      setSentinel: function(value) {
        if (!!value) {
          value = btoa(JSON.stringify(value));
        }

        this.status.set('hresolution', value);
        this._publishSentinel();
      },

      _publishSentinel: function() {
        mps.publish('Place/update', [{ go: false }]);
      },

      /**
       * Used by PlaceService to get the current hresolution value.
       *
       * @return {Object} high-resolution
       */
      getPlaceParams: function() {
        return {
          hresolution: this.status.get('hresolution'),
          sentinel_tiles: this.status.get('sentinel_tiles')
        };
      },

      /**
       * Publish a a Map/toggle-layer.
       *
       * @param  {string} layerSlug
       */
      toggleLayer: function(layerSlug) {
        var where = [{ slug: layerSlug }];
        layerSpecService.toggle(
          where,
          _.bind(function(layerSpec) {
            mps.publish('LayerNav/change', [layerSpec]);
            mps.publish('Place/update', [{ go: false }]);
          }, this)
        );
      },

      notificate: function(id) {
        mps.publish('Notification/open', [id]);
      },

      notificateClose: function(id) {
        mps.publish('Notification/close');
      }
    });

    return ReactMapMiddlePresenter;
  }
);
