function Forest2000TileLayer(canvas_setup, filter) {
  this.tileSize = new google.maps.Size(256, 256);
  this.maxZoom = 19;
  this.name = "forest2000";
  this.alt = "Canvas forest2000 tile layer";
  this.tiles = {};
  this.canvas_setup = canvas_setup;
  this.filter = filter;
}

// create a tile with a canvas element
Forest2000TileLayer.prototype.create_tile_canvas = function(coord, zoom, ownerDocument) {
  // create canvas and reset style
  var canvas = ownerDocument.createElement('canvas');
  canvas.style.border  = "none";
  canvas.style.margin  = "0";
  canvas.style.padding = "0";

  // prepare canvas and context sizes
  var ctx = canvas.getContext('2d');
  ctx.width = canvas.width = this.tileSize.width;
  ctx.height = canvas.height = this.tileSize.height;

  //set unique id
  var tile_id = coord.x + '_' + coord.y + '_' + zoom;
  canvas.setAttribute('id', tile_id);
  if (tile_id in this.tiles) {
    delete this.tiles[tile_id];
  }

  this.tiles[tile_id] = canvas;

  // custom setup
  if (this.canvas_setup) {
    this.canvas_setup(canvas, coord, zoom);
  }

  return canvas;
}

Forest2000TileLayer.prototype.filter_tile = function(canvas) {
  var ctx = canvas.getContext('2d');
  ctx.drawImage(canvas.image, 0, 0);

  var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
  this.filter.apply(this, [I.data, ctx.width, ctx.height]);
  ctx.putImageData(I,0,0);
}

// render visible tiles on a canvas, return a canvas object
// map: map where tiles are rendering
Forest2000TileLayer.prototype.composed = function(map, w, h) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  ctx.width = canvas.width = w || $(map).width();
  ctx.height = canvas.height = h || $(map).height();

  for(var i in this.tiles) {
    var t = this.tiles[i];
    var mpos = $(map).offset();
    var pos = $(t).offset();
    ctx.drawImage(t, pos.left - mpos.left, pos.top - mpos.top);
  }

  return canvas;
}

Forest2000TileLayer.prototype.filter_tiles = function() {
  var args = Array.prototype.slice.call(arguments);
  for(var c in this.tiles) {
    this.filter_tile(this.tiles[c], args);
  }
}
Forest2000TileLayer.prototype.getTile = function(coord, zoom, ownerDocument) {
  // could be called directly...
  return this.create_tile_canvas(coord, zoom, ownerDocument);
};

Forest2000TileLayer.prototype.releaseTile = function(tile) {
  var id = tile.getAttribute('id');
  delete this.tiles[id];
};

// optimized version for threshold rendering
function Forest2000TileLayerThreshold (canvas_setup, filter) {
  Forest2000TileLayer.call(this, canvas_setup, filter);
  this.threshold = 0;
  this.start_threshold = 0;
}


Forest2000TileLayerThreshold.prototype = new Forest2000TileLayer();

Forest2000TileLayerThreshold.prototype.filter_tiles = function() {
  var new_threshold = arguments[0];
  Forest2000TileLayer.prototype.filter_tiles.apply(this, arguments)
  this.threshold = new_threshold;
}

Forest2000TileLayerThreshold.prototype.filter_tile = function(canvas) {
  var ctx = canvas.getContext('2d');
  var coord = canvas.coord;

  if (canvas.coord) {
    var zsteps = coord.z - 12;

    if (zsteps > 0) {
      ctx['imageSmoothingEnabled'] = false;
      ctx['mozImageSmoothingEnabled'] = false;
      ctx['webkitImageSmoothingEnabled'] = false;

      var srcX = 256 / Math.pow(2, zsteps) * (coord.x % Math.pow(2, zsteps));
      var srcY = 256 / Math.pow(2, zsteps) * (coord.y % Math.pow(2, zsteps));
      var srcW = 256 / Math.pow(2, zsteps);
      var srcH = 256 / Math.pow(2, zsteps);
      ctx.clearRect(0, 0, 256, 256);
      ctx.drawImage(canvas.image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
    } else {
      try {
        ctx.drawImage(canvas.image, 0, 0);
      } catch(err) { }
    }

    var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.filter.apply(this, [I.data, ctx.width, ctx.height]);
    ctx.putImageData(I,0,0);
  }
}

var Forest2000 = function() {
  var me = { };

  function filter(image_data, w, h, year_start, year_end) {
    var components = 4; //rgba
    var pixel_pos;
    var zoom = map.getZoom();
    var t=0;
    //var threshold=Number(config.BASELAYER.slice(4));
    //(!threshold)? threshold=10:true;
    for(var i=0; i < w; ++i) {
      for(var j=0; j < h; ++j) {
        var pixel_pos = (j*w + i) * components;
        var intensity = image_data[pixel_pos+1];
        //var c = (Math.ceil(3*intensity/255));

        image_data[pixel_pos] = 151;
        image_data[pixel_pos + 1] = 189;
        image_data[pixel_pos + 2] = 61;
        
        if (zoom < 13) {
          //intensity>0? image_data[pixel_pos+ 3] = (intensity+t-(t*intensity)/256)*0.8 : image_data[pixel_pos+ 3] =0;
          image_data[pixel_pos+ 3] = intensity*0.8;
        } else {
          image_data[pixel_pos+ 3] = intensity*0.8;
        }
      }
    }
  };

  function canvas_setup(canvas, coord, zoom) {
    var xhr = new XMLHttpRequest();

    var ctx = canvas.getContext('2d');

    var x = coord.x;
    var y = coord.y;
    var z = zoom;

    if (zoom > 12) {
      x = Math.floor(coord.x/(Math.pow(2, zoom - 12)));
      y = Math.floor(coord.y/(Math.pow(2, zoom - 12)));
      z = 12;
      } else {
        y = (y > Math.pow(2,z) ? y % Math.pow(2,z) : y);
        if (x >= Math.pow(2,z)) {
          x = x % Math.pow(2,z);
        } else if (x < 0) {
          x = Math.pow(2,z) - Math.abs(x);
        }
      }

    if (config.canopy_choice) {
      var url = 'http://earthengine.google.org/static/hansen_2013/gfw_tree_loss_year_'+ config.canopy_choice +'/' + z + '/' + x + '/' + y + '.png';
    } else {
      var canopy = (config.BASELAYER === 'loss') ? '30' : (config.BASELAYER && config.BASELAYER.slice(-2) ? config.BASELAYER.slice(-2) : 30);
      var url = 'http://earthengine.google.org/static/hansen_2013/gfw_tree_loss_year_'+ canopy +'/' + z + '/' + x + '/' + y + '.png';
      config.canopy_choice = canopy;
    }
    
    xhr.onload = function () {
      var url = URL.createObjectURL(this.response),
          image = new Image();

      image.onload = function () {
        image.crossOrigin = '';

        canvas.image = image;
        canvas.coord = coord;
        canvas.coord.z = zoom;

        ctx.drawImage(image, 0, 0);
        Forest2000.heightLayer.filter_tile(canvas);

        URL.revokeObjectURL(url);
      };

      image.src = url;
    };

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.send();
  }

  me.init = function(map, callback) {
    this.map = map;
    this.heightLayer = new Forest2000TileLayerThreshold(canvas_setup, filter);
    this.map.overlayMapTypes.insertAt(0, this.heightLayer);

    if (typeof cover_extent !== 'undefined' && cover_extent.attributes['visible']) callback && callback();

    return me;
    //this.setup_ui();
  }

  me.show = function() {
    this.heightLayer = new Forest2000TileLayerThreshold(canvas_setup, filter);
    this.map.overlayMapTypes.insertAt(0, this.heightLayer);
  }

  me.hide = function() {
    var overlays_length = this.map.overlayMapTypes.getLength();

    if (overlays_length > 0) {
      for (var i = 0; i< overlays_length; i++) {
        var layer = this.map.overlayMapTypes.getAt(i);
        if (layer && layer.name == 'forest2000') this.map.overlayMapTypes.removeAt(i);
      }
    }
  }

  me.stop = function() {
    var overlays_length = this.map.overlayMapTypes.getLength();

    if (overlays_length > 0) {
      for (var i = 0; i< overlays_length; i++) {
        var layer = this.map.overlayMapTypes.getAt(i);
        if (layer && layer.name == 'forest2000') this.map.overlayMapTypes.removeAt(i);
      }
    }
  }

  return me;
}();