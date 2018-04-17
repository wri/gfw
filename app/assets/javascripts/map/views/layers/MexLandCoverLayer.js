/**
 * The tileserver layer module for use on canvas.
 *
 * @return UsaLandCoverLayer class (extends ImageLayerClass)
 */
define(['abstract/layer/ImageLayerClass'], (ImageLayerClass) => {
  const MexLandCoverLayer = ImageLayerClass.extend({
    options: {
      urlTemplate:
        'https://gis-gfw.wri.org/arcgis/rest/services/cached/mex_land_cover/MapServer/tile/{z}/{y}/{x}',
      dataMaxZoom: 9
    }
  });

  return MexLandCoverLayer;
});
