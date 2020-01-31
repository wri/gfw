import { apiRequest } from 'utils/request';
import qs from 'query-string';
import moment from 'moment';

const QUERIES = {
  umdAdmin: '/{version}/{slug}/admin/{location}{params}',
  umdByType: '/{version}/{slug}/{type}/{location}{params}',
  umdGeostore: '/{version}/{slug}{params}'
};

const getLocationUrl = ({ adm0, adm1, adm2 }) =>
  `${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}`;

const buildAnalysisUrl = ({
  urlTemplate,
  slug,
  version,
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
    .replace('{version}', version || 'v1')
    .replace('{slug}', slug)
    .replace('{type}', type)
    .replace('{location}', location)
    .replace('{params}', `?${queryParams}`);
};

const getUrlTemplate = type => {
  let urlTemplate = QUERIES.umdGeostore;
  if (type === 'country') urlTemplate = QUERIES.umdAdmin;
  if (type === 'use' || type === 'wdpa') urlTemplate = QUERIES.umdByType;
  return urlTemplate;
};

const reduceAnalysisResponse = response => {
  const { data } = response.data;
  const { attributes } = data || {};
  if (attributes) {
    const fetchType = data && data.type;
    const fetchKey =
      fetchType === 'umd' ? 'umd-loss-gain' : fetchType.toLowerCase();
    return {
      [fetchKey]: attributes
    };
  }
  return {};
};

export const fetchAnalysisEndpoint = ({ type, ...rest }) =>
  apiRequest.get(
    `${buildAnalysisUrl({
      urlTemplate: getUrlTemplate(type),
      type,
      ...rest
    })}`
  );

export const fetchUmdLossGain = ({
  endpoints,
  type,
  adm0,
  adm1,
  adm2,
  token
}) => {
  const endpointUrls =
    endpoints &&
    endpoints.map(endpoint => {
      const urlTemplate = getUrlTemplate(type);

      return apiRequest.get(
        `${buildAnalysisUrl({
          urlTemplate,
          ...endpoint,
          type,
          adm0,
          adm1,
          adm2
        })}`
      );
    });

  return apiRequest
    .all(endpointUrls, {
      cancelToken: token,
      timeout: 1800
    })
    .then(
      apiRequest.spread(
        (...responses) =>
          responses &&
          responses.reduce((obj, response) => {
            const analysis = reduceAnalysisResponse(response);
            return {
              ...obj,
              ...analysis
            };
          }, {})
      )
    );
};
