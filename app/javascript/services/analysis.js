import axios from 'axios';
import qs from 'query-string';
import moment from 'moment';

const REQUEST_URL = `${process.env.GFW_API}`;

const QUERIES = {
  umdAdmin: '/{slug}/admin/{location}{params}',
  umdByType: '/{slug}/{type}/{location}{params}',
  umdGeostore: '/{slug}{params}'
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
  const { startDate, endDate, threshold, query, number_of_days } = params;

  let period = startDate && endDate ? `${startDate},${endDate}` : '';
  if (number_of_days) {
    period = `${moment()
      .subtract(number_of_days, 'days')
      .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')}`;
  }

  const thresh = params.thresh || threshold ? params.thresh || threshold : '';
  const geostore = type === 'geostore' ? adm0 : '';
  const hasParams = period || thresh || geostore || hasParams;

  const queryParams = hasParams
    ? qs.stringify({
      ...(period && {
        period
      }),
      ...(thresh && {
        thresh
      }),
      ...(geostore && {
        geostore
      }),
      ...(query && {
        [query.param]: query.value
      })
    })
    : '';

  return urlTemplate
    .replace(
      '{slug}',
      slug === 'umd-loss-gain' && type === 'country' ? `v3/${slug}` : slug
    )
    .replace('{type}', type)
    .replace('{location}', location)
    .replace('{params}', `?${queryParams}`);
};

const useSlugs = {
  gfw_oil_palm: 'oilpalm',
  gfw_mining: 'mining',
  gfw_wood_fiber: 'fiber',
  gfw_logging: 'logging'
};

const endpointSlugs = {
  umd: 'umd-loss-gain',
  forma250gfw: 'forma250GFW',
  'viirs-fires': 'viirs-active-fires'
};

export const fetchUmdLossGain = ({
  endpoints,
  type,
  country,
  region,
  subRegion,
  token
}) => {
  const endpointUrls =
    endpoints &&
    endpoints.map(endpoint => {
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
          const fetchKey = endpointSlugs[fetchType] || fetchType;
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
