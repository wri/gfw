/**
 * The MapPresenter class for the MapView.
 *
 * @return MapPresenter class.
 */
define([
  'underscore',
  'backbone',
  'mps',
  'map/presenters/PresenterClass',
  'helpers/geojsonUtilsHelper'
], function(_, Backbone, mps, PresenterClass, geojsonUtilsHelper) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      threshold: null
    }
  });

  var MapPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this.status = new StatusModel();
      this._super();
      mps.publish('Place/register', [this]);
    },

    _subscriptions: [{
      'Place/go': function(place) {
        this._onPlaceGo(place);
      }
    }, {
      'LayerNav/change': function(layerSpec) {
        this._setLayers(layerSpec.getLayers());
      }
    }, {
      'Map/fit-bounds': function(bounds) {
        this.view.fitBounds(bounds);
      }
    }, {
      'Map/set-center': function(lat, lng) {
        this.view.setCenter(lat, lng);
      }
    }, {
      'Maptype/change': function(maptype) {
        this.view.setMapTypeId(maptype);
      }
    }, {
      'Layer/update': function(layerSlug) {
        this.view.updateLayer(layerSlug);
      }
    }, {
      'Timeline/disabled': function() {
        this.view.$maplngLng.removeClass('hidden');
      }
    }, {
      'Timeline/enabled': function() {
        this.view.$maplngLng.addClass('hidden');
      }
    }, {
      'Threshold/changed': function(threshold) {
        this._updateStatusModel({
          threshold: threshold
        });
      }
    }, {
      'AnalysisTool/start-drawing': function() {
        this.view.crosshairs();
      }
    }, {
      'AnalysisTool/stop-drawing': function() {
        this.view.centerPositionCrosshairs();
      }
    }],

    /**
     * Triggered from 'Place/Go' events.
     *
     * @param  {Object} place PlaceService's place object
     */
    _onPlaceGo: function(place) {
      var layerOptions = {};
      this._setMapOptions(
        _.pick(place.params,
          'zoom', 'maptype', 'lat', 'lng', 'fitbounds', 'geojson'));

      if (place.params.begin && place.params.end) {
        layerOptions.currentDate = [place.params.begin, place.params.end];
      }

      this._updateStatusModel(place.params);
      this._setLayers(place.layerSpec.getLayers(), layerOptions);
    },

    /**
     * Update the status model from the suplied params.
     *
     * @param  {Object} params
     */
    _updateStatusModel: function(params) {
      if (params.threshold) {
        this.status.set('threshold', params.threshold);
      }
    },

    /**
     * Set the map layers to match the suplied layers
     * and the current layer options status.
     *
     * @param {object} layers Layers object
     */
    _setLayers: function(layers, layerOptions) {
      // Get layer options. We need the currentDate just when loading
      // a layer first time from url. When changing between layers
      // there is no date so it will be set to the default layer date.
      var options = _.extend(_.pick(this.status.toJSON(),
        'threshold'), layerOptions);

      this.view.setLayers(layers, options);
    },

    /**
     * Construct the options object from the suplied params
     * and dispache to the them to the view.
     *
     * @param {Object} params Map params from the place object.
     */
    _setMapOptions: function(params) {

      if (params.fitbounds) {
        this.view.fitBounds(geojsonUtilsHelper.getBoundsFromGeojson(params.geojson))
      }
      var options = {
        zoom: params.zoom,
        mapTypeId: params.maptype,
        center: new google.maps.LatLng(params.lat, params.lng)
      };

      this.view.setOptions(options);
    },

    onOptionsChange: function() {
      mps.publish('Place/update', [{go: false}]);
    },

    onMaptypeChange: function(maptype) {
      mps.publish('Map/maptype-change', [maptype]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Used by MapView to delegate map center change UI events. Results in
     * Map/center-change event getting published with the new map zoom.
     *
     * @param  {number} lat new map center latitude
     * @param  {number} lng new map center longitude
     */
    onCenterChange: function(lat, lng) {
      mps.publish('Map/center-change', [lat, lng]);
      mps.publish('Place/update', [{go: false}]);
    },

    /**
     * Retuns place parameters representing the state of the MapView and
     * layers. Called by PlaceService.
     *
     * @return {Object} Params representing the state of the MapView
     */
    getPlaceParams: function() {
      var p = {};
      var mapCenter = this.view.getCenter();

      p.name = 'map';
      p.zoom = this.view.map.getZoom();
      p.lat = mapCenter.lat;
      p.lng = mapCenter.lng;
      p.maptype = this.view.getMapTypeId();

      return p;
    }

  });

  return MapPresenter;
});
