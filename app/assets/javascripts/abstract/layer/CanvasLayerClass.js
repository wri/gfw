/**
 * The HTML5 Canvas map layer module.
 *
 * @return CanvasLayer class (extends Class).
 */
define([
  'underscore',
  'mps',
  'uri',
  'abstract/layer/OverlayLayerClass'
], function(_, mps, UriTemplate, OverlayLayerClass) {

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
      mps.publish('Map/loading', [false]);
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

      var div = ownerDocument.createElement('div');
      div.style.width = this.tileSize.width;
      div.style.height = this.tileSize.height;
      div.style.position = 'relative';
      div.style.overflow = 'hidden';

      var canvas = ownerDocument.createElement('canvas');
      canvas.style.border = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.width = this.tileSize.width;
      canvas.height = this.tileSize.height;
      div.appendChild(canvas);

      if (this.options.showLoadingSpinner === true) {
        var loader = ownerDocument.createElement('div');
        loader.className += 'loader spinner start';
        loader.style.position = 'absolute';
        loader.style.top      = '50%';
        loader.style.left     = '50%';
        loader.style.border = '4px solid #FFF';
        loader.style.borderRadius = '50%';
        loader.style.borderTopColor = '#555';
        div.appendChild(loader);
      }

      var url = this._getUrl.apply(this,
        this._getTileCoords(coord.x, coord.y, zoom));

      this._getImage(url, function(image) {
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

        if (this.options.showLoadingSpinner === true) {
          div.removeChild(loader);
        }
      }.bind(this), function() {
        if (this.options.showLoadingSpinner === true) {
          div.removeChild(loader);
        }
      }.bind(this));

      return div;
    },

    _drawCanvasImage: function(canvasData) {
      "use asm";
      var canvas = canvasData.canvas,
          ctx    = canvas.getContext('2d'),
          image  = canvasData.image,
          zsteps = this._getZoomSteps(canvasData.z) |0; // force 32bit int type

      ctx.clearRect(0, 0, 256, 256);                    // this will allow us to sum up the dots when the timeline is running

      if (zsteps < 0) {
        ctx.drawImage(image, 0, 0);
      } else {                                          // over the maxzoom, we'll need to scale up each tile
        ctx.imageSmoothingEnabled = false;              // disable pic enhancement
        ctx.mozImageSmoothingEnabled = false;

        // tile scaling
        var srcX = (256 / Math.pow(2, zsteps) * (canvasData.x % Math.pow(2, zsteps))) |0,
            srcY = (256 / Math.pow(2, zsteps) * (canvasData.y % Math.pow(2, zsteps))) |0,
            srcW = (256 / Math.pow(2, zsteps)) |0,
            srcH = (256 / Math.pow(2, zsteps)) |0;

        ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
      }

      var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.filterCanvasImgdata(I.data, canvas.width, canvas.height, canvasData.z);
      ctx.putImageData(I, 0, 0);
    },

    _getZoomSteps: function(z) {
      return z - this.options.dataMaxZoom;
    },

    _getImage: function(url, callback, errorCallback) {
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var url = URL.createObjectURL(this.response);
        var image = new Image();

        image.onload = function () {
          image.crossOrigin = '';
          callback(image);
          URL.revokeObjectURL(url);
        };

        if (errorCallback !== undefined) {
          image.onerror = errorCallback;
        }

        image.src = url;
      };

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.send();
    },

    _getUrl: function(x, y, z) {
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
