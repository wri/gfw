/*
 * @return RaisgLayer class (extends WMSLayerClass)
 *     Note. this layer has been deactivated (as of 2nd Aug 2017)
 *     but remains present to serve as an example layer
 *     for using an Arcgis WMS.
 *     wmsUrl += '&STYLES=polygonSymbolizer';
 */
define([
  'uri',
  'abstract/layer/WMSLayerClass',
], function(UriTemplate, WMSLayerClass) {

  'use strict';

  var wmsUrl = 'https://geo.socioambiental.org/webadaptor2/services/raisg/raisg_mineria/MapServer/WMSServer?';
    wmsUrl += '&SERVICE=WMS';
    wmsUrl += '&REQUEST=GetMap';
    wmsUrl += '&VERSION=1.3.0';
    wmsUrl += '&LAYERS=0';
    wmsUrl += '&STYLES=default';
    wmsUrl += '&FORMAT=image%2Fpng';
    wmsUrl += '&TRANSPARENT=true';
    wmsUrl += '&HEIGHT=256';
    wmsUrl += '&WIDTH=256';
    wmsUrl += '&SLD=https://gfw-nav.herokuapp.com/assets/map/cartocss/raisg_mining.xml';
    wmsUrl += '&CRS=EPSG%3A3857';


  var wmsInfowindowUrl = 'https://geo.socioambiental.org/webadaptor2/services/raisg/raisg_mineria/MapServer/WMSServer/1/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=pais,nombre,cia,situacion,tipo_minerio,fuente,area_oficial_ha,leyenda,grupo&geometryType=esriGeometryPoint&geometry={longitude},{latitude}';


  var RaisgMiningLayer = WMSLayerClass.extend({

    options: {
      url: wmsUrl,
      infowindowUrl: wmsInfowindowUrl,
    },

    getQuery: function(_longitude, _latitude, _bbox) {
      return new UriTemplate(wmsInfowindowUrl)
        .fillFromObject({ longitude: _longitude, latitude: _latitude});
    }


  });

  return RaisgMiningLayer;

});