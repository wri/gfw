import { scalePow } from 'd3-scale';

import { dateDiffInDays } from 'utils/dates';

export default {
  // Tree cover 2010
  '78747ea1-34a9-4aa7-b099-bdb8948200f4': {
    decodeFunction: (data, w, h, z) => {
      'use asm';

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
    decodeFunction: (data, w, h, z) => {
      'use asm';

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
      'use asm';

      const components = 4;
      const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;
      const yearStart = new Date(params.startDate).getUTCFullYear();
      const yearEnd = new Date(params.endDate).getUTCFullYear();
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
      dateFormat: 'YYYY',
      speed: 100
    }
  },
  // GLADs
  'dd5df87f-39c2-4aeb-a462-3ef969b20b66': {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      // fixed variables
      const imgData = data;
      const { startDate, endDate, minDate, maxDate, weeks, confirmedOnly } =
        params || {};

      const minDateTime = new Date(minDate);
      const maxDateTime = new Date(maxDate);
      const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

      // timeline or hover effect active range
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
      const activeStartDay =
        numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
      const activeEndDay =
        numberOfDays - dateDiffInDays(maxDateTime, endDateTime);

      // show specified weeks from end date
      const rangeStartDate = weeks && numberOfDays - 7 * weeks;
      // get start and end day
      const startDay = activeStartDay || rangeStartDate || 0;
      const endDay = activeEndDay || numberOfDays;
      const confidenceValue = confirmedOnly ? 200 : 0;
      const pixelComponents = 4; // RGBA
      let pixelPos = 0;

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          pixelPos = (j * w + i) * pixelComponents;
          // day 0 is 2015-01-01 until latest date from fetch
          const day = imgData[pixelPos] * 255 + imgData[pixelPos + 1];
          const band3 = data[pixelPos + 2];
          // get confidence
          const confidence = band3;

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
      interval: 'weeks',
      intervalStep: 1,
      dateFormat: 'YYYY-MM-DD',
      speed: 50
    }
  },
  // GLADS staging
  '959514e3-149a-46f5-890a-121b272e4b9d': {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      // fixed variables
      const imgData = data;
      const { startDate, endDate, minDate, maxDate, weeks } = params;

      const minDateTime = new Date(minDate);
      const maxDateTime = new Date(maxDate);
      const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

      // timeline or hover effect active range
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);
      const activeStartDay =
        numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
      const activeEndDay =
        numberOfDays - dateDiffInDays(maxDateTime, endDateTime);

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
      interval: 'weeks',
      intervalStep: 1,
      dateFormat: 'YYYY-MM-DD',
      speed: 50
    }
  },
  // Biomass Loss
  'b32a2f15-25e8-4ecc-98e0-68782ab1c0fe': {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      const imgData = data;
      const { startDate, endDate } = params;
      // We'll force the use of a 32bit integer wit `value |0`
      // More info here: http://asmjs.org/spec/latest/
      const components = 4 | 0;
      const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;

      const yearStart = 2001;
      const yearEnd = 2016;

      const myscale = scalePow()
        .exponent(exp)
        .domain([0, 256])
        .range([0, 256]);

      const buckets = [
        255,
        31,
        38, // first bucket R G B
        210,
        31,
        38,
        210,
        31,
        38,
        241,
        152,
        19,
        255,
        208,
        11
      ]; // last bucket
      const countBuckets = (buckets.length / 3) | 0; // 3: three bands

      for (let i = 0 | 0; i < w; ++i) {
        for (let j = 0 | 0; j < h; ++j) {
          const pixelPos = ((j * w + i) * components) | 0;
          // exit if year = 0 to reduce memory use
          if (imgData[pixelPos] === 0) {
            imgData[pixelPos + 3] = 0 | 0; // alpha channel 0-255
          } else {
            // get values from data
            let intensity = imgData[pixelPos + 1] | 0;
            intensity = myscale(intensity) | 0;
            imgData[pixelPos + 3] = 0 | 0;
            // filter range from dashboard
            if (intensity >= 0 && intensity <= 255) {
              const yearLoss = (2000 + imgData[pixelPos]) | 0;
              if (yearLoss >= yearStart && yearLoss < yearEnd) {
                const bucket = ~~(countBuckets * intensity / 256) * 3;
                imgData[pixelPos] = buckets[bucket]; // R 0-255
                imgData[pixelPos + 1] = buckets[bucket + 1]; // G 0-255
                imgData[pixelPos + 2] = buckets[bucket + 2]; // B 0-255
                imgData[pixelPos + 3] = intensity | 0; // alpha channel 0-255
              }
            }
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
  // Woody Biomass
  'f10bded4-94e2-40b6-8602-ae5bdfc07c08': {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      // We'll force the use of a 32bit integer wit `value |0`
      // More info here: http://asmjs.org/spec/latest/
      const imgData = data;
      const components = 4;
      const exp = z < 11 ? 0.3 + (z - 3) / 20 : 1;

      const myscale = scalePow()
        .exponent(exp)
        .domain([0, 256])
        .range([0, 256]);

      const c = [
        112,
        168,
        256, // first bucket
        76,
        83,
        122,
        210,
        31,
        38,
        241,
        152,
        19,
        255,
        208,
        11
      ]; // last bucket
      const countBuckets = (c.length / 3) | 0; // 3: three bands

      for (let i = 0 | 0; i < w; ++i) {
        for (let j = 0 | 0; j < h; ++j) {
          const pixelPos = ((j * w + i) * components) | 0;
          const intensity = imgData[pixelPos + 2];
          imgData[pixelPos + 3] = 0;
          const intensity_scaled = myscale(intensity) | 0;
          const bucket = ~~(countBuckets * intensity_scaled / 256) * 3;

          imgData[pixelPos] = 255 - intensity;
          imgData[pixelPos + 1] = 128;
          imgData[pixelPos + 2] = 0;
          if (intensity > 0) {
            imgData[pixelPos + 3] = intensity;
          }
        }
      }
    },
    decodeParams: {}
  }
};
