import { scalePow } from 'd3-scale';
import Canvas from './abstract/canvas';

const OPTIONS = {
  threshold: 30,
  dataMaxZoom: 4,
  urlTemplate:
    'https://storage.googleapis.com/wri-public/lossyear_classification_map/2017/gfw/tiles/hansen_world/v2/tc{threshold}/{z}/{x}/{y}.png',
  currentDate: ['2001-01-01', '2015-01-01'],
  startYear: 2001,
  endYear: 2015
};

class LossByDriver extends Canvas {
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
        const lossCat = imgdata[pixelPos + 1];
        let rgb = [255, 255, 255];
        if (lossCat === 1) {
          rgb = [244, 29, 54]; // commodities
        } else if (lossCat === 2) {
          rgb = [239, 211, 26]; // agri
        } else if (lossCat === 3) {
          rgb = [47, 191, 113]; // forestry
        } else if (lossCat === 4) {
          rgb = [173, 54, 36]; // fire
        } else if (lossCat === 5) {
          rgb = [178, 53, 204]; // urban
        }
        if (yearLoss >= startYear && yearLoss < endYear) {
          imgdata[pixelPos] = rgb[0]; // eslint-disable-line
          imgdata[pixelPos + 1] = rgb[1]; // eslint-disable-line
          imgdata[pixelPos + 2] = rgb[2]; // eslint-disable-line
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

export default LossByDriver;
