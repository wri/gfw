import { scalePow } from 'd3-scale';
import Canvas from './abstract/canvas';

const OPTIONS = {
  threshold: 30,
  dataMaxZoom: 12,
  urlTemplate:
    'https://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_{threshold}_2014/{z}/{x}/{y}.png'
};

class ForestCover extends Canvas {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }

  filterCanvasImgdata(imgdata, w, h) {
    const components = 4;
    const zoom = this.map.getZoom();
    const exp = zoom < 11 ? 0.3 + (zoom - 3) / 20 : 1;

    const myscale = scalePow()
      .exponent(exp)
      .domain([0, 256])
      .range([0, 256]);

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        const pixelPos = (j * w + i) * components;
        const intensity = imgdata[pixelPos + 1];

        imgdata[pixelPos] = 151; // eslint-disable-line
        imgdata[pixelPos + 1] = 189; // eslint-disable-line
        imgdata[pixelPos + 2] = 61; // eslint-disable-line

        imgdata[pixelPos + 3] = // eslint-disable-line
          zoom < 13 ? myscale(intensity) * 0.8 : intensity * 0.8;
      }
    }
  }

  setThreshold(threshold) {
    this.threshold = threshold;
  }

  getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z)
      .replace('{threshold}', this.options.threshold);
  }

  setOptions(options) {
    if (this.options.threshold !== options.threshold) {
      this.updateTilesEnable = false;
    }
    this.options = { ...this.options, ...options };
  }
}

export default ForestCover;
