import { scalePow } from 'd3-scale';
import moment from 'moment';

export default {
  // Tree cover 2010
  '78747ea1-34a9-4aa7-b099-bdb8948200f4': {
    decodeFunction: (data, w, h, z, params = {}) => {
      const components = 4;
      const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
      const imgData = data;

      const myscale = scalePow()
        .exponent(exp)
        .domain([0, 256])
        .range([0, 256]);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos + 1];

          imgData[pixelPos] = 151;
          imgData[pixelPos + 1] = 189;
          imgData[pixelPos + 2] = 61;

          imgData[pixelPos + 3] =
            z < 13 ? myscale(intensity) * 0.8 : intensity * 0.8;
        }
      }
    },
    decodeParams: {}
  },
  // Tree cover 2000
  'c05c32fd-289c-4b20-8d73-dc2458234e04': {
    decodeFunction: (data, w, h, z, params = {}) => {
      const components = 4;
      const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
      const imgData = data;

      const myscale = scalePow()
        .exponent(exp)
        .domain([0, 256])
        .range([0, 256]);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos + 1];

          imgData[pixelPos] = 151;
          imgData[pixelPos + 1] = 189;
          imgData[pixelPos + 2] = 61;

          imgData[pixelPos + 3] =
            z < 13 ? myscale(intensity) * 0.8 : intensity * 0.8;
        }
      }
    },
    decodeParams: {}
  },
  // Tree cover loss
  'c3075c5a-5567-4b09-bc0d-96ed1673f8b6': {
    decodeFunction: (
      data,
      w,
      h,
      z,
      params = { startDate: '2001-01-01', endDate: '2017-12-01' }
    ) => {
      const components = 4;
      const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
      const yearStart = parseInt(moment(params.startDate).format('YYYY'), 10);
      const yearEnd = parseInt(moment(params.endDate).format('YYYY'), 10);
      const imgData = data;

      const myscale = scalePow()
        .exponent(exp)
        .domain([0, 256])
        .range([0, 256]);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos];
          const yearLoss = 2000 + imgData[pixelPos + 2];

          if (yearLoss >= yearStart && yearLoss < yearEnd) {
            imgData[pixelPos] = 220;
            imgData[pixelPos + 1] = 72 - z + 102 - 3 * myscale(intensity) / z;
            imgData[pixelPos + 2] = 33 - z + 153 - intensity / z;
            imgData[pixelPos + 3] = z < 13 ? myscale(intensity) : intensity;
          } else {
            imgData[pixelPos + 3] = 0;
          }
        }
      }
    },
    decodeParams: {
      interval: 'years',
      intervalStep: 1,
      dateFormat: 'YYYY-MM-DD',
      speed: 100
    }
  },
  // GLADs
  'dd5df87f-39c2-4aeb-a462-3ef969b20b66': {
    decodeFunction: (
      data,
      w,
      h,
      z,
      params = { minDate: '2015-01-01', startDate: '2016-12-01' }
    ) => {
      // fixed variables
      const imgData = data;
      const { startDate, endDate, minDate, maxDate, weeks } = params;
      const numberOfDays = moment(maxDate).diff(minDate, 'days');

      // timeline or hover effect active range
      const activeStartDay =
        numberOfDays - moment(maxDate).diff(startDate, 'days');
      const activeEndDay = numberOfDays - moment(maxDate).diff(endDate, 'days');

      // show specified weeks from end date
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
          const day = imgData[pixelPos] * 255 + imgData[pixelPos + 1];
          const band3 = data[pixelPos + 2];
          // get confidence
          let confidence = -1;
          if (data[band3] >= 100 && data[band3] < 200) {
            confidence = 0;
          } else if (data[band3] >= 200) {
            confidence = 1;
          }

          if (
            confidence >= confidenceValue &&
            day > 0 &&
            day >= startDay &&
            day <= endDay
          ) {
            // get intensity
            let intensity = (band3 % 100) * 50;
            if (intensity > 255) {
              intensity = 255;
            }
            if (day >= numberOfDays - 7 && day <= numberOfDays) {
              imgData[pixelPos] = 219;
              imgData[pixelPos + 1] = 168;
              imgData[pixelPos + 2] = 0;
              imgData[pixelPos + 3] = intensity;
            } else {
              imgData[pixelPos] = 220;
              imgData[pixelPos + 1] = 102;
              imgData[pixelPos + 2] = 153;
              imgData[pixelPos + 3] = intensity;
            }
            continue; // eslint-disable-line
          }

          imgData[pixelPos + 3] = 0;
        }
      }
    },
    decodeParams: {
      interval: 'months',
      intervalStep: 1,
      dateFormat: 'YYYY-MM-DD'
    }
  }
};
