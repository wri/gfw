import { format } from 'd3-format';

export const formatUSD = (value, minimize = true) =>
  format('.2s')(value)
    .replace('G', minimize ? 'B' : ' billion')
    .replace('M', minimize ? 'M' : ' million')
    .replace('K', minimize ? 'K' : ' thousand');

export const formatNumber = ({ num, unit }) => {
  const numFormat = unit === '%' ? '.2r' : '.3s';
  const thres = unit === '%' ? 0.1 : 1;
  let formattedNum =
    num < thres && num > 0 ? `<${thres}` : format(numFormat)(num);
  if (unit !== '%' && num < thres && num > 0.01) {
    formattedNum = format('.3r')(num);
  } else if (num > 0 && num < 0.01 && unit !== '%') {
    formattedNum = '<0.01';
  }
  return `${formattedNum}${unit || ''}`;
};

export const buildGadm36Id = (country, region, subRegion) =>
  `${country}${region ? `.${region}` : ''}${
    subRegion ? `.${subRegion}_1` : '_1'
  }`;

export const parseGadm36Id = gid => {
  const ids = gid.split('.');
  const adm0 = ids[0] || null;
  const adm1 = ids[1] && ids[1].split('_')[0];
  const adm2 = ids[2] && ids[2].split('_')[0];
  return { adm0, adm1: parseInt(adm1, 10), adm2: parseInt(adm2, 10) };
};

export const getLocationFromData = data => {
  let newLocation = {};
  if (data && data.level && data.gid_0) {
    newLocation = data.level ? parseGadm36Id(data[`gid_${data.level}`]) : {};
  }
  return {
    type: 'country',
    country: !!newLocation.adm0 && newLocation.adm0,
    region: !!newLocation.adm1 && newLocation.adm1,
    subRegion: !!newLocation.adm2 && newLocation.adm2
  };
};

export const buildFullLocationName = (
  { country, region, subRegion },
  { adms, adm1s, adm2s }
) => {
  let location = '';
  if (country) {
    const adm = adms && adms.find(a => a.value === country);
    location = adm ? adm.label : '';
  }
  if (region) {
    const adm1 = adm1s && adm1s.find(a => a.value === parseInt(region, 10));
    location = adm1 ? `${adm1.label}, ${location}` : location;
  }
  if (subRegion) {
    const adm2 = adm2s && adm2s.find(a => a.value === parseInt(subRegion, 10));
    location = adm2 ? `${adm2.label}, ${location}` : location;
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
