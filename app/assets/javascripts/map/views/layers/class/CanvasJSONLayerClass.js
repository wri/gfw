/**
 * The HTML5 Canvas map layer module.
 *
 * @return CanvasLayer class (extends Class).
 */
define([
  'Class',
  'underscore',
  'uri'
], function(Class, _, UriTemplate) {

  'use strict';

  var CanvasJSONLayerClass = Class.extend({

    init: function (layer) {
      this.tileSize = new google.maps.Size(256, 256);
      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({dataMaxZoom: 17}, this.options);
      this.tiles = {};
    },

    getLayer: function() {
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

      var canvas = ownerDocument.createElement('canvas');
      canvas.style.border = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.width = this.tileSize.width;
      canvas.height = this.tileSize.height;

      var sql = this._getSql(coord.x, coord.y, z);

      this._getJson(sql, _.bind(function(tile){
        var canvasData = {
          tileId: tileId,
          canvas: canvas,
          tile: tile,
          x: coord.x,
          y: coord.y,
          z: zoom
        };

        this._cacheTile(canvasData);
        this._drawCanvasImage(canvasData);
      }, this));

      return canvas;
    },

    _getSql: function(x, y, z) {
      // get x, y for cells and sd, se for deforestation changes
      // sd contains the months
      // se contains the deforestation for each entry in sd
      // take se and sd as a matrix [se|sd]
      var sql = "SELECT x, y, sd, se FROM {0} WHERE".format(this.layer.table_name);

      // inside the country
      //sql += " WHERE iso = '{0}'".format(self.country);

      // for current zoom
      // zoom + 8 is get because a tile in "zoom" zoom level is a pixel in "zoom + 8"
      // level. Remember, it is a quadtree, 1^8 = 256 and tile size is 256px
      var pixel_zoom = Math.min(z + 8, 16);
      sql += " z = {0} ".format(pixel_zoom);

      var zoom_diff = z + 8 - pixel_zoom;
      var cx = (x * 256) >> zoom_diff;
      var cy = (y * 256) >> zoom_diff;
      var cx1 = ((x + 1) * 256) >> zoom_diff;
      var cy1 = ((y + 1) * 256) >> zoom_diff;

      // get cells inside the tile
      sql += " AND x >= {0} AND x < {1}".format(cx, cx1);
      sql += " AND y >= {0} AND y < {1}".format(cy, cy1);
    },

    _getJson: function(sql, callback) {
      var url = this.base_url + "?q=" + encodeURIComponent(sql) +
        "&v=" + this._version;

      if ($.browser.msie) {
        $.ajax({
          url: url,
          method: 'get',
          dataType: 'jsonp',
          error: function(e, t, ee) {},
          success: function(data) {
            callback(data);
          }
        });
      } else {
        $.getJSON(url ,function(data){
          callback(data);
        });
      }
    },

    _drawCanvasImage: function(canvasData) {
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
    }
  });

  return CanvasJSONLayerClass;

});
