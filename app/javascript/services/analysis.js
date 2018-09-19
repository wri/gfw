import axios from 'axios';

const REQUEST_URL = `${process.env.GFW_API}`;

const QUERIES = {
  umdAdmin:
    '/v3/umd-loss-gain/admin/{location}?period={startDate}%2C{endDate}&thresh={threshold}',
  umdByType:
    '/{slug}/{type}/{location}?period={startDate}%2C{endDate}&thresh={threshold}',
  umdGeostore:
    '/{slug}?geostore={geostoreId}&period={startDate}%2C{endDate}&thresh={threshold}'
};

const getLocationUrl = ({ adm0, adm1, adm2 }) =>
  `${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}`;

const buildAnalysisUrl = ({
  urlTemplate,
  slug,
  type,
  adm0,
  adm1,
  adm2,
  params
}) => {
  const location = getLocationUrl({ adm0, adm1, adm2 });
  const { startDate, endDate, threshold, thresh } = params;

  return urlTemplate
    .replace('{slug}', slug)
    .replace('{type}', type)
    .replace('{location}', location)
    .replace('{geostoreId}', adm0)
    .replace('{startDate}', startDate)
    .replace('{endDate}', endDate)
    .replace('{threshold}', threshold || thresh || 30);
};

const useSlugs = {
  gfw_oil_palm: 'oilpalm',
  gfw_mining: 'mining',
  gfw_wood_fiber: 'fiber',
  gfw_logging: 'logging'
};

export const fetchUmdLossGain = ({
  endpoints,
  type,
  country,
  region,
  subRegion,
  token
}) => {
  const allEndpoints =
    endpoints && !!endpoints.length
      ? endpoints
      : [{ slug: 'umd-loss-gain', params: {} }];
  const endpointUrls = allEndpoints.map(endpoint => {
    let urlTemplate = QUERIES.umdGeostore;
    if (type === 'country') urlTemplate = QUERIES.umdAdmin;
    if (type === 'use') urlTemplate = QUERIES.umdByType;

    return axios.get(
      `${REQUEST_URL}${buildAnalysisUrl({
        urlTemplate,
        ...endpoint,
        type,
        adm0: Object.keys(useSlugs).includes(country)
          ? useSlugs[country]
          : country,
        adm1: region,
        adm2: subRegion
      })}`
    );
  });

  return axios
    .all(endpointUrls, {
      cancelToken: token,
      timeout: 1800
    })
    .then(
      axios.spread((...responses) =>
        responses.reduce((obj, response) => {
          const fetchType = response.data.data.type;
          const fetchKey = fetchType === 'umd' ? 'umd-loss-gain' : fetchType;
          return {
            ...obj,
            [fetchKey]:
              response.data.data.attributes.totals ||
              response.data.data.attributes
          };
        }, {})
      )
    );
};
