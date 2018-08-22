import axios from 'axios';
import Overlay from './overlay';

const OPTIONS = {
  dataMaxZoom: 17
};

class Canvas extends Overlay {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...OPTIONS, ...options };
    this.tiles = {};
    this.updateTilesEnable = true;
  }

  getTile(coord, zoom, ownerDocument) {
    const { x, y } = coord;
    const tileId = `${x}_${y}_${zoom}`;
    this.deleteOtherZoomTiles(zoom);

    if (this.tiles[tileId]) {
      return this.tiles[tileId].canvas;
    }

    const div = ownerDocument.createElement('div');
    div.style.width = this.tileSize.width;
    div.style.height = this.tileSize.height;
    div.style.position = 'relative';
    div.style.overflow = 'hidden';

    const canvas = ownerDocument.createElement('canvas');
    canvas.style.border = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.width = this.tileSize.width;
    canvas.height = this.tileSize.height;
    div.appendChild(canvas);

    const tileCoords = this.getTileCoords(coord.x, coord.y, zoom);
    const url = this.getUrl(tileCoords.x, tileCoords.y, tileCoords.z);

    this.getImage(url, image => {
      const canvasData = {
        tileId,
        canvas,
        image,
        x: coord.x,
        y: coord.y,
        z: zoom
      };
      this.cacheTile(canvasData);
      this.drawCanvasImage(canvasData);
    });

    return div;
  }

  deleteOtherZoomTiles(zoom) {
    const tilesKeys = Object.keys(this.tiles);

    for (let i = 0; i < tilesKeys.length; i++) {
      if (this.tiles[tilesKeys[i]].z !== zoom) {
        delete this.tiles[tilesKeys[i]];
      }
    }
  }

  getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }

  getTileCoords(x, y, z) {
    const tile = { x, y, z };
    if (z > this.options.dataMaxZoom) {
      tile.x = Math.floor(x / 2 ** (z - this.options.dataMaxZoom));
      tile.y = Math.floor(y / 2 ** (z - this.options.dataMaxZoom));
      tile.z = this.options.dataMaxZoom;
    } else {
      tile.y = y > 2 ** z ? y % 2 ** z : y;
      if (x >= 2 ** z) {
        tile.z %= 2 ** z;
      } else if (x < 0) {
        tile.x = 2 ** z - Math.abs(x);
      }
    }

    return tile;
  }

  getImage(url, callback) {
    return axios
      .get(url, { responseType: 'blob' })
      .then(response => {
        const image = new Image();
        const imageUrl = URL.createObjectURL(response.data);
        image.onload = () => {
          image.crossOrigin = '';
          callback(image);
          URL.revokeObjectURL(url);
        };
        image.src = imageUrl;

        return image;
      })
      .catch(error => {
        console.warn(error);
      });
  }

  cacheTile(canvasData) {
    canvasData.canvas.setAttribute('id', canvasData.tileId);
    this.tiles[canvasData.tileId] = canvasData;
  }

  drawCanvasImage(canvasData) {
    const canvas = canvasData.canvas;
    const ctx = canvas.getContext('2d');
    const image = canvasData.image;
    const zsteps = this.getZoomSteps(canvasData.z) || 0;

    ctx.clearRect(0, 0, 256, 256);

    if (zsteps < 0) {
      ctx.drawImage(image, 0, 0);
    } else {
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;

      const srcX = 256 / 2 ** zsteps * (canvasData.x % 2 ** zsteps) || 0;
      const srcY = 256 / 2 ** zsteps * (canvasData.y % 2 ** zsteps) || 0;
      const srcW = 256 / 2 ** zsteps || 0;
      const srcH = 256 / 2 ** zsteps || 0;

      ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, 256, 256);
    }

    const I = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.filterCanvasImgdata(I.data, canvas.width, canvas.height, canvasData.z);
    ctx.putImageData(I, 0, 0);
  }

  getZoomSteps(z) {
    return z - this.options.dataMaxZoom;
  }

  updateTiles() {
    const tilesKeys = Object.keys(this.tiles);
    for (let i = 0; i < tilesKeys.length; i++) {
      this.drawCanvasImage(this.tiles[tilesKeys[i]]);
    }
  }

  setOptions(options) {
    this.options = { ...this.options, ...options };
  }

  filterCanvasImgdata() {}
}

export default Canvas;
