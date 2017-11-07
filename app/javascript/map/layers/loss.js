import Canvas from './abstract/canvas';
import { scalePow } from 'd3-scale';
import moment from 'moment';

const OPTIONS = {
  threshold: 30,
  dataMaxZoom: 12,
  urlTemplate: 'https://storage.googleapis.com/wri-public/Hansen15/tiles/hansen_world/v1/tc{threshold}/{z}/{x}/{y}.png',
  minDate: '2001-01-01T12:00:00.000Z',
  maxDate: '2015-12-31T12:00:00.000Z'
};

class Loss extends Canvas {

  constructor(map, options) {
    super(map, OPTIONS);
    this.options = Object.assign({}, this.options, options);
    this.threshold = this.options.threshold;
    this.currentDate = this.options.currentDate || [moment(this.options.minDate), moment(this.options.maxDate)];
  }

  filterCanvasImgdata(imgdata, w, h, z) {
    const components = 4;
    const exp = z < 11 ? 0.3 + ((z - 3) / 20) : 1;
    if (! !!this.currentDate[0]._d) {
      this.currentDate[0] = moment(this.currentDate[0]);
      this.currentDate[1] = moment(this.currentDate[1]);
    }
    const yearStart = this.currentDate[0].year();
    const yearEnd = this.currentDate[1].year();

    const myscale = scalePow()
      .exponent(exp)
      .domain([0,256])
      .range([0,256]);

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        const pixelPos = (j * w + i) * components;
        const intensity = imgdata[pixelPos];
        const yearLoss = 2000 + imgdata[pixelPos + 2];

        if (yearLoss >= yearStart && yearLoss < yearEnd) {
          imgdata[pixelPos] = 220;
          imgdata[pixelPos + 1] = (72 - z) + 102 - (3 * myscale(intensity) / z);
          imgdata[pixelPos + 2] = (33 - z) + 153 - ((intensity) / z);
          imgdata[pixelPos + 3] = z < 13 ? myscale(intensity) : intensity;
        } else {
          imgdata[pixelPos + 3] = 0;
        }
      }
    }
  }

  setThreshold(threshold) {
    this.threshold = threshold;
  }

  setCurrentDate(date) {
    this.currentDate = date;
  }

  _getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z)
      .replace('{threshold}', this.threshold);
  }
}

export default Loss;
