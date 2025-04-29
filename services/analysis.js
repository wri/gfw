import { apiRequest } from 'utils/request';
import { all, spread } from 'axios';
import qs from 'query-string';
import moment from 'moment';

const QUERIES = {
  umdAdmin: '/{version}/{slug}/admin/{location}{params}',
  umdByType: '/{version}/{slug}/{type}/{location}{params}',
  umdGeostore: '/{version}/{slug}{params}',
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
  params,
  aggregate,
  aggregateBy,
}) => {
  const location = getLocationUrl({ adm0, adm1, adm2 });
  const { startDate, endDate, threshold, query, number_of_days } = params;

  let period = startDate && endDate ? `${startDate},${endDate}` : '';
  if (number_of_days) {
    period = `${moment()
      .subtract(number_of_days, 'days')
      .format('YYYY-MM-DD')},${moment().format('YYYY-MM-DD')}`;
  }

  const geostore = type === 'geostore' ? adm0 : '';

  const queryParams = qs.stringify({
    ...(period && {
      period,
    }),
    ...(threshold && {
      threshold: parseInt(threshold, 10),
    }),
    ...(geostore && {
      geostore,
    }),
    aggregate_values: aggregate ? 'True' : false,
    ...(aggregateBy && {
      aggregate_by: aggregateBy,
    }),
    ...(query && {
      [query.param]: query.value,
    }),
  });

  return urlTemplate
    .replace('{version}', version || 'v1')
    .replace('{slug}', slug)
    .replace('{type}', type)
    .replace('{location}', location)
    .replace('{params}', `?${queryParams}`);
};

const getUrlTemplate = (type) => {
  let urlTemplate = QUERIES.umdGeostore;
  if (type === 'country') urlTemplate = QUERIES.umdAdmin;
  if (type === 'use' || type === 'wdpa') urlTemplate = QUERIES.umdByType;
  return urlTemplate;
};

const reduceAnalysisResponse = (response) => {
  const { data } = response.data;
  const { attributes } = data || {};
  if (attributes) {
    const fetchType = data && data.type;
    const fetchKey = fetchType.toLowerCase();
    return {
      [fetchKey]: attributes,
    };
  }
  return {};
};

export const fetchAnalysisEndpoint = ({ type, ...rest }) =>
  apiRequest.get(
    `${buildAnalysisUrl({
      urlTemplate: getUrlTemplate(type),
      type,
      ...rest,
    })}`
  );

export const fetchUmdLossGain = ({
  endpoints,
  type,
  adm0,
  adm1,
  adm2,
  token,
}) => {
  const endpointUrls =
    endpoints &&
    endpoints.map((endpoint) => {
      const urlTemplate = getUrlTemplate(type);

      return apiRequest.get(
        `${buildAnalysisUrl({
          urlTemplate,
          ...endpoint,
          type,
          adm0,
          adm1,
          adm2,
        })}`
      );
    });

  return all(endpointUrls, {
    cancelToken: token,
    timeout: 1800,
  }).then(
    spread(
      (...responses) =>
        responses &&
        responses.reduce((obj, response) => {
          const analysis = reduceAnalysisResponse(response);
          return {
            ...obj,
            ...analysis,
          };
        }, {})
    )
  );
};

export const fetchFireAlertsByGeostore = (params) =>
  fetchAnalysisEndpoint({
    ...params,
    params,
    name: 'viirs-alerts',
    slug: 'viirs-active-fires',
    version: 'v1',
  });
