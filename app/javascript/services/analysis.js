import request from 'utils/request';

const REQUEST_URL = process.env.GFW_API;

const QUERIES = {
  umdLossGain:
    '/umd-loss-gain?geostore={geostore}&period=2001-01-01%2C2017-12-31&thresh=30'
};

export const fetchUmdLossGain = geostore => {
  const url = `${REQUEST_URL}${QUERIES.umdLossGain}`.replace(
    '{geostore}',
    geostore
  );
  return request.get(url);
};
