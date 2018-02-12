import { fetchGLADDates } from 'services/glad';
import { sortByKey } from 'utils/data';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import Canvas from './abstract/canvas';

const OPTIONS = {
  dataMaxZoom: 12,
  urlTemplate:
    'http://wri-tiles.s3.amazonaws.com/glad_staging/tiles/{z}/{x}/{y}.png'
};

const padNumber = number => {
  const s = `00${number}`;
  return s.substr(s.length - 3);
};

class Glad extends Canvas {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
    this.tiles = {};
  }

  getLayer() {
    return fetchGLADDates()
      .then(result => {
        const { data } = result.data;
        if (!data || !data.length) return this;

        const maxYear = maxBy(data, 'year').year;
        const maxYearData = sortByKey(
          groupBy(data, 'year')[maxYear],
          'julian_day'
        );
        const minYear = minBy(data, 'year').year;
        const minYearData =
          maxYear !== minYear
            ? sortByKey(groupBy(data, 'year')[minYear], 'julian_day')
            : maxYearData;
        this.startDate = moment()
          .year(minYear)
          .dayOfYear(minYearData[0].julian_day)
          .format('YYYY-MM-DD');
        this.endDate = moment()
          .year(maxYear)
          .dayOfYear(maxYearData[maxYearData.length - 1].julian_day)
          .format('YYYY-MM-DD');

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
    const imageData = imgdata;
    const startDate = moment(this.startDate);
    const endDate = moment(this.endDate);
    const customRangeDays = this.options.weeks && this.options.weeks * 7;
    const numberOfDays = endDate.diff(startDate, 'days');
    const customRangeStartDate = numberOfDays - customRangeDays;

    const confidenceValue = -1;
    const pixelComponents = 4; // RGBA

    let pixelPos = 0;
    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        pixelPos = (j * w + i) * pixelComponents;
        // day 0 is 2015-01-01 until current day
        const day = imageData[pixelPos] * 255 + imageData[pixelPos + 1];

        if (day >= customRangeStartDate || (0 && day <= numberOfDays)) {
          const band3_str = padNumber(imageData[pixelPos + 2].toString());

          // Grab confidence (the first value) from this string
          // confidence is stored as 1/2, subtract one to make it 0/1
          const confidence = parseInt(band3_str[0], 10) - 1;

          if (confidence >= confidenceValue) {
            // Grab the raw intensity value from the pixel; ranges from 1 - 255
            const intensity_raw = parseInt(band3_str.slice(1, 3), 10);
            // Scale the intensity to make it visible
            let intensity = intensity_raw * 50;
            // Set intensity to 255 if it's > than that value
            if (intensity > 255) {
              intensity = 255;
            }

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
        }

        imageData[pixelPos + 3] = 0;
      }
    }
  }
}

export default Glad;
