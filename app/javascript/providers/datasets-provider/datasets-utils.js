import { formatDate } from 'utils/dates';
import { deburrUpper } from 'utils/data';
import moment from 'moment';

export const reduceParams = params => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const { format, key, interval, count } = param;
    let paramValue = param.default;
    const isDate = deburrUpper(param.key).includes('DATE');
    if (isDate && !paramValue) {
      let date = formatDate(new Date());
      if (interval && count) date = moment(date).subtract(count, interval);
      paramValue = moment(date).format(format || 'YYYY-MM-DD');
    }

    const newObj = {
      ...obj,
      [key]: paramValue,
      ...(key === 'endDate' &&
        param.url && {
          latestUrl: param.url
        }),
      ...(key === 'date' &&
        param.format && {
          latestFormat: param.format
        })
    };
    return newObj;
  }, {});
};

export const reduceSqlParams = params => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const newObj = {
      ...obj,
      [param.key]: param.key_params.reduce((subObj, item) => {
        const keyValues = {
          ...subObj,
          [item.key]: item.value || item.default
        };
        return keyValues;
      }, {})
    };
    return newObj;
  }, {});
};

export const getMaxRValue = imgEl => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext && canvas.getContext('2d');
  let data = null;

  if (!context) {
    return 'no context';
  }

  const height = 256;
  const width = 256;
  context.width = width;
  context.height = height;

  context.drawImage(imgEl, 0, 0);

  try {
    data = context.getImageData(0, 0, width, height);
    let rMax = 0;
    let rMin = 255;

    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        const pixelPos = (j * width + i) * 4;

        if (data.data[pixelPos + 3] !== 0) {
          const r = data.data[pixelPos];

          if (r > rMax) {
            rMax = r;
          }

          if (r < rMin) {
            rMin = r;
          }
        }
      }
    }

    return {
      rMax,
      rMin
    };
  } catch (e) {
    /* security error, img on diff domain */
    return 'error getting data';
  }
};
