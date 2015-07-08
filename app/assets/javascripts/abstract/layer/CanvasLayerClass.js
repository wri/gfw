/**
 * The HTML5 Canvas map layer module.
 *
 * @return CanvasLayer class (extends Class).
 */
define([
  'underscore',
  'uri',
  'abstract/layer/OverlayLayerClass'
], function(_, UriTemplate, OverlayLayerClass) {

  'use strict';

  var CanvasLayerClass = OverlayLayerClass.extend({

    defaults: {
      dataMaxZoom: 17
    },

    init: function(layer, options, map) {
      _.bindAll(this, 'filterCanvasImgdata');
      this.tiles = {};
      this._super(layer, options, map);
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this);
      return deferred.promise();
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to
     * display new tiles for the given viewport.
     *
     * @param  {obj}     coord         coordenades {x ,y}
     * @param  {integer} zoom          current map zoom
     * @param  {object}  ownerDocument
     *
     * @return {canvas}  canvas        tile canvas
     */
    getTile: function(coord, zoom, ownerDocument) {
      var tileId = this._getTileId(coord.x, coord.y, zoom);
      // Delete all tiles from others zooms;
      var tilesKeys = Object.keys(this.tiles);

      for (var i = 0; i < tilesKeys.length; i++) {
        if (this.tiles[tilesKeys[i]].z !== zoom) {
          delete this.tiles[tilesKeys[i]];
        }
      }

      // Return cached tile if loaded.
      if (this.tiles[tileId]) {
        return this.tiles[tileId].canvas;
      }

      var canvas = ownerDocument.createElement('canvas');
      canvas.style.border = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.width = this.tileSize.width;
      canvas.height = this.tileSize.height;

      var url = this._getUrl.apply(this,
        this._getTileCoords(coord.x, coord.y, zoom));

      this._getImage(url, _.bind(function(image) {
        var canvasData = {
          tileId: tileId,
          canvas: canvas,
          image: image,
          x: coord.x,
          y: coord.y,
          z: zoom
        };

        this._cacheTile(canvasData);
        this._drawCanvasImage(canvasData);
      }, this));

      return canvas;
    },

    _drawCanvasImage: function(canvasData) {
      var canvas = canvasData.canvas;
      var image = canvasData.image;
      var x = canvasData.x;
      var y = canvasData.y;
      var z = canvasData.z;

      var ctx = canvas.getContext('2d');
      var zsteps = this._getZoomSteps(z);

      if (zsteps < 0) {
        ctx.drawImage(image, 0, 0);
      } else {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;

        var srcX = 256 / Math.pow(2, zsteps) * (x % Math.pow(2, zsteps));
        var srcY = 256 / Math.pow(2, zsteps) * (y % Math.pow(2, zsteps));
        var srcW = 256 / Math.pow(2, zsteps);
        var srcH = 256 / Math.pow(2, zsteps);

        ctx.clearRect(0, 0, 256, 256);
        ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
      }

      var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.filterCanvasImgdata(I.data, canvas.width, canvas.height, z);
      ctx.putImageData(I, 0, 0);
    },

    _getZoomSteps: function(z) {
      return z - this.options.dataMaxZoom;
    },

    _getImage: function(url, callback) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var url = URL.createObjectURL(this.response);
        var image = new Image();

        image.onload = function () {
          image.crossOrigin = '';
          callback(image);
          URL.revokeObjectURL(url);
        };
        image.src = url;
      };

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.send();
    },

    _getUrl: function(x, y, z) {
      if (z == 11) console.log(z,x,y)
      return new UriTemplate(this.options.urlTemplate).fillFromObject({x: x, y: y, z: z});
    },

    _getTileCoords: function(x, y, z) {
      if (z > this.options.dataMaxZoom) {
        x = Math.floor(x / (Math.pow(2, z - this.options.dataMaxZoom)));
        y = Math.floor(y / (Math.pow(2, z - this.options.dataMaxZoom)));
        z = this.options.dataMaxZoom;
      } else {
        y = (y > Math.pow(2, z) ? y % Math.pow(2, z) : y);
        if (x >= Math.pow(2, z)) {
          x = x % Math.pow(2, z);
        } else if (x < 0) {
          x = Math.pow(2, z) - Math.abs(x);
        }
      }

      return [x, y, z];
    },

    /**
     * Caches a tile so it can be re-rendered when
     * calling this.updateTiles()
     *
     * @param  {object} canvasData Tile canvas data
     */
    _cacheTile: function(canvasData) {
      canvasData.canvas.setAttribute('id', canvasData.tileId);
      this.tiles[canvasData.tileId] = canvasData;
    },

    _getTileId: function(x, y, z) {
      return '{0}_{1}_{2}'.format(x, y, z);
    },

    updateTiles: function() {
      for(var i in this.tiles) {
        this._drawCanvasImage(this.tiles[i]);
      }
    }
  });

  return CanvasLayerClass;

});
