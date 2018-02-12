/**
 * The HighresolutionPresenter class for the Highresolution view.
 *
 * @return HighresolutionPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass',
  'map/services/LayerSpecService'
], function(_, mps, PresenterClass, layerSpecService) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      layers: [],
      hresolution: null
    }
  });

  var HighresolutionPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    _subscriptions: [{
      'Place/go': function(place) {
        this.status.set('layerSpec', place.layerSpec);
        this.status.set('hresolution', place.params.hresolution);
        var is_highres = !!this.status.get('layerSpec').getLayer({ slug: 'highres' })
        if (is_highres || !!this.status.get('hresolution')) {
          var params = JSON.parse(atob(place.params.hresolution));
          this.view.switchToggle(is_highres);
          this.view._fillParams(params);

          if (params.zoom < 5) {
            this.notificate('notification-zoom-not-reached');
          }
        }
      }
    },{
      'LayerNav/change': function(layerSpec) {
        this.status.set('layerSpec', layerSpec);
        var is_highres = !!this.status.get('layerSpec').getLayer({ slug: 'highres' })
        this.setHres((is_highres) ? this.view._getParams() : null);
        this.view.switchToggle(is_highres);
      }
    }],

    updateLayer: function(name) {
      mps.publish('Layer/update', [name]);
    },

    /**
     * Set status hresolution with the passed value.
     *
     * @param {string} value hresolution
     */
    setHres: function(value) {
      if (!!value) {
        value = btoa(JSON.stringify(value));
      }

      this.status.set('hresolution', value);
      this._publishHres();
    },

    /**
     * call 'Place/update' to update the url.
     */
    _publishHres: function() {
      mps.publish('Hresolution/update', [this.status.get('hresolution')]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current hresolution value.
     *
     * @return {Object} high-resolution
     */
    getPlaceParams: function() {
      return {
        hresolution: this.status.get('hresolution')
      };
    },

    /**
     * Publish a a Map/toggle-layer.
     *
     * @param  {string} layerSlug
     */
    toggleLayer: function(layerSlug, id) {

      var where = layerSlug ? [{slug: layerSlug}] : [{id: id}];
      layerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    },

    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },

    notificateClose: function(id){
      mps.publish('Notification/close');
    },


  });

  return HighresolutionPresenter;
});
