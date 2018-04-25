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
        recentImagery: null
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
          'Place/go': function(place) {
            this.status.set('layerSpec', place.layerSpec);
            this.status.set('recentImagery', place.params.recentImagery);
            var isRecentImageryActivated = !!this.status
              .get('layerSpec')
              .getLayer({ slug: 'sentinel_tiles' });
            if (
              isRecentImageryActivated &&
              !!this.status.get('recentImagery')
            ) {
              this.view.fillParams(
                JSON.parse(atob(place.params.recentImagery))
              );
            }
          }
        },
        {
          'LayerNav/change': function(layerSpec) {
            this.status.set('layerSpec', layerSpec);
            var isRecentImageryActivated = !!this.status
              .get('layerSpec')
              .getLayer({ slug: 'sentinel_tiles' });

            if (isRecentImageryActivated) {
              this.setRecentImagery(this.view.getParams());
            }
          }
        },
        {
          'Layer/add': function(slug) {
            if (slug === 'sentinel_tiles') {
              window.dispatchEvent(new Event('isRecentImageryActivated'));
            }
          }
        },
        {
          'ReactMap/zoom-go-back': function(slug) {
            mps.publish('Map/set-zoom', [this.view.previousZoom]);
          }
        }
      ],

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

      updateLayer: function(name, params) {
        this.setRecentImagery(this.view.getParams());
        mps.publish('Layer/update', [name]);
      },

      setRecentImagery: function(value) {
        if (!!value) {
          value = btoa(JSON.stringify(value));
        }

        this.status.set('recentImagery', value);
        this.publishRecentImagery();
      },

      publishRecentImagery: function() {
        mps.publish('Place/update', [{ go: false }]);
      },

      getPlaceParams: function() {
        return {
          recentImagery: this.status.get('recentImagery')
        };
      },

      notificate: function(id) {
        mps.publish('Notification/open', [id]);
      }
    });

    return ReactMapMiddlePresenter;
  }
);
