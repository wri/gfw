/**
 * The ProtectedAreas layer module for use on canvas.
 *
 * @return ProtectedAreasLayer class (extends CartoDBLayerClass)
 */
define(
  [
    'underscore',
    'abstract/layer/ImageMaptypeLayerClass',
    'map/services/SitesService'
  ],
  (_, ImageMaptypeLayerClass, SitesService) => {
    const ProtectedAreasLayer = ImageMaptypeLayerClass.extend({
      options: {
        urlTemplate: 'https://maps.protectedplanet.net/blue{/z}{/x}{/y}',
        infowindow: true,
        infowindowAPI: SitesService,
        analysis: true
      }
    });

    return ProtectedAreasLayer;
  }
);
