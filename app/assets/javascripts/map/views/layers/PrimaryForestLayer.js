/**
 * The Indonesia Primary Forest layer module.
 *
 * @return IdnPrimaryLayer class (extends ImageLayerClass)
 */
define(['abstract/layer/ImageLayerClass'], function(ImageLayerClass) {
  var PrimaryForestLayer = ImageLayerClass.extend({
    options: {
      urlTemplate:
        'https://api.resourcewatch.org/v1/layer/079fae08-5696-4926-9417-794bd3a7e8dc/tile/gee/{z}/{x}/{y}',
      dataMaxZoom: 12
    }
  });

  return PrimaryForestLayer;
});
