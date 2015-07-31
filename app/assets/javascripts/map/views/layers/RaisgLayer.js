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
    wmsUrl += 'REQUEST=GetMap&version=1.3.0';
    wmsUrl += '&SERVICE=WMS';
    wmsUrl += '&LAYERS=3';
    wmsUrl += '&FORMAT=image/png';
    wmsUrl += '&TRANSPARENT=true';
    wmsUrl += '&CRS=EPSG:4326';
    wmsUrl += '&STYLES=polygonSymbolizer';
    wmsUrl += '&TILED=true';
    wmsUrl += '&WIDTH=256';
    wmsUrl += '&HEIGHT=256';
    wmsUrl += '&sld=http://sampleserver1.arcgisonline.com/arcgis/wms/slds/polygon_polygonSymbolizer.xml';

  var RaisgLayer = WMSLayerClass.extend({

    options: {
      url: wmsUrl,
    }

  });

  return RaisgLayer;

});
