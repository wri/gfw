/**
 * The HTML5 Canvas map layer module.
 *
 * @return CanvasLayer class (extends Class).
 */
define([
  'underscore',
  'moment',
  'mps',
  '_string',
  'abstract/layer/OverlayLayerClass'
], function(
  _,
  moment,
  mps,
  _string,
  OverlayLayerClass
) {

  'use strict';

  var MAX_MONTHS = 200;
  var BASE_MONTH = 72;

  var CanvasJSONLayerClass = OverlayLayerClass.extend({

    defaults: {
      cartodbUserName: 'wri-01',
      dataMaxZoom: 17,
    },

    init: function(layer, options, map) {
      this.tiles = {};
      this.layer = layer;
      this.top_date = (((moment(this.layer.maxdate).year() - moment(this.layer.mindate).year()) * 12) + moment(this.layer.maxdate).month()) - 2;
      this._super(layer, options, map);
      this.getDates();
      this.cartoSQL = new cartodb.SQL({
        user: this.options.cartodbUserName
      });
    },

    _getLayer: function() {
      var deferred = new $.Deferred();
      deferred.resolve(this);
      mps.publish('Map/loading', [false]);
      return deferred.promise();
    },

    _getCanvas: function(coord, zoom, ownerDocument) {
      // create canvas and reset style
      var canvas = ownerDocument.createElement('canvas');
      canvas.className = this.layer.slug;
      canvas.style.border = 'none';
      canvas.style.margin = '0';
      canvas.style.padding = '0';

      // prepare canvas and context sizes
      var ctx = canvas.getContext('2d');
      ctx.width = canvas.width = this.tileSize.width;
      ctx.height = canvas.height = this.tileSize.height;

      canvas.ctx = ctx;
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
      var zoomDiff = zoom + 8 - Math.min(zoom + 8, 16);

      this.cartoSQL.execute(sql, _.bind(function(data) {
        if (!data) {return;}

        var tile = {
          canvas: canvas,
          ctx: canvas.ctx,
          width: this.tileSize.width,
          coord: coord,
          zoom: zoom,
          height: this.tileSize.height,
          cells: this.preCacheMonths(data.rows, coord, zoom,
            zoomDiff),
          top_date : data.top_date
        };

        //set unique id
        var tileId = '{0}_{1}_{2}'.format(coord.x, coord.y, zoom);
        canvas.setAttribute('id', tileId);

        if (tileId in this.tiles) {
          delete this.tiles[tileId];
        }

        this.tiles[tileId] = tile;

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
        'SELECT cartodb_id, x, y, sd, se FROM %(tableName)s WHERE z = %(z)s  AND x >= %(cx)s AND x < %(cx1)s AND y >= %(cy)s AND y < %(cy1)s', {
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
      var month = this.endMonth || -BASE_MONTH + MAX_MONTHS;
      var month_start = this.startMonth || 0;
      var month_change = this.top_date;
      var w = tile.canvas.width;
      var ctx = tile.ctx;
      var cells = tile.cells;
      if (!cells || cells.length === 0) {
        return;
      }

      // clear canvas
      tile.canvas.width = w;
      var xc = cells.xcoords;
      var yc = cells.ycoords;

      // render cells
      var len = cells.length;
      var pixel_size = cells.size;
      var index, index0, index1,mul;
      var previous = [];
      for (var i = 0; i < len; ++i) {
        mul = MAX_MONTHS * i;
        index  = mul + month;
        index0 = mul + month_start;
        index1 = mul + month_change;
        // set pixel by hand faster than doing fill rect (below)
        if (cells.deforestation[index] - cells.deforestation[index0] > 0) {
          ctx.fillStyle = '#F69';
          ctx.fillRect(xc[i], yc[i], pixel_size, pixel_size);
        }
        if (month >= month_change && cells.deforestation[index] - cells.deforestation[index1] > 0) {
          ctx.fillStyle = 'rgb(233, 189, 21)';
          ctx.fillRect(xc[i], yc[i], pixel_size, pixel_size);
        }
      }
    },

    preCacheMonths: function(rows, coord, zoom, zoom_diff) {
      var row,
          xcoords,
          ycoords,
          deforestation;

      if (typeof(ArrayBuffer) !== 'undefined') {
        xcoords       = new Uint8Array(new ArrayBuffer(rows.length));
        ycoords       = new Uint8Array(new ArrayBuffer(rows.length));
        deforestation = new Uint8Array(new ArrayBuffer(rows.length * MAX_MONTHS)); // 256 months
      } else {
        // fallback
        xcoords = [];
        ycoords = [];
        deforestation = [];

        // array buffer set by default to 0
        // fucking javascript arrays are not
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

        if (row.sd !== null) {
          for (var j = 0; j < row.sd.length; ++j) {
            var base = base_idx + row.sd[j] - BASE_MONTH;
            deforestation[base] = row.se[j];
          }
        }

        // add to the deforestation array each previous value, thus we have the whole picture at the end
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
    },

    updateTiles: function() {
      this.getDates();
      _.each(this.tiles, _.bind(function(tile) {
        this._render(tile);
      }, this));
    },

    getDates: function() {
      this.startMonth = Math.abs(moment(this.layer.mindate).diff(this.currentDate[0], 'months'));
      this.endMonth = Math.abs(moment(this.layer.mindate).diff(this.currentDate[1], 'months'));
    }

  });

  return CanvasJSONLayerClass;

});
