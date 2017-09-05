/**
 * Sentinel Tile Layer (adapted from the Pantropical layer module)
 * Proxy for Earth Engine data (created September 2017)
 * https://staging-api.globalforestwatch.org/v1/sentinel-tiles?lat=-16.5&lon=26.5&start=2017-03-01&end=2017-03-10
 *
 {
 "data": {
 "attributes": {
 "date_time": "2017-03-02 11:52:11Z",
  "product_id": "S2A_MSIL1C_20170302T115211_N0204_R123_T28RCQ_20170302T115211",
  "url_boundary": "https://earthengine.googleapis.com/map/d78a1051fd8dd9f2de025fa4af0187ec/{z}/{x}/{y}?token=ec504a3a6b029d7485e52c90898acf95",
  "url_image": "https://earthengine.googleapis.com/map/35a6c171ff17c43ce736ecc0991a0fc4/{z}/{x}/{y}?token=1ff775cea38b201ed5d02d044492a4b5"
},
"id": null,
"type": "sentinel_tiles_url"
}
 *
 * @return SentinelTilesLayer class (extends ImageLayerClass)
 */
define([
  'abstract/layer/ImageLayerClass',
], function(ImageLayerClass) {

  'use strict';

  var SentinelTilesLayer = ImageLayerClass.extend({

    options: {
      urlTemplate: 'https://earthengine.googleapis.com/map/35a6c171ff17c43ce736ecc0991a0fc4/{z}/{x}/{y}?token=1ff775cea38b201ed5d02d044492a4b5',
      dataMaxZoom: 14
    }

  });

  return SentinelTilesLayer;

});
