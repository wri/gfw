/*
 ====================
 this class renders deforestation data in a given time
 ====================
*/

function TimePlayer(table) {
    this.time = 0;
    this.canvas_setup = this.get_time_data;
    this.render = this.render_time;
    this.cells = [];
    this.table = table;
    //this.base_url = 'http://sql.wri-01.cartodb.com/api/v2/sql';
    this.base_url = 'http://wri-01.cartodb.com/api/v2/sql';
}

TimePlayer.prototype = new CanvasTileLayer();

/**
 * change time, t is the month (integer)
 */
TimePlayer.prototype.set_time = function(t) {
    this.time = t;
    this.redraw();
};

/**
 * change table where the data is choosen
 */
TimePlayer.prototype.set_table = function(table, size) {
  if(this.table === table) {
      return; // nothing to do
  }
  this.table = table;
  this.pixel_size = size;
  this.recreate();
  this.redraw();
};

/**
 * change shown country
 * @param country country iso
 */
TimePlayer.prototype.set_country_iso = function(country) {
  this.country = country;
  this.recreate();
  this.redraw();
};


/**
 * private
 */

// get data from cartodb
TimePlayer.prototype.sql = function(sql, callback) {
    var self = this;
    $.getJSON(this.base_url  + "?q=" + encodeURIComponent(sql) ,function(data){
        callback(data);
    });
};

// precache data to render fast
TimePlayer.prototype.pre_cache_months = function(rows, coord, zoom) {
    var row;
    var xcoords;
    var ycoords;

    if(typeof(ArrayBuffer) !== undefined) {
        xcoords = new Uint8Array(new ArrayBuffer(rows.length));
        ycoords = new Uint8Array(new ArrayBuffer(rows.length));
    } else {
        // fallback
        xcoords = [];
        ycoords = [];
    }

    // base tile x, y
    var tile_base_x = coord.x*256;
    var tile_base_y = coord.y*256;
    for(var i in rows) {
      row = rows[i];
      xcoords[i] = row.x - tile_base_x;
      ycoords[i] = row.y - tile_base_y;
    }
    return {
        length: rows.length,
        xcoords: xcoords,
        ycoords: ycoords
    };
    /*var row;
    var cells = [];
    var d;
    for(var i in rows) {
      row = rows[i];
      // filter the spikes in deforestation change


      var acumm_normalized = [];
      var cumm = row.cummulative;
      var max = this.pixel_size*this.pixel_size;
      var max_p = max >>4;

      for(d = 0, l = cumm.length; d < l; ++d) {
          //acumm_normalized[d] = (4*((cumm[d] - cumm[0])/(max - cumm[0]))) >> 0;
          if((cumm[d] - cumm[0]) > max_p) {
            acumm_normalized[d] = 1 + ((3*((cumm[d] - cumm[0])/(max - cumm[0]))) >> 0);
          } else {
            acumm_normalized[d] = 0;
          }
      }

      // steps!
      var def = row.time_series;
      var steps = row.time_series;
      var last = -10;

      steps[0] = 0;
      steps[1] = 0;
      for(d = 2; d < def.length; ++d) {
        if(def[d] > 0) {
          last = d;
        }
        steps[d] = 0;
        if(acumm_normalized[d] > 0) {
            steps[d] = Math.max(0, 3 - (d - last));
        }
      }

      //var buffer = new ArrayBuffer(row.);

      cells[i] = {
        x: row.upper_left_x,
        y: row.upper_left_y,
        w: row.cell_width,
        h: row.cell_width,
        months_accum: acumm_normalized,//row.cummulative,
        months: row.time_series
      }
    }
    return cells;
    */
}

// get time data in json format
TimePlayer.prototype.get_time_data = function(tile, coord, zoom) {
    var self = this;

    if(!self.table) {
        return;
    }

    // get x, y for cells
    var sql = "SELECT x, y FROM {0} WHERE".format(this.table);

    // inside the country
    //sql += " WHERE iso = '{0}'".format(self.country);

    // for current zoom
    // zoom + 8 is get because a tile in "zoom" zoom level is a pixel in "zoom + 8"
    // level. Remember, it is a quadtree, 1^8 = 256 and tile size is 256px
    var pixel_zoom = zoom + 8;
    sql += " z = {0} ".format(pixel_zoom);

    // get cells inside the tile
    sql += " AND x >= {0} AND x < {1}".format(coord.x*256, (coord.x + 1)*256);
    sql += " AND y >= {0} AND y < {1}".format(coord.y*256, (coord.y + 1)*256);

    this.sql(sql, function(data) {
        tile.cells = self.pre_cache_months(data.rows, coord, zoom);
        self.redraw_tile(tile);
    });
};

TimePlayer.prototype.render_time = function(tile, coord, zoom) {
    var month = 1 + this.time>>0;
    var w = tile.canvas.width;
    var h = tile.canvas.height;
    var ctx = tile.ctx;
    var i, x, y, cell, cells;

    cells = tile.cells;

    if(!cells || cells.length === 0) {
      return;
    }
    console.log(cells.length);

    var colors = [
        'rgba(84, 48, 59, 0.6)',
        'rgba(104, 48, 59, 0.6)',
        'rgba(170, 52, 51, 0.6)',
        'rgba(255, 51, 51, 0.9)'
    ];

    var fillStyle;


    // clear canvas
    tile.canvas.width = w;

    var xc = cells.xcoords;
    var yc = cells.ycoords;
    // render cells
    var data = ctx.getImageData(0, 0, w, h);
    var pixels = data.data;
    for(i = 0; i < cells.length; ++i) {
      var idx = 4*(256*yc[i] + xc[i]);
      pixels[idx + 0] = 255;
      pixels[idx + 1] = 0;
      pixels[idx + 2] = 0;
      pixels[idx + 3] = 255;
      //ctx.fillRect(xc[i], yc[i], 1, 1);
    }
    ctx.putImageData(data, 0, 0);
};


/**
 * String formatting for JavaScript.
 *
 * Usage:
 *
 *   "{0} is {1}".format("CartoDB", "epic!");
 *   // CartoDB is epic!
 *
 */
String.prototype.format = (function(i, safe, arg) {
  function format() {
      var str = this,
          len = arguments.length+1;

      for (i=0; i < len; arg = arguments[i++]) {
          safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
          str = str.replace(RegExp('\\{'+(i-1)+'\\}', 'g'), safe);
      }
      return str;
  }
  format.native = String.prototype.format;
  return format;
})();
