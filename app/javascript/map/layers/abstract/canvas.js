import Overlay from './overlay';

const OPTIONS = {
  dataMaxZoom: 17
};

class Canvas extends Overlay {

  constructor(map, options) {
    super(map, OPTIONS);
    this.options = Object.assign({}, this.options, options);
    this.tiles = {};
  }

  getTile(coord, zoom, ownerDocument) {
    const tileId = this._getTileId(coord.x, coord.y, zoom);
    this._deleteOtherZoomTiles(zoom);

    if (this.tiles[tileId]) {
      return this.tiles[tileId].canvas;
    }

    let div = ownerDocument.createElement('div');
    div.style.width = this.tileSize.width;
    div.style.height = this.tileSize.height;
    div.style.position = 'relative';
    div.style.overflow = 'hidden';

    let canvas = ownerDocument.createElement('canvas');
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
      loader.style.top = '50%';
      loader.style.left = '50%';
      loader.style.border = '4px solid #FFF';
      loader.style.borderRadius = '50%';
      loader.style.borderTopColor = '#555';
      div.appendChild(loader);
    }

    const tileCoords = this._getTileCoords(coord.x, coord.y, zoom);
    const url = this._getUrl(tileCoords.x, tileCoords.y, tileCoords.z);

    this._getImage(url, (image) => {
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
    }, () => {
      if (this.options.showLoadingSpinner === true) {
        div.removeChild(loader);
      }
    });

    return div;
  }

  _getTileId(x, y, z) {
    return `${x}_${y}_${z}`;
  }

  _deleteOtherZoomTiles(zoom) {
    var tilesKeys = Object.keys(this.tiles);

    for (let i = 0; i < tilesKeys.length; i++) {
      if (this.tiles[tilesKeys[i]].z !== zoom) {
        delete this.tiles[tilesKeys[i]];
      }
    }
  }

  _getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }

  _getTileCoords(x, y, z) {
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

    return {x: x, y: y, z: z};
  }

  _getImage(url, callback, errorCallback) {
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
  }

  _cacheTile(canvasData) {
    canvasData.canvas.setAttribute('id', canvasData.tileId);
    this.tiles[canvasData.tileId] = canvasData;
  }

  _drawCanvasImage(canvasData) {
    "use asm";
    let canvas = canvasData.canvas,
      ctx = canvas.getContext('2d'),
      image = canvasData.image,
      zsteps = this._getZoomSteps(canvasData.z) |0;

    ctx.clearRect(0, 0, 256, 256);

    if (zsteps < 0) {
      ctx.drawImage(image, 0, 0);
    } else {
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;

      const srcX = (256 / Math.pow(2, zsteps) * (canvasData.x % Math.pow(2, zsteps))) |0,
        srcY = (256 / Math.pow(2, zsteps) * (canvasData.y % Math.pow(2, zsteps))) |0,
        srcW = (256 / Math.pow(2, zsteps)) |0,
        srcH = (256 / Math.pow(2, zsteps)) |0;

      ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
    }

    const I = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.filterCanvasImgdata(I.data, canvas.width, canvas.height, canvasData.z);
    ctx.putImageData(I, 0, 0);
  }

  _getZoomSteps(z) {
    return z - this.options.dataMaxZoom;
  }

  filterCanvasImgdata(imgdata, w, h) {

  }
}

export default Canvas;
