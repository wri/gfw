import Canvas from './abstract/canvas';
import { scalePow } from 'd3-scale';

const OPTIONS = {
  threshold: 30,
  dataMaxZoom: 12,
  urlTemplate:
    'http://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_{threshold}_2014/{z}/{x}/{y}.png'
};

class Forest2000 extends Canvas {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = Object.assign({}, this.options, options);
    this.threshold = this.options.threshold;
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

        imgdata[pixelPos] = 151;
        imgdata[pixelPos + 1] = 189;
        imgdata[pixelPos + 2] = 61;

        imgdata[pixelPos + 3] =
          zoom < 13 ? myscale(intensity) * 0.8 : intensity * 0.8;
      }
    }
  }

  setThreshold(threshold) {
    this.threshold = threshold;
  }

  _getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z)
      .replace('{threshold}', this.threshold);
  }
}

export default Forest2000;
