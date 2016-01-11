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
        this.status.set('hresolution', place.params.hresolution);
        if (!! place.params.hresolution) {
          var params = JSON.parse(atob(place.params.hresolution));
          if (params.zoom >= 7) {
            this.view.switchToggle();
          }
          this.view._fillParams(params);
        } else {
          this.toggleLayer(null, place.params.sublayers[0]);
        }
      }
    }],

    setMaptype: function(maptype) {
      mps.publish('Maptype/change', [maptype]);
    },

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
        sessionStorage.setItem('high-resolution',value);
      } else {
        sessionStorage.removeItem('high-resolution');
      }

      this.status.set('hresolution', value);
      this._publishHres();
    },

    /**
     * Publish 'hresolution/changed' event with the current hresolution
     * and call 'Place/update' to update the url.
     */
    _publishHres: function() {
      mps.publish('hresolution/changed', [this.status.get('hresolution')]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by PlaceService to get the current hresolution value.
     *
     * @return {Object} high-resolution
     */
    getPlaceParams: function() {
      return {hresolution: this.status.get('hresolution')};
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


  });

  return HighresolutionPresenter;
});
