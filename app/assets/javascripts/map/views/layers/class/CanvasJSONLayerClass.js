/**
 * The HTML5 Canvas map layer module.
 *
 * @return CanvasLayer class (extends Class).
 */
define([
  'Class',
  'underscore',
  '_string',
  'uri'
], function(Class, _, _string, UriTemplate) {

  'use strict';

  var CanvasJSONLayerClass = Class.extend({

    defaults: {
      dataMaxZoom: 17,
      size: 256
    },

    tiles: {},

    init: function (layer) {
      this.layer = layer;
      this.name = layer.slug;
      this.options = _.extend({}, this.defaults, this.options || {});

      this.tileSize = new google.maps.Size(this.options.size, this.options.size);
      this.cartoSQL = new cartodb.SQL({
        user: this.options.user_name
      });
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
      var sql = this._getSQL(coord.x, coord.y, zoom);

      canvas.style.border = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';
      canvas.width = this.tileSize.width;
      canvas.height = this.tileSize.height;

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

    _getSQL: function(x, y, z) {
      // zoom + 8 is get because a tile in "zoom" zoom level is a pixel in "zoom + 8"
      // level. Remember, it is a quadtree, 1^8 = 256 and tile size is 256px
      var pixel_zoom = Math.min(z + 8, 16);
      var zoom_diff = z + 8 - pixel_zoom;

      // get x, y for cells and sd, se for deforestation changes
      // sd contains the months
      // se contains the deforestation for each entry in sd
      // take se and sd as a matrix [se|sd]
      var sql = _.str.sprintf('SELECT x, y, sd, se FROM %(tableName)s WHERE z = %(z)s  AND x >= %(cx)s AND x < %(cx1)s AND y >= %(cy)s AND y < %(cy1)s', {
        tableName: this.layer.table_name,
        cx: (x * 256) >> zoom_diff,
        cx1: ((x + 1) * 256) >> zoom_diff,
        cy: (y * 256) >> zoom_diff,
        cy1: ((y + 1) * 256) >> zoom_diff,
        z: pixel_zoom
      });

      return sql;
    },

    _getJson: function(sql, callback) {
      var url = "http://dyynnn89u7nkm.cloudfront.net?q=" + sql +
        "&v=6";

      $.getJSON(url ,function(data){
        callback(data);
      });
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
