/**
 * The HTML5 Canvas map layer module.
 *
 * @return CanvasLayer class (extends Class).
 */
define([
  'underscore',
  '_string',
  'views/layers/class/OverlayLayerClass'
], function(_, _string, OverlayLayerClass) {

  'use strict';

  var MAX_MONTHS = 200;
  var BASE_MONTH = 71;

  var CanvasJSONLayerClass = OverlayLayerClass.extend({

    defaults: {
      user_name: 'wri-01',
      dataMaxZoom: 17,
    },

    init: function(layer, map) {
      this.tiles = {};
      this._super(layer, map);
      this.cartoSQL = new cartodb.SQL({
        user: this.options.user_name
      });
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this);
      return deferred.promise();
    },

    _getCanvas: function(coord, zoom, ownerDocument) {
      // create canvas and reset style
      var canvas = ownerDocument.createElement('canvas');
      var hit_canvas = ownerDocument.createElement('canvas');

      canvas.className = 'time_layer';
      hit_canvas.className = 'time_layer';

      canvas.style.border = hit_canvas.style.border = 'none';
      canvas.style.margin = hit_canvas.style.margin = '0';
      canvas.style.padding = hit_canvas.style.padding = '0';

      // prepare canvas and context sizes
      var ctx = canvas.getContext('2d');
      ctx.width = canvas.width = this.tileSize.width;
      ctx.height = canvas.height = this.tileSize.height;

      canvas.ctx = ctx;

      var hit_ctx = hit_canvas.getContext('2d');
      hit_canvas.width = hit_ctx.width = this.tileSize.width;
      hit_canvas.height = hit_ctx.height = this.tileSize.height;

      //set unique id
      var tile_id = coord.x + '_' + coord.y + '_' + zoom;

      canvas.setAttribute('id', tile_id);
      hit_canvas.setAttribute('id', tile_id);

      if (tile_id in this.tiles) {
        delete this.tiles[tile_id];
      }

      this.tiles[tile_id] = {
        canvas: canvas,
        ctx: ctx,
        hit_canvas: hit_canvas,
        hit_ctx: hit_ctx,
        coord: coord,
        zoom: zoom,
        primitives: null
      };

      // custom setup
      if (this.canvas_setup) {
        this.canvas_setup(this.tiles[tile_id], coord, zoom);
      }

      return canvas;
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
      var canvas = this._getCanvas(coord, zoom, ownerDocument);
      var sql = this._getSQL(coord.x, coord.y, zoom);
      var zoom_diff = zoom + 8 - Math.min(zoom + 8, 16);

      this.cartoSQL.execute(sql, _.bind(function(data) {
        var tile = {
          canvas: canvas,
          ctx: canvas.ctx,
          width: this.tileSize.width,
          height: this.tileSize.height,
          cells: this.pre_cache_months(data.rows, coord, zoom,
            zoom_diff)
        };

        this._render(tile);
      }, this));

      return canvas;
    },

    _getSQL: function(x, y, z) {
      // zoom + 8 is get because a tile in 'zoom' zoom level is a pixel in 'zoom + 8'
      // level. Remember, it is a quadtree, 1^8 = 256 and tile size is 256px
      var pixel_zoom = Math.min(z + 8, 16);
      var zoom_diff = z + 8 - pixel_zoom;

      // get x, y for cells and sd, se for deforestation changes
      // sd contains the months
      // se contains the deforestation for each entry in sd
      // take se and sd as a matrix [se|sd]
      var sql = _.str.sprintf(
        'SELECT x, y, sd, se FROM %(tableName)s WHERE z = %(z)s  AND x >= %(cx)s AND x < %(cx1)s AND y >= %(cy)s AND y < %(cy1)s', {
          tableName: this.layer.table_name,
          cx: (x * 256) >> zoom_diff,
          cx1: ((x + 1) * 256) >> zoom_diff,
          cy: (y * 256) >> zoom_diff,
          cy1: ((y + 1) * 256) >> zoom_diff,
          z: pixel_zoom
        });

      return sql;
    },

    _render: function(tile) {
      var month = -BASE_MONTH + MAX_MONTHS >> 0;
      var month_start = -BASE_MONTH + BASE_MONTH >> 0;
      var w = tile.canvas.width;
      var ctx = tile.ctx;
      var cells = tile.cells;

      if (!cells || cells.length === 0) {
        return;
      }

      //ctx.fillStyle = '#000';
      // clear canvas
      tile.canvas.width = w;
      ctx.fillStyle = '#F13689';

      var xc = cells.xcoords;
      var yc = cells.ycoords;

      // render cells
      //var data = ctx.getImageData(0, 0, w, h);
      //var pixels = data.data;
      var len = cells.length;
      var pixel_size = cells.size;
      var index, index0, mul;
      for (var i = 0; i < len; ++i) {
        mul = MAX_MONTHS * i;
        index = mul + month;
        index0 = mul + month_start;
        // set pixel by hand faster than doing fill rect (below)
        if (cells.deforestation[index] - cells.deforestation[index0] > 0) {
          ctx.fillRect(xc[i], yc[i], pixel_size, pixel_size);
        }
      }
    },

    pre_cache_months: function(rows, coord, zoom, zoom_diff) {
      var row;
      var xcoords;
      var ycoords;
      var deforestation;

      if (typeof(ArrayBuffer) !== 'undefined') {
        xcoords = new Uint8Array(new ArrayBuffer(rows.length));
        ycoords = new Uint8Array(new ArrayBuffer(rows.length));
        deforestation = new Uint8Array(new ArrayBuffer(rows.length *
          MAX_MONTHS)); // 256 months
      } else {
        // fallback
        xcoords = [];
        ycoords = [];
        deforestation = [];
        // array buffer set by default to 0
        // fucking javascript arrays not
        for (var r = 0; r < rows.length * MAX_MONTHS; ++r) {
          deforestation[r] = 0;
        }
      }

      // base tile x, y
      var tile_base_x = coord.x * 256;
      var tile_base_y = coord.y * 256;
      for (var i in rows) {
        row = rows[i];
        xcoords[i] = (row.x - tile_base_x) << zoom_diff;
        ycoords[i] = (row.y - tile_base_y) << zoom_diff;
        var base_idx = i * MAX_MONTHS;
        //def[row.sd[0]] = row.se[0];

        if (row.sd !== null) {
          for (var b = 0; b < row.sd.length; ++b) {
            deforestation[base_idx + row.sd[b] - BASE_MONTH] = row.se[b];
          }
        }

        for (var j = 1; j < MAX_MONTHS; ++j) {
          deforestation[base_idx + j] += deforestation[base_idx + j - 1];
        }
      }

      return {
        length: rows.length,
        xcoords: xcoords,
        ycoords: ycoords,
        deforestation: deforestation,
        size: 1 << zoom_diff
      };
    }

  });

  return CanvasJSONLayerClass;

});
