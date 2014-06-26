/**
 * The HTML5 Canvas map layer module.
 * 
 * @return CanvasLayer class (extends Backbone.View).
 */
define([
  'Class',
  'backbone',
  'mps'
], function(Class, Backbone, mps) {

  var CanvasLayer = Class.extend({

    init: function () {
      this.tileSize = new google.maps.Size(256, 256);
      this.tiles = {};
    },

    /**
     * Called whenever the Google Maps API determines that the map needs to 
     * display new tiles for the given viewport.
     * 
     * @param  {[type]} coord         [description]
     * @param  {[type]} zoom          [description]
     * @param  {[type]} ownerDocument [description]
     * @return {[type]}               [description]
     */
    getTile: function(coord, zoom, ownerDocument) {
      var canvas = ownerDocument.createElement('canvas');
      canvas.style.border  = "none";
      canvas.style.margin  = "0";
      canvas.style.padding = "0";

      var ctx = canvas.getContext('2d');
      ctx.width = canvas.width = this.tileSize.width;
      ctx.height = canvas.height = this.tileSize.height;

      var tileId = coord.x + '_' + coord.y + '_' + zoom;
      canvas.setAttribute('id', tileId);
      
      if (tileId in this.tiles) {
        delete this.tiles[tileId];
      }

      this.tiles[tileId] = canvas;
      this.canvasSetup(canvas, coord, zoom);

      return canvas;
    },

    canvasSetup: function(canvas, coord, zoom) {
      var self = this,
          xhr = new XMLHttpRequest(),
          ctx = canvas.getContext('2d');

      var x = coord.x,
          y = coord.y,
          z = zoom;

      if (zoom > this.dataMaxZoom) {
        x = Math.floor(coord.x / (Math.pow(2, zoom - this.dataMaxZoom)));
        y = Math.floor(coord.y / (Math.pow(2, zoom - this.dataMaxZoom)));
        z = this.dataMaxZoom;
      } else {
        y = (y > Math.pow(2, z) ? y % Math.pow(2, z) : y);
        if (x >= Math.pow(2, z)) {
          x = x % Math.pow(2, z);
        } else if (x < 0) {
          x = Math.pow(2, z) - Math.abs(x);
        }
      }

      var url = this.url.replace('%z', z).replace('%x', x).replace('%y', y);

      xhr.onload = function () {
        var url = URL.createObjectURL(this.response),
            image = new Image();

        image.onload = function () {
          image.crossOrigin = '';

          canvas.image = image;
          canvas.coord = coord;
          canvas.coord.z = zoom;

          ctx.drawImage(image, 0, 0);
          self.filterTile(canvas, zoom);

          URL.revokeObjectURL(url);
        };

        image.src = url;
      };

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.send();
    },

    /**
     * Filters the canvas image. Subclasses implement this.
     * 
     * @param  {[type]} imgdata [description]
     * @param  {[type]} w       [description]
     * @param  {[type]} h       [description]
     * @param  {[type]} zoom    [description]
     * @return {[type]}         [description]
     */
    filterCanvasImage: function(imgdata, w, h, zoom) {
      // NOOP
    },

    updateTiles: function() {
      for(var i in this.tiles) {
        this.filterTile(this.tiles[i]);
      }
    },

    filterTile: function(canvas, zoom) {
      var ctx = canvas.getContext('2d');
          coord = canvas.coord;

      if (canvas.coord) {
        var zsteps = coord.z - this.dataMaxZoom;

        if (zsteps > 0) {
          ctx.imageSmoothingEnabled = false;
          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;

          var srcX = 256 / Math.pow(2, zsteps) * (coord.x % Math.pow(2, zsteps)),
              srcY = 256 / Math.pow(2, zsteps) * (coord.y % Math.pow(2, zsteps)),
              srcW = 256 / Math.pow(2, zsteps),
              srcH = 256 / Math.pow(2, zsteps);

          ctx.clearRect(0, 0, 256, 256);
          ctx.drawImage(canvas.image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
        } else {
          try {
            ctx.drawImage(canvas.image, 0, 0);
          } catch(err) { }
        }

        var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.filterCanvasImage(I.data, ctx.width, ctx.height, zoom);
        ctx.putImageData(I,0,0);
      }
    }
  });

  return CanvasLayer;
});