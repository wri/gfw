import request from 'utils/request';
import moment from 'moment';

const REQUEST_URL = process.env.GFW_API;
const GLAD_ISO_DATASET = process.env.GLAD_ISO_DATASET;
const GLAD_ADM1_DATASET = process.env.GLAD_ADM1_DATASET;
const GLAD_ADM2_DATASET = process.env.GLAD_ADM2_DATASET;
const FIRES_ISO_DATASET = process.env.FIRES_ISO_DATASET;
const FIRES_ADM1_DATASET = process.env.FIRES_ADM1_DATASET;
const FIRES_ADM2_DATASET = process.env.FIRES_ADM2_DATASET;

const QUERIES = {
  firesIntersectionAlerts:
    "SELECT iso, adm1, adm2, week as alert__week, year as alert__year, alerts as alert__count, polyname FROM data WHERE {location} AND polyname = '{polyname}' AND fire_type = '{dataset}'",
  alertsLatest:
    'SELECT year, week FROM data GROUP BY year, week ORDER BY year DESC, week DESC LIMIT 1'
};

const getLocation = (adm0, adm1, adm2) =>
  `iso = '${adm0}'${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

export const fetchGladAlerts = ({ adm0, adm1, adm2, grouped }) => {
  let glad_summary_table = GLAD_ISO_DATASET;
  if ((adm0 && grouped) || adm1) {
    glad_summary_table = GLAD_ADM1_DATASET;
  }
  if ((adm1 && grouped) || adm2) {
    glad_summary_table = GLAD_ADM2_DATASET;
  }
  const url = `${REQUEST_URL}/query/${glad_summary_table}?sql=${
    QUERIES.gladIntersectionAlerts
  }`
    .replace('{location}', getLocation(adm0, adm1, adm2))
    .replace('{polyname}', 'admin');
  return request.get(url, 3600, 'gladRequest');
};

export const fetchFiresAlerts = ({ adm0, adm1, adm2, dataset, download }) => {
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

  if (download) {
    return {
      name: 'viirs_fire_alerts__count',
      url: url.replace('query', 'download')
    };
  }

  return request.get(url).then(response => ({
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
  const url = `${REQUEST_URL}/query/${fires_summary_table}?sql=${
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

  return request.get(url).then(response => ({
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

// Latest Dates for Alerts
const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchGLADLatest = () => {
  const url = `${process.env.GFW_API}/glad-alerts/latest`;
  return request
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
