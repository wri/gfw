/**
 * The Image map layer module.
 *
 * @return WMSLayer class (extends Class).
 */
define([
  'underscore',
  'uri',
  'abstract/layer/OverlayLayerClass'
], function(_, UriTemplate, OverlayLayerClass) {

  'use strict';

  var WMSLayerClass = OverlayLayerClass.extend({

    init: function(layer, options, map) {
      this._super(layer, options, map);
      this._create();
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this._imageMaptype);
      return deferred.promise();
    },
    _getTileUrl: function(coord, zoom) {


      function bound(value, opt_min, opt_max) {
          if (opt_min != null) value = Math.max(value, opt_min);
          if (opt_max != null) value = Math.min(value, opt_max);
          return value;
      }

      function degreesToRadians(deg) {
          return deg * (Math.PI / 180);
      }

      function radiansToDegrees(rad) {
          return rad / (Math.PI / 180);
      }

      function MercatorProjection() {
          var MERCATOR_RANGE = 256;
          this.pixelOrigin_ = new google.maps.Point(
              MERCATOR_RANGE / 2, MERCATOR_RANGE / 2);
          this.pixelsPerLonDegree_ = MERCATOR_RANGE / 360;
          this.pixelsPerLonRadian_ = MERCATOR_RANGE / (2 * Math.PI);
      };

      MercatorProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
          var me = this;

          var point = opt_point || new google.maps.Point(0, 0);

          var origin = me.pixelOrigin_;
          point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;
          // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
          // 89.189.  This is about a third of a tile past the edge of the world tile.
          var siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
          point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
          return point;
      };

      MercatorProjection.prototype.fromDivPixelToLatLng = function(pixel, zoom) {
          var me = this;

          var origin = me.pixelOrigin_;
          var scale = Math.pow(2, zoom);
          var lng = (pixel.x / scale - origin.x) / me.pixelsPerLonDegree_;
          var latRadians = (pixel.y / scale - origin.y) / -me.pixelsPerLonRadian_;
          var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
          return new google.maps.LatLng(lat, lng);
      };

      MercatorProjection.prototype.fromDivPixelToSphericalMercator = function(pixel, zoom) {
          var me = this;
          var coord = me.fromDivPixelToLatLng(pixel, zoom);

          var r= 6378137.0;
          var x = r* degreesToRadians(coord.lng());
          var latRad = degreesToRadians(coord.lat());
          var y = (r/2) * Math.log((1+Math.sin(latRad))/ (1-Math.sin(latRad)));

          return new google.maps.Point(x,y);
      };


      zoom = 3;
      coord = {x : 45, y : 20}
      var self = this;
      var map = new google.maps.Map('#map');
      var proj = self.map.getProjection();
      var zfactor = Math.pow(2, zoom);
      var lULP = new google.maps.Point(coord.x*256,(coord.y+1)*256);
      var lLRP = new google.maps.Point((coord.x+1)*256,coord.y*256);

      var projectionMap = new MercatorProjection();

      var lULg = projectionMap.fromDivPixelToSphericalMercator(lULP, zoom);
      var lLRg  = projectionMap.fromDivPixelToSphericalMercator(lLRP, zoom);

      var lUL_Latitude = lULg.y;
      var lUL_Longitude = lULg.x;
      var lLR_Latitude = lLRg.y;
      var lLR_Longitude = lLRg.x;
      //GJ: there is a bug when crossing the -180 longitude border (tile does not render) - this check seems to fix it
      if (lLR_Longitude < lUL_Longitude) {
        lLR_Longitude = Math.abs(lLR_Longitude);
      }

      var url = 'http://downloads.wdpa.org/ArcGIS/services/ocean_data_viewer/mangrove_usgs3/MapServer/WMSServer';
      url += '?REQUEST=GetMap'; //WMS operation
      url += '&SERVICE=WMS'; //WMS service
      url += '&VERSION=1.1.1'; //WMS version
      url += '&STYLES=' + 'default'; //WMS styles
      url += '&LAYERS=' + '0'; //WMS layers
      url += '&FORMAT=image/png32'; //WMS format
      url += '&BGCOLOR=0xFFFFFF';
      url += '&TRANSPARENT=true';
      url += '&SRS=EPSG:4326'; //set WGS84
      url += "&bbox=" + lUL_Longitude + "," + lUL_Latitude + "," + lLR_Longitude + "," + lLR_Latitude; // set bounding box
      url += '&WIDTH=256'; //tile size in google
      url += '&HEIGHT=256';
      console.log(url)
      return url; // return URL for the tile
    },

    _create: function() {
      return new google.maps.ImageMapType({
        getTileUrl: this._getTileUrl(),
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 19,
        isPng: true
      });
    },

  });
  return WMSLayerClass;
});
