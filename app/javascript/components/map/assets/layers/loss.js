import { scalePow } from 'd3-scale';
import Canvas from './abstract/canvas';

const OPTIONS = {
  threshold: 30,
  dataMaxZoom: 12,
  urlTemplate:
    'https://storage.googleapis.com/wri-public/Hansen18/tiles/hansen_world/v1/tc{threshold}/{z}/{x}/{y}.png',
  startYear: 2001,
  endYear: 2018
};

class Loss extends Canvas {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }

  filterCanvasImgdata(imgdata, w, h, z) {
    const components = 4;
    const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
    const startYear = this.options.startYear;
    const endYear = this.options.endYear;

    const myscale = scalePow()
      .exponent(exp)
      .domain([0, 256])
      .range([0, 256]);

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        const pixelPos = (j * w + i) * components;
        const intensity = imgdata[pixelPos];
        const yearLoss = 2000 + imgdata[pixelPos + 2];

        if (yearLoss >= startYear && yearLoss < endYear) {
          imgdata[pixelPos] = 220; // eslint-disable-line
          imgdata[pixelPos + 1] = 72 - z + 102 - 3 * myscale(intensity) / z; // eslint-disable-line
          imgdata[pixelPos + 2] = 33 - z + 153 - intensity / z; // eslint-disable-line
          imgdata[pixelPos + 3] = z < 13 ? myscale(intensity) : intensity; // eslint-disable-line
        } else {
          imgdata[pixelPos + 3] = 0; // eslint-disable-line
        }
      }
    }
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

export default Loss;
