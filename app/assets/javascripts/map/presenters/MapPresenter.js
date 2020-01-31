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
      threshold: null,
      layers: null,
      dont_scroll: null
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
    },{
      'LayerNav/change': function(layerSpec) {
        this._setLayers(layerSpec);
        this._fitToLayers(layerSpec.getLayers());
      }
    },{
      'Map/fit-bounds': function(bounds) {
        this.view.fitBounds(bounds);
      }
    },{
      'Map/set-center': function(lat, lng) {
        this.view.setCenter(lat, lng);
      }
    },{
      'Map/set-zoom': function(zoom) {
        this.view.setZoom(zoom);
      }
    },{
      'Map/autolocate' : function(){
        this.view.autolocate();
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
      'Threshold/update': function(threshold) {
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
    }, {
      'Overlay/toggle': function(bool) {
        this.view.overlayToggle(bool);
      }
    }, {
      'Confirm/autolocate': function(bool) {
        this.view.autolocateResponse(bool);
      }
    }],

    /**
     * Triggered from 'Place/Go' events.
     *
     * @param  {Object} place PlaceService's place object
     */
    _onPlaceGo: function(place) {
      this._setMapOptions(place);

      if (!!place.params.referral) this._publishReferral(place.params.referral);
      this._updateStatusModel(place.params);
      this._setLayers(place.layerSpec, place.params);

      // Very weird my friend (if if if if if if)
      if ((!!place.params.iso && !!place.params.iso.country && place.params.iso.country == 'ALL') && ! !!place.params.wdpaid && ! !!place.params.geojson) {
        this.view.autolocateQuestion();
      }
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

      if (params.layer_options) {
        this.status.set('layerOptions', params.layer_options);
      }
    },

    _resizeSetLayers: function(){
      var layers = this.status.get('layers');
      if (layers) {
        _.each(layers, _.bind(function(layer){
          this.view.updateLayer(layer.slug);
        }, this ));
      }
    },

    /**
     * Set the map layers to match the suplied layers
     * and the current layer options status.
     */
    _setLayers: function(layerSpec, params) {
      var options = _.pick(this.status.toJSON(), 'threshold', 'layerOptions');
      if (params && params.begin && params.end) {
        options.currentDate = [params.begin, params.end];
      }

      // Get layer options. We need the currentDate just when loading
      // a layer first time from url. When changing between layers
      // there is no date so it will be set to the default layer date.
      var layers = layerSpec.getLayers();
      this.status.set('layers',layers);
      this.view.setLayers(layers, options);
    },

    _fitToLayers: function(layers) {
      var layersToFit = _.where(_.values(layers), {fit_to_geom: true}),
          // Always fit to the most recent layer
          layerToFit = layersToFit[layersToFit.length - 1];

      if (layerToFit === undefined) { return; }

      var southWest = new google.maps.LatLng(layerToFit.ymin, layerToFit.xmin),
          northEast = new google.maps.LatLng(layerToFit.ymax, layerToFit.xmax),
          bounds = new google.maps.LatLngBounds(southWest, northEast);

      this.view.fitBounds(bounds);
    },

    /**
     * Construct the options object from the suplied params
     * and dispache to the them to the view.
     *
     * @param {Object} params Map params from the place object.
     */
    _setMapOptions: function(place) {
      var params = place.params;
      if (params.fitbounds) {
        this.view.fitBounds(geojsonUtilsHelper.getBoundsFromGeojson(params.geojson))
      }

      if (!!params.dont_scroll) {
        $('#module-map-controls').addClass('active');
      }
      var options = {
        zoom: params.zoom,
        mapTypeId: params.maptype,
        center: new google.maps.LatLng(params.lat, params.lng),
        scrollwheel: ! !!params.dont_scroll
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
    },

    closeDialogsMobile: function(){
      mps.publish('Dialogs/close');
    },

    /**
     * Throw a Google Analytics event with the referral who points to the map
     *
     * @param {string} name of the referral
     */
    _publishReferral: function (referral) {
      ga('send', 'event', 'Map', 'Referral', referral);
    },

    initExperiment: function(id){
      mps.publish('Experiment/choose',[id]);
    },
    notificate: function(id){
      mps.publish('Notification/open', [id]);
    },




  });

  return MapPresenter;
});
