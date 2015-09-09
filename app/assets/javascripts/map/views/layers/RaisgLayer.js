/**
 * The RaisgLayer layer module.
 *
 * @return RaisgLayer class (extends WMSLayerClass)
 */
define([
  'abstract/layer/WMSLayerClass',
  'text!map/cartocss/honduras_forest.cartocss'
], function(WMSLayerClass, honduras_forestCartoCSS) {

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

  var RaisgLayer = WMSLayerClass.extend({

    options: {
      url: wmsUrl,
    }

  });

  return RaisgLayer;

});
