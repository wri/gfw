import deburr from 'lodash/deburr';
import toUpper from 'lodash/toUpper';
import chroma from 'chroma-js';

export function deburrUpper(string) {
  return toUpper(deburr(string));
}

export const sortByKey = (array, key, isAsc) =>
  array.sort((a, b) => {
    if (!isAsc) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });

export const getColorPalette = (colorRange, quantity) => {
  const trim = 0.5 / (quantity - 0.6);
  return chroma
    .scale(colorRange)
    .padding(trim)
    .colors(quantity);
};

export const getColorBuckets = colors => [
  {
    limit: 20,
    stdDev: -2,
    color: colors.ramp[8]
  },
  {
    limit: 40,
    stdDev: -1,
    color: colors.ramp[6]
  },
  {
    limit: 60,
    stdDev: 1,
    color: colors.ramp[4]
  },
  {
    limit: 80,
    stdDev: 2,
    color: colors.ramp[2]
  },
  {
    limit: 100,
    stdDev: 100,
    color: colors.ramp[0]
  }
];

export const getColorBucket = (buckets, value) =>
  buckets.find(c => value <= c.limit) || buckets[4];

export const hslShift = colorHex => {
  const [h, s, l] = chroma(colorHex).hsl();

  const hueShift = 0;
  let saturationShift = -0.3;
  let lightnessShift = 0.3;

  if (s < 0.5) {
    saturationShift = 0.3;
    lightnessShift = 0.5;
  } else if (s < 0.75) {
    saturationShift = 0.1;
    lightnessShift = 0.2;
  }

  const new_h = h + hueShift;
  const new_s = s + saturationShift <= 1 ? s + saturationShift : 1;
  const new_l = l + lightnessShift <= 1 ? l + lightnessShift : 1;

  return chroma.hsl(new_h, new_s, new_l).hex();
};

export const flattenObj = (target, opts = {}) => {
  const delimiter = opts.delimiter || '.';
  const maxDepth = opts.maxDepth;
  const output = {};

  const step = (object, prev, currentDepth = 1) => {
    Object.keys(object).forEach(key => {
      const value = object[key];
      const isarray = opts.safe && Array.isArray(value);
      const type = Object.prototype.toString.call(value);
      const isobject = type === '[object Object]' || type === '[object Array]';

      const newKey = prev ? prev + delimiter + key : key;

      if (
        !isarray &&
        isobject &&
        Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)
      ) {
        return step(value, newKey, currentDepth + 1);
      }

      output[newKey] = value;
      return false;
    });
  };

  step(target);

  return output;
};
