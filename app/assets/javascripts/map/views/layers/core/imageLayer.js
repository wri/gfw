/**
 * The Image map layer module.
 * 
 * @return ImageLayer class (extends Backbone.View).
 */
define([
  'backbone',
  'mps'
], function(Backbone, mps) {

  var ImageLayer = Backbone.View.extend({

    initialize: function () {
      this.tileSize = new google.maps.Size(256, 256);
      this.tiles = {};
      this.rendered = false;
    },

    render: function() {
      if (!this.rendered) {
        mps.publish('map/add-layer', [this]);
        this.rendered = true;
      }
    },

    getTile: function(coord, zoom, ownerDocument) {
      var x = coord.x;
      var y = coord.y;
      var z = zoom;

      var zsteps = zoom - 12;

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

      var url = this.url.replace('%z', z).replace('%x', x).replace('%y', y);

      var image = new Image();
      image.src = url;
      image.className += this.name;

      if (zsteps <= 0) return image;

      image.width = 256 * Math.pow(2, zsteps);
      image.height = 256 * Math.pow(2, zsteps);

      if (zsteps > 0) {
        var srcX = 256 * (coord.x % Math.pow(2, zsteps));
        var srcY = 256 * (coord.y % Math.pow(2, zsteps));

        image.style.position = 'absolute';
        image.style.top      = -srcY + 'px';
        image.style.left     = -srcX + 'px';
      }

      var div = ownerDocument.createElement('div');
      div.appendChild(image);
      div.style.width = this.tileSize.width + 'px';
      div.style.height = this.tileSize.height + 'px';
      div.style.position = 'relative';
      div.style.overflow = 'hidden';
      div.className += this.name;

      return div;
    },

    updateTiles: function() {
    },

    removeLayer: function() {
      mps.publish('map/remove-layer', [this.name]);
      this.rendered = false;
    }

  });

  return ImageLayer;
});