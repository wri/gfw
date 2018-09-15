import request from 'utils/request';

const REQUEST_URL = `${process.env.GFW_API}`;

const QUERIES = {
  umdGeostore:
    '/umd-loss-gain?geostore={geostoreId}&period=2001-01-01%2C2017-12-31&thresh=30',
  umdAdmin:
    '/v3/umd-loss-gain/admin/{location}?period=2001-01-01%2C2017-12-31&thresh=30'
};

const getLocationUrl = ({ country, region, subRegion }) =>
  `${country}${region ? `/${region}` : ''}${subRegion ? `/${subRegion}` : ''}`;

export const fetchUmdLossGainGeostore = ({ country, token }) => {
  const url = `${REQUEST_URL}${QUERIES.umdGeostore}`.replace(
    '{geostoreId}',
    country
  );
  return request.get(url, { cancelToken: token });
};

export const fetchUmdLossGainAdmin = ({
  country,
  region,
  subRegion,
  token
}) => {
  const url = `${REQUEST_URL}${QUERIES.umdAdmin}`.replace(
    '{location}',
    getLocationUrl({ country, region, subRegion })
  );
  return request.get(url, { cancelToken: token });
};
