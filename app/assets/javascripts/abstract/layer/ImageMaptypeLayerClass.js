/**
 * The Image map layer module.
 *
 * @return ImageLayer class (extends Class).
 */
define([
  'underscore',
  'uri',
  'abstract/layer/OverlayLayerClass',
], function(_, UriTemplate, OverlayLayerClass) {

  'use strict';

  var ImageMaptypeLayerClass = OverlayLayerClass.extend({

    defaults: {
      urlTemplate: ''
    },

    init: function(layer, options, map) {
      _.bindAll(this, '_getUrl');
      this._super(layer, options, map);
      this._setImageMaptype();
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this._imageMaptype);
      return deferred.promise();
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
    }
  });

  return ImageMaptypeLayerClass;
});
