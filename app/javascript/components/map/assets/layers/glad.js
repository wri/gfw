import { fetchGLADLatest } from 'services/alerts';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import Canvas from './abstract/canvas';

const OPTIONS = {
  dataMaxZoom: 12,
  urlTemplate: `https://wri-tiles.s3.amazonaws.com/glad_${
    process.env.RAILS_ENV === 'production' ? 'prod' : 'staging'
  }/tiles/{z}/{x}/{y}.png`,
  startDate: '2015-01-01'
};

const getConfidence = number => {
  let confidence = -1;
  if (number >= 100 && number < 200) {
    confidence = 0;
  } else if (number >= 200) {
    confidence = 1;
  }
  return confidence;
};

const getIntensity = number => {
  let intensity = (number % 100) * 50;
  if (intensity > 255) {
    intensity = 255;
  }
  return intensity;
};

class Glad extends Canvas {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
    this.tiles = {};
  }

  getLayer() {
    return fetchGLADLatest()
      .then(result => {
        const { attributes } = result.data.data;
        if (!attributes || !attributes.length) return this;
        this.endDate = attributes[0].date;

        return this;
      })
      .catch(error => {
        console.error(error);
      });
  }

  getUrl(x, y, z) {
    return this.options.urlTemplate
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', z);
  }

  filterCanvasImgdata(imgdata, w, h) {
    // fixed variables
    const imageData = imgdata;
    const absStartDate = this.options.startDate;
    const absEndDate = moment(this.endDate);
    const numberOfDays = absEndDate.diff(absStartDate, 'days');

    // timeline or hover effect active range
    const { activeData } = this.options;
    const activeStartDay =
      !isEmpty(activeData) &&
      numberOfDays - absEndDate.diff(activeData.startDate, 'days');
    const activeEndDay =
      !isEmpty(activeData) &&
      numberOfDays - absEndDate.diff(activeData.endDate, 'days');

    // show specified weeks from end date
    const { weeks } = this.options;
    const rangeStartDate = weeks && numberOfDays - 7 * weeks;

    // get start and end day
    const startDay = activeStartDay || rangeStartDate || 0;
    const endDay = activeEndDay || numberOfDays;

    const confidenceValue = -1;
    const pixelComponents = 4; // RGBA
    let pixelPos = 0;
    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        pixelPos = (j * w + i) * pixelComponents;
        // day 0 is 2015-01-01 until latest date from fetch
        const day = imageData[pixelPos] * 255 + imageData[pixelPos + 1];
        const band3 = imgdata[pixelPos + 2];
        const confidence = getConfidence(imgdata[band3]);

        if (
          confidence >= confidenceValue &&
          day > 0 &&
          (day >= startDay || (0 && day <= endDay))
        ) {
          const intensity = getIntensity(band3);
          if (day >= numberOfDays - 7 && day <= numberOfDays) {
            imageData[pixelPos] = 219;
            imageData[pixelPos + 1] = 168;
            imageData[pixelPos + 2] = 0;
            imageData[pixelPos + 3] = intensity;
          } else {
            imageData[pixelPos] = 220;
            imageData[pixelPos + 1] = 102;
            imageData[pixelPos + 2] = 153;
            imageData[pixelPos + 3] = intensity;
          }
          continue; // eslint-disable-line
        }

        imageData[pixelPos + 3] = 0;
      }
    }
  }
}

export default Glad;
