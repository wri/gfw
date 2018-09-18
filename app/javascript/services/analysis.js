import request from 'utils/request';

const REQUEST_URL = `${process.env.GFW_API}`;

const QUERIES = {
  umdGeostore:
    '/umd-loss-gain?geostore={geostoreId}&period=2001-01-01%2C2017-12-31&thresh=30',
  umdByType:
    '/umd-loss-gain/{type}/{location}?period=2001-01-01%2C2017-12-31&thresh=30',
  umdAdmin:
    '/v3/umd-loss-gain/{type}/{location}?period=2001-01-01%2C2017-12-31&thresh=30'
};

const getLocationUrl = ({ adm0, adm1, adm2 }) =>
  `${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}`;

const buildAnalysisUrl = ({ type, adm0, adm1, adm2 }) => {
  let url = type === 'geostore' ? QUERIES.umdGeostore : QUERIES.umdByType;
  let slug = type;
  if (type === 'country') {
    url = QUERIES.umdAdmin;
    slug = 'admin';
  }
  const location = getLocationUrl({ adm0, adm1, adm2 });

  return url.replace('{type}', slug).replace('{location}', location);
};

const useSlugs = {
  gfw_oil_palm: 'oilpalm',
  gfw_mining: 'mining',
  gfw_wood_fiber: 'fiber',
  gfw_logging: 'logging'
};

export const fetchUmdLossGain = ({
  type,
  country,
  region,
  subRegion,
  token
}) => {
  const url = `${REQUEST_URL}${buildAnalysisUrl({
    type,
    adm0: Object.keys(useSlugs).includes(country) ? useSlugs[country] : country,
    adm1: region,
    adm2: subRegion
  })}`;
  return request.get(url, { cancelToken: token, timeout: 1800 });
};
