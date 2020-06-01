import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';

import forestTypes from 'data/forest-types';
import landCategories from 'data/land-categories';

export const formatUSD = (value, minimize = true) =>
  format('.2s')(value)
    .replace('G', minimize ? 'B' : ' billion')
    .replace('M', minimize ? 'M' : ' million')
    .replace('K', minimize ? 'K' : ' thousand');

export const formatNumber = ({ num, unit, precision }) => {
  let p = unit === '%' ? '2' : '3';
  if (precision && Number.isInteger(precision)) p = Math.abs(precision);
  let numFormat = unit === '%' ? `.${p}r` : `.${p}s`;
  if (unit === 'counts') numFormat = ',.0f';
  const thres = unit === '%' ? 0.1 : 1;
  let formattedNum =
    num < thres && num > 0 ? `< ${thres}` : format(numFormat)(num);
  if (unit !== '%' && num < thres && num > 0.01) {
    formattedNum = format('.3r')(num);
  } else if (unit === 'ha' && num < 1000) {
    formattedNum = Math.round(num);
  } else if (num > 0 && num < 0.01 && unit !== '%') {
    formattedNum = '<0.01';
  }
  return `${formattedNum}${unit && unit !== 'counts' ? unit : ''}`;
};

export const buildGadm36Id = (country, region, subRegion) =>
  `${country}${region ? `.${region}` : ''}${
    subRegion ? `.${subRegion}_1` : '_1'
  }`;

export const parseGadm36Id = gid => {
  if (!gid) return null;
  const ids = gid.split('.');
  const adm0 = (ids && ids[0]) || null;
  const adm1 = ids && ids[1] && ids[1].split('_')[0];
  const adm2 = ids && ids[2] && ids[2].split('_')[0];
  return {
    adm0,
    adm1: adm1 ? parseInt(adm1, 10) : undefined,
    adm2: adm2 ? parseInt(adm2, 10) : undefined
  };
};

export const getLocationFromData = data => {
  let newLocation = {};
  if (data && data.gid_0) {
    newLocation = parseGadm36Id(data[`gid_${data.level || '0'}`]);
  }
  return {
    type: 'country',
    ...newLocation
  };
};

export const buildFullLocationName = (
  { adm0, adm1, adm2 },
  { adm0s, adm1s, adm2s }
) => {
  let location = '';
  if (
    (adm0 && isEmpty(adm0s)) ||
    (adm1 && isEmpty(adm1s)) ||
    (adm2 && isEmpty(adm2s))
  ) {
    return '';
  }
  if (adm0) {
    const adm0Obj = adm0s && adm0s.find(a => a.value === adm0);
    location = adm0Obj ? adm0Obj.label : '';
  }
  if (adm1) {
    const adm1Obj = adm1s && adm1s.find(a => a.value === parseInt(adm1, 10));
    location = adm1Obj
      ? `${adm1Obj.label || 'unnamed region'}, ${location}`
      : location;
  }
  if (adm2) {
    const adm2Obj = adm2s && adm2s.find(a => a.value === parseInt(adm2, 10));
    location = adm2Obj
      ? `${adm2Obj.label || 'unnamed region'}, ${location}`
      : location;
  }
  return location;
};

export const buildLocationName = (
  { country, region, subRegion },
  { adms, adm1s, adm2s }
) => {
  let activeLocation = { label: '' };
  if (subRegion) {
    activeLocation =
      adm2s && adm2s.find(a => a.value === parseInt(subRegion, 10));
  } else if (region) {
    activeLocation = adm1s && adm1s.find(a => a.value === parseInt(region, 10));
  } else if (country) {
    activeLocation = adms && adms.find(a => a.value === country);
  }
  return activeLocation && activeLocation.label;
};

export const buildLocationFromNames = (name_0, name_1, name_2) =>
  `${name_2 ? `${name_2}, ` : ''}${name_1 ? `${name_1}, ` : ''}${name_0}`;

export const locationLevelToStr = location => {
  const { type, adm0, adm1, adm2 } = location;
  if (adm2) return 'adm2';
  else if (adm1) return 'adm1';
  else if (adm0) return 'adm0';
  return type || 'global';
};

export const validateEmail = email => {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validateURL = url => {
  if (!url) return true;
  // eslint-disable-next-line
  const re = /((([A-Za-z]{3,9}:(?:\/\/)+)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www\.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return re.test(String(url).toLowerCase());
};

export const getIndicator = (activeForestType, activeLandCategory, ifl) => {
  const forestType = forestTypes.find(f => f.value === activeForestType);
  const landCategory = landCategories.find(f => f.value === activeLandCategory);
  if (!forestType && !landCategory) return null;
  let label = '';
  let value = '';
  if (forestType && landCategory) {
    label = `${forestType.label} in ${landCategory.label}`;
    value = `${forestType.value}__${landCategory.value}`;
  } else if (landCategory) {
    label = landCategory.label;
    value = landCategory.value;
  } else {
    label = forestType.label;
    value = forestType.value;
  }
  if (value !== 'kba') {
    label = label.toLowerCase();
  }

  return {
    label: label.replace('({iflyear})', ifl),
    value
  };
};
