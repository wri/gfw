import { apiRequest } from 'utils/request';
import moment from 'moment';
import { all, spread } from 'axios';
import { fetchAnalysisEndpoint } from 'services/analysis';

const GLAD_ISO_DATASET = process.env.GLAD_ISO_DATASET;
const GLAD_ADM1_DATASET = process.env.GLAD_ADM1_DATASET;
const GLAD_ADM2_DATASET = process.env.GLAD_ADM2_DATASET;
const FIRES_ISO_DATASET = process.env.FIRES_ISO_DATASET;
const FIRES_ADM1_DATASET = process.env.FIRES_ADM1_DATASET;
const FIRES_ADM2_DATASET = process.env.FIRES_ADM2_DATASET;

const QUERIES = {
  gladIntersectionAlerts:
    "SELECT iso, adm1, adm2, week, year, alerts as count, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}'",
  firesIntersectionAlerts:
    "SELECT iso, adm1, adm2, week as alert__week, year as alert__year, alerts as alert__count, polyname FROM data WHERE {location} AND polyname = '{polyname}' AND fire_type = '{dataset}'",
  viirsAlerts: '{location}?group=true&period={period}&thresh=0',
  firesStats:
    '{location}?period={period}&aggregate_by=day&aggregate_values=true&fire_type=viirs',
  alertsLatest:
    'SELECT year, week FROM data GROUP BY year, week ORDER BY year DESC, week DESC LIMIT 1'
};

const getLocation = (adm0, adm1, adm2) =>
  `iso = '${adm0}'${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const getLatestAlerts = ({ location, params }) =>
  all([
    fetchAnalysisEndpoint({
      ...location,
      params,
      name: 'glad-alerts',
      slug: 'glad-alerts',
      version: 'v1'
    }),
    fetchAnalysisEndpoint({
      ...location,
      params,
      name: 'viirs-alerts',
      slug: 'viirs-active-fires',
      version: 'v1'
    })
  ]).then(
    spread((gladsResponse, firesResponse) => {
      const { value: glads } = gladsResponse.data.data.attributes || {};
      const { value: fires } = firesResponse.data.data.attributes || {};

      return {
        glads,
        fires
      };
    })
  );

export const fetchGladAlerts = ({ adm0, adm1, adm2, grouped }) => {
  let glad_summary_table = GLAD_ISO_DATASET;
  if ((adm0 && grouped) || adm1) {
    glad_summary_table = GLAD_ADM1_DATASET;
  }
  if ((adm1 && grouped) || adm2) {
    glad_summary_table = GLAD_ADM2_DATASET;
  }
  const url = `/query/${glad_summary_table}?sql=${
    QUERIES.gladIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin');
  return apiRequest.get(url, 3600, 'gladRequest');
};

export const fetchFiresAlerts = ({ adm0, adm1, adm2, dataset, download }) => {
  let fires_summary_table = FIRES_ISO_DATASET;
  if (adm2) {
    fires_summary_table = FIRES_ADM2_DATASET;
  } else if (adm1) {
    fires_summary_table = FIRES_ADM1_DATASET;
  }
  const url = `/query/${fires_summary_table}?sql=${
    QUERIES.firesIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin')
    .replace('{dataset}', dataset);

  if (download) {
    return {
      name: 'viirs_fire_alerts__count',
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
    data: {
      data: response.data.data.map(d => ({
        ...d,
        week: d.alert__week,
        year: d.alert__year,
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha
      }))
    }
  }));
};

export const fetchFiresAlertsGrouped = ({
  adm0,
  adm1,
  adm2,
  dataset,
  download
}) => {
  let fires_summary_table = FIRES_ADM1_DATASET;
  if (adm1) {
    fires_summary_table = FIRES_ADM2_DATASET;
  }
  const url = `/query/${fires_summary_table}?sql=${
    QUERIES.firesIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin')
    .replace('{dataset}', dataset);

  if (download) {
    return {
      name: 'viirs_fire_alerts__count',
      url: url.replace('query', 'download')
    };
  }

  return apiRequest.get(url).then(response => ({
    data: {
      data: response.data.data.map(d => ({
        ...d,
        week: d.alert__week,
        year: d.alert__year,
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha
      }))
    }
  }));
};

export const fetchFiresLatest = ({ adm1, adm2 }) => {
  let fires_summary_table = FIRES_ISO_DATASET;
  if (adm2) {
    fires_summary_table = FIRES_ADM2_DATASET;
  } else if (adm1) {
    fires_summary_table = FIRES_ADM1_DATASET;
  }

  const url = `/query/${fires_summary_table}?sql=${QUERIES.alertsLatest}`;
  return apiRequest
    .get(url, 3600, 'firesRequest')
    .then(response => {
      const { week, year } = response.data.data[0];
      const date = moment()
        .year(year)
        .day('Monday')
        .week(week)
        .format('YYYY-MM-DD');

      return {
        attributes: { updatedAt: date },
        id: null,
        type: 'glad-alerts'
      };
    })
    .catch(error => {
      console.error('Error in firesRequest:', error);
      return new Promise(resolve =>
        resolve({
          data: {
            data: {
              attributes: { updatedAt: lastFriday },
              id: null,
              type: 'fires-alerts'
            }
          }
        })
      );
    });
};

export const fetchViirsAlerts = ({ adm0, adm1, adm2, dates }) => {
  const url = `/viirs-active-fires?geostore=${adm0}${QUERIES.viirsAlerts}`
    .replace('{location}', !adm2 ? getLocation(adm0, adm1, adm2) : '')
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return apiRequest.get(url);
};

export const fetchFireAlertsByGeostore = params =>
  fetchAnalysisEndpoint({
    ...params,
    params,
    name: 'viirs-alerts',
    slug: 'viirs-active-fires',
    version: 'v1'
  });

export const fetchFiresStats = ({ adm0, adm1, adm2, dates }) => {
  const url = `/fire-alerts/summary-stats/admin/${QUERIES.firesStats}`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return apiRequest.get(url);
};

// Latest Dates for Alerts
const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchLatestDate = url =>
  apiRequest.get(url, 3600, 'gladRequest').catch(error => {
    console.error('Error in latest request:', error);
    return new Promise(resolve =>
      resolve({
        data: {
          data: [
            {
              attributes: { date: lastFriday }
            }
          ]
        }
      })
    );
  });

export const fetchGLADLatest = () => {
  const url = '/glad-alerts/latest';
  return apiRequest
    .get(url)
    .then(response => {
      const { date } = response.data.data[0].attributes;

      return {
        attributes: { updatedAt: date },
        id: null,
        type: 'glad-alerts'
      };
    })
    .catch(error => {
      console.error('Error in gladRequest', error);
      return new Promise(resolve =>
        resolve({
          attributes: { updatedAt: lastFriday },
          id: null,
          type: 'glad-alerts'
        })
      );
    });
};
