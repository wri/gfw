import Overlay from './overlay';

const OPTIONS = {
  dataMaxZoom: 17
};

class ImageLayer extends Overlay {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...OPTIONS, ...options };
    this.tiles = {};
  }

  getTile(coord, zoom, ownerDocument) {
    const zsteps = this.getZoomSteps(zoom);

    const tileCoords = this.getTileCoords(coord.x, coord.y, zoom, {});
    const url = this.getUrl({ ...tileCoords });
    const image = new Image();
    image.src = url;
    image.className += this.name;

    image.onerror = () => {
      this.style.display = 'none';
    };

    if (zsteps <= 0) {
      return image;
    }

    image.width = 256 * 2 ** zsteps;
    image.height = 256 * 2 ** zsteps;

    const srcX = 256 * (coord.x % 2 ** zsteps);
    const srcY = 256 * (coord.y % 2 ** zsteps);

    image.style.position = 'absolute';
    image.style.top = `${-srcY}px`;
    image.style.left = `${-srcX}px`;

    const div = ownerDocument.createElement('div');
    div.appendChild(image);
    div.style.width = `${this.tileSize.width}px`;
    div.style.height = `${this.tileSize.height}px`;
    div.style.position = 'relative';
    div.style.overflow = 'hidden';
    div.className += this.name;

    return div;
  }

  getZoomSteps(z) {
    return z - this.options.dataMaxZoom;
  }

  getUrl({ x, y, z }) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }

  getTileCoords(x, y, z) {
    let tileX = x;
    let tileY = y;
    let tileZ = z;
    if (z > this.options.dataMaxZoom) {
      tileX = Math.floor(x / 2 ** (z - this.options.dataMaxZoom));
      tileY = Math.floor(y / 2 ** (z - this.options.dataMaxZoom));
      tileZ = this.options.dataMaxZoom;
    } else {
      tileY = y > 2 ** z ? y % 2 ** z : y;
      if (x >= 2 ** z) {
        tileX = x % 2 ** z;
      } else if (x < 0) {
        tileX = 2 ** z - Math.abs(x);
      }
    }

    return {
      x: tileX,
      y: tileY,
      z: tileZ
    };
  }
}

export default ImageLayer;
