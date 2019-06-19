import request from 'utils/request';
import moment from 'moment';
import { getIndicator } from 'utils/strings';

const REQUEST_URL = process.env.GFW_API;
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
    "SELECT iso, adm1, adm2, week, year, alerts as count, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}' AND fire_type = '{dataset}'",
  viirsAlerts: '{location}?group=true&period={period}&thresh=0',
  firesStats:
    '{location}?period={period}&aggregate_by=day&aggregate_values=true&fire_type=viirs',
  alertsLatest:
    'SELECT year, week FROM data GROUP BY year, week ORDER BY year DESC, week DESC LIMIT 1'
};

const getLocationQuery = (adm0, adm1, adm2) =>
  `${adm0}${adm1 ? `/${adm1}` : ''}${adm2 ? `/${adm2}` : ''}`;

const getLocation = (adm0, adm1, adm2) =>
  `iso = '${adm0}'${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const fetchGladAlerts = ({ adm0, adm1, adm2 }) => {
  let glad_summary_table = GLAD_ISO_DATASET;
  if (adm2) {
    glad_summary_table = GLAD_ADM2_DATASET;
  } else if (adm1) {
    glad_summary_table = GLAD_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${glad_summary_table}?sql=${
    QUERIES.gladIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchGladIntersectionAlerts = ({
  adm0,
  adm1,
  forestType,
  landCategory,
  download
}) => {
  const url = `${REQUEST_URL}/query/${
    adm1 ? GLAD_ADM2_DATASET : GLAD_ADM1_DATASET
  }?sql=${QUERIES.gladIntersectionAlerts}`
    .replace('{location}', getLocation(adm0, adm1))
    .replace('{polyname}', getIndicator(forestType, landCategory));
  if (download) return url.replace('query', 'download');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchFiresAlerts = ({ adm0, adm1, adm2, dataset }) => {
  let fires_summary_table = FIRES_ISO_DATASET;
  if (adm2) {
    fires_summary_table = FIRES_ADM2_DATASET;
  } else if (adm1) {
    fires_summary_table = FIRES_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${fires_summary_table}?sql=${
    QUERIES.firesIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin')
    .replace('{dataset}', dataset);
  return request.get(url, 3600, 'firesRequest');
};

export const fetchFiresLatest = ({ adm1, adm2 }) => {
  let fires_summary_table = FIRES_ISO_DATASET;
  if (adm2) {
    fires_summary_table = FIRES_ADM2_DATASET;
  } else if (adm1) {
    fires_summary_table = FIRES_ADM1_DATASET;
  }

  const url = `${REQUEST_URL}/query/${fires_summary_table}?sql=${
    QUERIES.alertsLatest
  }`;
  return request
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
  const url = `${REQUEST_URL}/viirs-active-fires/${!adm2 ? 'admin/' : ''}${
    QUERIES.viirsAlerts
  }`
    .replace('{location}', !adm2 ? getLocationQuery(adm0, adm1, adm2) : '')
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return request.get(url);
};

export const fetchFiresStats = ({ adm0, adm1, adm2, dates }) => {
  const url = `${REQUEST_URL}/fire-alerts/summary-stats/admin/${
    QUERIES.firesStats
  }`
    .replace('{location}', getLocationQuery(adm0, adm1, adm2))
    .replace('{period}', `${dates[1]},${dates[0]}`);
  return request.get(url);
};

// Latest Dates for Alerts
const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchLatestDate = url =>
  request.get(url, 3600, 'gladRequest').catch(error => {
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

export const fetchGLADLatest = params => {
  const { adm1, adm2 } = params || {};
  let glad_summary_table = GLAD_ISO_DATASET;
  if (adm2) {
    glad_summary_table = GLAD_ADM2_DATASET;
  } else if (adm1) {
    glad_summary_table = GLAD_ADM1_DATASET;
  }
  const url = `${REQUEST_URL}/query/${glad_summary_table}?sql=${
    QUERIES.alertsLatest
  }`;
  return request
    .get(url, 3600, 'gladRequestLatest')
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

export const fetchFormaLatest = () => {
  const url = `${REQUEST_URL}/forma250gfw/latest`;
  return request.get(url, 3600, 'formaRequest').catch(error => {
    console.error('Error in formaRequest:', error);
    return new Promise(resolve =>
      resolve({
        data: {
          data: {
            attributes: {
              latest: lastFriday
            },
            id: null,
            type: 'forma250gfw'
          }
        }
      })
    );
  });
};

export const fetchTerraiLatest = () => {
  const url = `${REQUEST_URL}/terrai-alerts/latest`;
  return request.get(url, 3600, 'terraRequest').catch(error => {
    console.error('Error in terraRequest:', error);
    return new Promise(resolve =>
      resolve({
        data: {
          data: [
            {
              attributes: { date: lastFriday },
              id: null,
              type: 'terrai-alerts'
            }
          ]
        }
      })
    );
  });
};

export const fetchSADLatest = () => {
  const url = `${REQUEST_URL}/v2/imazon-alerts/latest`;
  return request.get(url, 3600, 'sadRequest').catch(error => {
    console.error('Error in sadRequest:', error);
    return new Promise(resolve =>
      resolve({
        data: {
          data: [
            {
              attributes: { latest: `${lastFriday}T00:00:00Z` },
              id: undefined,
              type: 'imazon-latest'
            }
          ]
        }
      })
    );
  });
};

export const fetchGranChacoLatest = () => {
  const url = `${REQUEST_URL}/v2/guira-loss/latest`;
  return request.get(url, 3600, 'granChacoRequest').catch(error => {
    console.error('Error in granChacoRequest:', error);
    return new Promise(resolve =>
      resolve({
        data: {
          data: [
            {
              attributes: { latest: `${lastFriday}T00:00:00Z` },
              id: undefined,
              type: 'imazon-latest'
            }
          ]
        }
      })
    );
  });
};
