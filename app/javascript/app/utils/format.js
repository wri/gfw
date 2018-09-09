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
