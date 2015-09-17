/**
 * The RaisgLayer layer module.
 *
 * @return RaisgLayer class (extends WMSLayerClass)
 */
define([
  'uri',
  'abstract/layer/WMSLayerClass',
], function(UriTemplate, WMSLayerClass) {

  'use strict';

  var wmsUrl = 'http://gisserver.socioambiental.org:6080/arcgis/services/raisg/raisg_tis/MapServer/WMSServer?';
    wmsUrl += '&SERVICE=WMS';
    wmsUrl += '&REQUEST=GetMap';
    wmsUrl += '&VERSION=1.1.1';
    wmsUrl += '&LAYERS=0';
    wmsUrl += '&STYLES=polygonSymbolizer';
    wmsUrl += '&FORMAT=image%2Fpng';
    wmsUrl += '&TRANSPARENT=true';
    wmsUrl += '&HEIGHT=256';
    wmsUrl += '&WIDTH=256';
    wmsUrl += '&SLD=http://gfw-nav.herokuapp.com/assets/map/cartocss/polygon_polygonSymbolizer.xml';
    wmsUrl += '&SRS=EPSG%3A3857';


  var wmsInfowindowUrl = 'http://gisserver.socioambiental.org:6080/arcgis/services/raisg/raisg_tis/MapServer/WMSServer?';

  wmsInfowindowUrl += '&service=WMS';
  wmsInfowindowUrl += '&version=1.1.1';
  wmsInfowindowUrl += '&request=GetFeatureInfo';
  wmsInfowindowUrl += '&layers=0';
  wmsInfowindowUrl += '&styles=default';
  wmsInfowindowUrl += '&SRS=EPSG:4326';
  wmsInfowindowUrl += '&bbox={bbox}';
  wmsInfowindowUrl += '&width=1044';
  wmsInfowindowUrl += '&height=906';
  wmsInfowindowUrl += '&format=text/xml';
  wmsInfowindowUrl += '&X={longitude}';
  wmsInfowindowUrl += '&Y={latitude}';
  wmsInfowindowUrl += '&query_layers=0';


  var RaisgLayer = WMSLayerClass.extend({

    options: {
      url: wmsUrl,
      infowindowUrl: wmsInfowindowUrl,
    },

    getQuery: function(_longitude, _latitude, _bbox) {
      return new UriTemplate(wmsInfowindowUrl)
        .fillFromObject({ longitude: _longitude, latitude: _latitude, bbox: _bbox });
    }


  });

  return RaisgLayer;

});
