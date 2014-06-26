/**
 * Service for accessing information about a place.
 *
 * A place contains all the state needed to render views. For example, it
 * contains the map zoom, center coordinates, maptype, layers. etc.
 */
define([
  'Class',
  'mps',
  'uri'
], function (Class, mps, UriTemplate) {

  var PlaceService = Class.extend({

    init: function(name, params, mapLayerService) {
      this.name = name;
      this.params = params;
      this.mapLayerService = mapLayerService;
    },

    _toNumber: function(val) {
      var num = null;

      try {
        num = Number(val);
        if (isNaN(num)) {
          throw "Not a number";
        }
        return num;
      } catch(err) {
        return undefined;
      }
    },

    getName: function() {
      return this.name;
    },
    
    getBeginDate: function() {
      return this._toNumber(this.params.begin);
    },

    getEndDate: function() {
      return this._toNumber(this.params.end);
    },

    getMapZoom: function() {
      return this._toNumber(this.params.zoom);
    },

    getMapCenter: function() {
      var lat = this._toNumber(this.params.lat);
      var lng = this._toNumber(this.params.lng);

      if (lat && lng) {
        return {lat: lat, lng: lng};
      } else {
        return undefined;
      }
    },

    getIso: function() {
      return this.params.iso;
    },

    getMapTypeId: function() {
      return this.params.maptype;
    },

    getMapLayers: function(callback) {
      var params = this.params;
      var baselayers = null;
      var baseWhere = null;
      var sublayers = null;
      var subWhere = null;
      var where = null;

      // Return immediately if mapLayers are available
      if (this.mapLayers) {
        callback(this.mapLayers);
        return;
      }

      params = this.params;
      
      // Create base layer filters
      baselayers = params.baselayers ? params.baselayers.split(',') : [];
      baseWhere = _.map(
        baselayers, 
        function (name) {
          return {slug: name, category_slug: 'forest_clearing'};
      });
      
      // Create sublayer filters
      sublayers = params.sublayers ? params.sublayers.split(',') : [];
      subWhere = _.map(
        sublayers, 
        function(id) {
          return {id: id};
      });
      
      // Combine layer filters with order preserved
      where = _.union(baseWhere, subWhere); 

      // Get layers from MapLayerService
      this.mapLayerService.getLayers(
        where,
        _.bind(function(layers) {
          this.mapLayers = layers;
          callback(this.mapLayers);
        }, this),
        _.bind(function(error) {
          console.error(error);
          callback(undefined);
        }, this));
    }
  });
  
  return PlaceService;
});