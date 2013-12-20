function DeforestationTileLayer(canvas_setup, filter) {
  this.tileSize = new google.maps.Size(256,256);
  this.maxZoom = 19;
  this.name = "loss";
  this.alt = "Canvas tile layer";
  this.tiles = {};
  this.canvas_setup = canvas_setup;
  this.filter = filter;
}

// create a tile with a canvas element
DeforestationTileLayer.prototype.create_tile_canvas = function(coord, zoom, ownerDocument) {

  // create canvas and reset style
  var canvas = ownerDocument.createElement('canvas');
  canvas.style.border = "none";
  canvas.style.margin= "0";
  canvas.style.padding = "0";

  // prepare canvas and context sizes
  var ctx = canvas.getContext('2d');
  ctx.width = canvas.width = this.tileSize.width;
  ctx.height = canvas.height = this.tileSize.height;

  //set unique id
  var tile_id = coord.x + '_' + coord.y + '_' + zoom;
  canvas.setAttribute('id', tile_id);
  if(tile_id in this.tiles) {
    delete this.tiles[tile_id];
  }
  this.tiles[tile_id] = canvas;

  // custom setup
  if(this.canvas_setup) {
    this.canvas_setup(canvas, coord, zoom);
  }

  return canvas;

}

DeforestationTileLayer.prototype.filter_tile = function(canvas, args) {
  var ctx = canvas.getContext('2d');
  ctx.drawImage(canvas.image, 0, 0);
  var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
  this.filter.apply(this, [I.data, ctx.width, ctx.height].concat(args));
  ctx.putImageData(I,0,0);
}

// render visible tiles on a canvas, return a canvas object
// map: map where tiles are rendering
DeforestationTileLayer.prototype.composed = function(map, w, h) {
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

DeforestationTileLayer.prototype.filter_tiles = function() {
  var args = Array.prototype.slice.call(arguments);
  for(var c in this.tiles) {
    this.filter_tile(this.tiles[c], args);
  }
}
DeforestationTileLayer.prototype.getTile = function(coord, zoom, ownerDocument) {
  // could be called directly...
  return this.create_tile_canvas(coord, zoom, ownerDocument);
};

DeforestationTileLayer.prototype.releaseTile = function(tile) {
  var id = tile.getAttribute('id');
  delete this.tiles[id];
};


// optimized version for threshold rendering
function DeforestationTileLayerThreshold (canvas_setup, filter) {
  DeforestationTileLayer.call(this, canvas_setup, filter);
  this.threshold = 0;
  this.start_threshold = 0;
}

DeforestationTileLayerThreshold.prototype = new DeforestationTileLayer();

DeforestationTileLayerThreshold.prototype.filter_tiles = function() {
  var new_threshold = arguments[0];
  DeforestationTileLayer.prototype.filter_tiles.apply(this, arguments)
  this.threshold = new_threshold;
}

DeforestationTileLayerThreshold.prototype.filter_tile = function(canvas, args) {
  var new_threshold = args[0];
  var ctx = canvas.getContext('2d');
  ctx.drawImage(canvas.image, 0, 0);
  var I = ctx.getImageData(0, 0, canvas.width, canvas.height);
  this.filter.apply(this, [I.data, ctx.width, ctx.height].concat(args));
  ctx.putImageData(I,0,0);
}

var Deforestation = function() {

  var me = { };

  function filter(image_data, w, h, year_start, year_end) {
    var components = 4; //rgba
    var pixel_pos;
    for(var i=0; i < w; ++i) {
      for(var j=0; j < h; ++j) {
        var pixel_pos = (j*w + i) * components;
        var yearLoss = image_data[pixel_pos];
        var intensity = image_data[pixel_pos + 1];

        if (yearLoss) {

          yearLoss = 2000 + yearLoss;

          if (yearLoss >= year_start && yearLoss <= year_end) {
            image_data[pixel_pos] = intensity;
            image_data[pixel_pos + 1] = 0;
            image_data[pixel_pos + 2] = 0;
            image_data[pixel_pos + 3] =  intensity < 10 ? 0: 255;
          } else {
            image_data[pixel_pos + 3] = 0;
          }
        } else {
          image_data[pixel_pos + 3] = 0;
        }

      }
    }
  };

  function canvas_setup(canvas, coord, zoom) {
    var image = new Image();
    var ctx = canvas.getContext('2d');
    image.crossOrigin = '';
    image.src = 'http://earthengine.google.org/static/hansen_2013/gfw_loss_year/' + zoom + "/"+ coord.x + "/" + coord.y +".png";
    canvas.image = image;
    $(image).load(function() {
      //ctx.globalAlpha = 0.5;
      ctx.drawImage(image, 0, 0);
      Deforestation.heightLayer.filter_tile(canvas, [Deforestation.start_threshold, Deforestation.threshold]);
    });
  }

  me.init = function(map) {
    this.map = map;
    this.heightLayer = new DeforestationTileLayerThreshold(canvas_setup, filter);
    this.map.overlayMapTypes.insertAt(0, this.heightLayer);

    return me;
    //this.setup_ui();
  }

  me.show = function() {
    this.heightLayer = new DeforestationTileLayerThreshold(canvas_setup, filter);
    this.map.overlayMapTypes.insertAt(0, this.heightLayer);
  }

  me.hide = function() {
    var overlays_length = this.map.overlayMapTypes.getLength();

    if (overlays_length > 0) {
      for (var i = 0; i< overlays_length; i++) {
        var layer = this.map.overlayMapTypes.getAt(i);
        if (layer && layer.name == 'loss') this.map.overlayMapTypes.removeAt(i);
      }

    }
  }

  me.stop = function() {
    var overlays_length = this.map.overlayMapTypes.getLength();

    if (overlays_length > 0) {
      for (var i = 0; i< overlays_length; i++) {
        var layer = this.map.overlayMapTypes.getAt(i);
        if (layer && layer.name == 'loss') this.map.overlayMapTypes.removeAt(i);
      }

    }
  }

  me.set_range = function(s, e) {
    this.threshold = e;
    this.start_threshold = s;
    this.heightLayer.filter_tiles(this.start_threshold, this.threshold);
  }

  me.set_start_time = function(year) {
    this.start_threshold = year;
    this.heightLayer.filter_tiles(this.start_threshold, this.threshold);
  }

  me.set_time = function(month, year) {
    this.threshold = year;
    this.heightLayer.filter_tiles(this.start_threshold, this.threshold);
  }

  return me;
}();
