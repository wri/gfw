import { scalePow } from 'd3-scale';

import {
  dateDiffInDays,
  getYear,
  getDayOfYear,
  addToDate,
  formatDate
} from 'utils/dates';

const getExp = z => (z < 11 ? 0.3 + (z - 3) / 20 : 1);

const getScale = z =>
  scalePow()
    .exponent(getExp(z))
    .domain([0, 256])
    .range([0, 256]);

const padNumber = number => {
  const s = `00${number}`;
  return s.substr(s.length - 3);
};

const getDayRange = params => {
  const { startDate, endDate, minDate, maxDate, weeks } = params || {};

  const minDateTime = new Date(minDate);
  const maxDateTime = new Date(maxDate);
  const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

  // timeline or hover effect active range
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const activeStartDay =
    numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
  const activeEndDay = numberOfDays - dateDiffInDays(maxDateTime, endDateTime);

  // show specified weeks from end date
  const rangeStartDate = weeks && numberOfDays - 7 * weeks;
  // get start and end day
  const startDay = activeStartDay || rangeStartDate || 0;
  const endDay = activeEndDay || numberOfDays;

  return {
    startDay,
    endDay,
    numberOfDays
  };
};

const decodes = {
  treeCover: {
    decodeFunction: (data, w, h, z) => {
      'use asm';

      const imgData = data;
      const components = 4;
      const myScale = getScale(z);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos + 1];

          imgData[pixelPos] = 151;
          imgData[pixelPos + 1] = 189;
          imgData[pixelPos + 2] = 61;

          imgData[pixelPos + 3] =
            z < 13 ? myScale(intensity) * 0.8 : intensity * 0.8;
        }
      }
    },
    decodeParams: {}
  },
  treeCoverLoss: {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      const components = 4;
      const imgData = data;
      const myScale = getScale(z);

      const { startDate, endDate } = params;
      const yearStart = getYear(startDate);
      const yearEnd = getYear(endDate);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos];
          const yearLoss = 2000 + imgData[pixelPos + 2];
          const scaleIntensity = myScale(intensity);

          if (yearLoss >= yearStart && yearLoss <= yearEnd) {
            imgData[pixelPos] = 220;
            imgData[pixelPos + 1] = 72 - z + 102 - 3 * scaleIntensity / z;
            imgData[pixelPos + 2] = 33 - z + 153 - intensity / z;
            imgData[pixelPos + 3] = z < 13 ? scaleIntensity : intensity;
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
  treeLossByDriver: {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      const components = 4;
      const imgData = data;
      const myScale = getScale(z);

      const { startDate, endDate } = params;
      const yearStart = getYear(startDate);
      const yearEnd = getYear(endDate);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos];
          const yearLoss = 2000 + imgData[pixelPos + 2];
          const lossCat = imgData[pixelPos + 1];
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

          if (yearLoss >= yearStart && yearLoss < yearEnd) {
            imgData[pixelPos] = rgb[0];
            imgData[pixelPos + 1] =
              72 - z + rgb[1] - 3 * myScale(intensity) / z;
            imgData[pixelPos + 2] = 33 - z + rgb[2] - intensity / z;
            imgData[pixelPos + 3] = z < 13 ? myScale(intensity) : intensity;
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
  GLADs: {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      // fixed variables
      const imgData = data;
      const { confirmedOnly } = params;

      const { startDay, endDay, numberOfDays } = getDayRange(params) || {};

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
      speed: 100
    }
  },
  biomassLoss: {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      const imgData = data;
      const components = 4;
      const myScale = getScale(z);

      const { startDate, endDate } = params;
      const yearStart = getYear(startDate);
      const yearEnd = getYear(endDate);

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
      const countBuckets = buckets.length / 3; // 3: three bands

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          // exit if year = 0 to reduce memory use
          if (imgData[pixelPos] === 0) {
            imgData[pixelPos + 3] = 0; // alpha channel 0-255
          } else {
            // get values from data
            let intensity = imgData[pixelPos + 1];
            intensity = myScale(intensity);
            imgData[pixelPos + 3] = 0;
            // filter range from dashboard
            if (intensity >= 0 && intensity <= 255) {
              const yearLoss = 2000 + imgData[pixelPos];
              if (yearLoss >= yearStart && yearLoss < yearEnd) {
                const bucket = Math.floor(countBuckets * intensity / 256) * 3;
                imgData[pixelPos] = buckets[bucket]; // R 0-255
                imgData[pixelPos + 1] = buckets[bucket + 1]; // G 0-255
                imgData[pixelPos + 2] = buckets[bucket + 2]; // B 0-255
                imgData[pixelPos + 3] = intensity; // alpha channel 0-255
              }
            }
          }

          continue; // eslint-disable-line
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
  woodyBiomass: {
    decodeFunction: (data, w, h) => {
      'use asm';

      const imgData = data;
      const components = 4;

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos + 2];
          imgData[pixelPos + 3] = 0;

          imgData[pixelPos] = 255 - intensity;
          imgData[pixelPos + 1] = 128;
          imgData[pixelPos + 2] = 0;
          if (intensity > 0) {
            imgData[pixelPos + 3] = intensity;
          }
        }

        continue; // eslint-disable-line
      }
    },
    decodeParams: {}
  },
  forma: {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      const imgData = data;
      const components = 4;

      const { startDay, endDay } = getDayRange(params) || {};

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;
          const g = imgData[pixelPos + 1];
          const b = imgData[pixelPos + 2];
          const day = 255 * g + b;
          let intensity = 0;

          if (day >= startDay && day <= endDay) {
            const band3_str = padNumber(imgData[pixelPos].toString());
            const intensity_raw = parseInt(band3_str.slice(1, 3), 10);
            // Scale the intensity to make it visible
            intensity = intensity_raw * 55;
            // Set intensity to 255 if it's > than that value
            if (intensity > 255) {
              intensity = 255;
            }

            imgData[pixelPos] = 220;
            imgData[pixelPos + 1] = 102;
            imgData[pixelPos + 2] = 153;
            imgData[pixelPos + 3] = intensity;

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
      speed: 100
    }
  },
  terra: {
    decodeFunction: (data, w, h, z, params) => {
      'use asm';

      const imgData = data;
      const components = 4;

      const { startDate, endDate, minDate, maxDate } = params || {};

      const startYear = getYear(startDate);
      const minYear = getYear(minDate);
      const maxYear = getYear(maxDate);
      const maxYearDay = getDayOfYear(maxDate);
      const endYearDay = getDayOfYear(endDate);
      const recentStartDate = formatDate(addToDate(maxDate, -1, 'months'));
      const recentStartYear = getYear(recentStartDate);
      const recentStartDay = getDayOfYear(recentStartDate);

      const startDay =
        (startYear - minYear) * 23 + Math.floor(endYearDay / 16 + 1);

      const endDay =
        (getYear(endDate) - minYear) * 23 + Math.floor(endYearDay / 16 + 1);

      const recentStartRange =
        (recentStartYear - minYear) * 23 + Math.floor(recentStartDay / 16 + 1);

      const recentEndRange =
        (maxYear - minYear) * 23 + Math.floor(maxYearDay / 16 + 1);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          const pixelPos = (j * w + i) * components;

          const r = imgData[pixelPos];
          const g = imgData[pixelPos + 1];
          const b = imgData[pixelPos + 2];
          const intensity = Math.min(b * 4, 255);

          const day = r + g;

          if (day >= startDay && day <= endDay) {
            if (day >= recentStartRange && day <= recentEndRange) {
              imgData[pixelPos] = 219;
              imgData[pixelPos + 1] = 168;
              imgData[pixelPos + 2] = 0;
              imgData[pixelPos + 3] = intensity;
            } else {
              imgData[pixelPos] = 220;
              imgData[pixelPos + 1] = 102;
              imgData[pixelPos + 2] = 153;
              imgData[pixelPos + 3] = intensity;

              if (day > this.top_date) {
                imgData[pixelPos] = 233;
                imgData[pixelPos + 1] = 189;
                imgData[pixelPos + 2] = 21;
                imgData[pixelPos + 3] = intensity;
              }
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
      dateFormat: 'YYYY-MM-DD',
      speed: 100
    }
  },
  braLandCover: {
    decodeFunction: (data, w, h, z) => {
      'use asm';

      const imgData = data;
      const components = 4;
      const myScale = getScale(z);

      for (let i = 0; i < w; ++i) {
        for (let j = 0; j < h; ++j) {
          // maps over square
          const pixelPos = (j * w + i) * components;
          const intensity = imgData[pixelPos + 1];

          imgData[pixelPos + 3] =
            z < 13 ? myScale(intensity) * 256 : intensity * 256;

          // Forest Formations
          if (imgData[pixelPos] === 3) {
            imgData[pixelPos] = 0;
            imgData[pixelPos + 1] = 100;
            imgData[pixelPos + 2] = 0;
          } else if (imgData[pixelPos] === 4) {
            // Savannah Formations
            imgData[pixelPos] = 141;
            imgData[pixelPos + 1] = 144;
            imgData[pixelPos + 2] = 35;
          } else if (imgData[pixelPos] === 5) {
            // Mangroves
            imgData[pixelPos] = 138;
            imgData[pixelPos + 1] = 168;
            imgData[pixelPos + 2] = 29;
          } else if (imgData[pixelPos] === 9) {
            // Planted Forest
            imgData[pixelPos] = 232;
            imgData[pixelPos + 1] = 163;
            imgData[pixelPos + 2] = 229;
          } else if (imgData[pixelPos] === 11) {
            // Non-forest Wetlands
            imgData[pixelPos] = 39;
            imgData[pixelPos + 1] = 137;
            imgData[pixelPos + 2] = 212;
          } else if (imgData[pixelPos] === 12) {
            // Grassland
            imgData[pixelPos] = 204;
            imgData[pixelPos + 1] = 219;
            imgData[pixelPos + 2] = 152;
          } else if (imgData[pixelPos] === 13) {
            // Other Non-forest Vegetation
            imgData[pixelPos] = 138;
            imgData[pixelPos + 1] = 184;
            imgData[pixelPos + 2] = 75;
          } else if (imgData[pixelPos] === 15) {
            // Pasture
            imgData[pixelPos] = 255;
            imgData[pixelPos + 1] = 184;
            imgData[pixelPos + 2] = 126;
          } else if (imgData[pixelPos] === 18) {
            // Agriculture
            imgData[pixelPos] = 210;
            imgData[pixelPos + 1] = 169;
            imgData[pixelPos + 2] = 101;
          } else if (imgData[pixelPos] === 21) {
            // Pasture or Agriculture
            imgData[pixelPos] = 232;
            imgData[pixelPos + 1] = 176;
            imgData[pixelPos + 2] = 113;
          } else if (imgData[pixelPos] === 23) {
            // Beaches and Dunes
            imgData[pixelPos] = 221;
            imgData[pixelPos + 1] = 126;
            imgData[pixelPos + 2] = 107;
          } else if (imgData[pixelPos] === 24) {
            // Urban Infrastructure
            imgData[pixelPos] = 233;
            imgData[pixelPos + 1] = 70;
            imgData[pixelPos + 2] = 43;
          } else if (imgData[pixelPos] === 25) {
            // Other Non-vegetated Area
            imgData[pixelPos] = 255;
            imgData[pixelPos + 1] = 153;
            imgData[pixelPos + 2] = 255;
          } else if (imgData[pixelPos] === 26) {
            // Water Bodies
            imgData[pixelPos] = 163;
            imgData[pixelPos + 1] = 220;
            imgData[pixelPos + 2] = 254;
          } else if (imgData[pixelPos] === 27) {
            // Unobserved
            imgData[pixelPos] = 235;
            imgData[pixelPos + 1] = 236;
            imgData[pixelPos + 2] = 236;
            imgData[pixelPos + 3] = 0;
          } else if (
            imgData[pixelPos] === 1 ||
            imgData[pixelPos] === 2 ||
            imgData[pixelPos] === 10 ||
            imgData[pixelPos] === 14
          ) {
            // Unknown / No data
            imgData[pixelPos] = 256;
            imgData[pixelPos + 1] = 256;
            imgData[pixelPos + 2] = 256;
            imgData[pixelPos + 3] = 0;
          } else {
            imgData[pixelPos] = 256;
            imgData[pixelPos + 1] = 256;
            imgData[pixelPos + 2] = 256;
            imgData[pixelPos + 3] = 0;
          }
        }
      }
    },
    decodeParams: {
      interval: 'months',
      intervalStep: 1,
      dateFormat: 'YYYY-MM-DD',
      speed: 100
    }
  }
};

export default {
  '78747ea1-34a9-4aa7-b099-bdb8948200f4': decodes.treeCover,
  'c05c32fd-289c-4b20-8d73-dc2458234e04': decodes.treeCover,
  'c3075c5a-5567-4b09-bc0d-96ed1673f8b6': decodes.treeCoverLoss,
  'dcb082a9-6fd7-4564-9110-ddf5d3d6681e': decodes.treeLossByDriver,
  'dd5df87f-39c2-4aeb-a462-3ef969b20b66': decodes.GLADs,
  'b32a2f15-25e8-4ecc-98e0-68782ab1c0fe': decodes.biomassLoss,
  'f10bded4-94e2-40b6-8602-ae5bdfc07c08': decodes.woodyBiomass,
  '66203fea-2e58-4a55-b222-1dae075cf95d': decodes.forma,
  '790b46ce-715a-4173-8f2c-53980073acb6': decodes.terra,
  '220080ec-1641-489c-96c4-4885ed618bf3': decodes.braLandCover
};
