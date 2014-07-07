/**
 * The Image map layer module.
 *
 * @return ImageLayer class (extends Class).
 */
define([
  'Class',
  'underscore',
  'uri'
], function(Class, _, UriTemplate) {

  var ImageMaptypeLayerClass = Class.extend({

    init: function(layer, map) {
      _.bindAll(this, '_getUrl');
      this.tileSize = new google.maps.Size(256, 256);
      this.map = map;
      this.name = layer.slug;
      this._setImageMaptype();
    },

    /**
     * Generates the google.maps.ImageMapType layer.
     */
    _setImageMaptype: function() {
      this._imageMaptype = new google.maps.ImageMapType({
        tileSize: this.tileSize,
        opacity: 1,
        isPng: true,
        name: this.name,
        getTileUrl: this._getUrl
      });
    },

    render: function() {
      this.map.overlayMapTypes.insertAt(0, this._imageMaptype);
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to
     * display new tiles for the given viewport.
     *
     * @param  {obj}     tile Tile coordenades {x ,y}
     * @param  {integer} zoom Current map zoom
     * @return {string}  url  Tile url
     */
    _getUrl: function(tile, zoom) {
      return new UriTemplate(this.options.urlTemplate).fillFromObject({
        x: tile.x,
        y: tile.y,
        z: zoom
      });
    },

    getName: function() {
      return this.name
    }
  });

  return ImageMaptypeLayerClass;
});
