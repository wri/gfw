/**
 * Dark Matter Maptype.
 */
define([], () => {
  const PositronMaptype = function () {
    const config = {
      name: 'Positron CartoDB',
      alt: 'Global forest Positron',
      maxZoom: 16,
      isPng: true,
      tileSize: new google.maps.Size(256, 256),
      getTileUrl(ll, z) {
        const x = Math.abs(ll.x % (1 << z)); // jshint ignore:line
        return 'https://a.basemaps.cartocdn.com/light_nolabels/{0}/{1}/{2}.png'.format(
          z,
          x,
          ll.y
        );
      }
    };

    return new google.maps.ImageMapType(config);
  };

  return PositronMaptype;
});
