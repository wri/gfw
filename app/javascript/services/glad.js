import axios from 'axios';
import moment from 'moment';
import { getWHEREQuery } from 'services/analysis-cached';
import DATASETS from 'data/analysis-datasets.json';

const { GLAD_ADM0_WEEKLY, GLAD_ADM1_WEEKLY, GLAD_ADM2_WEEKLY } = DATASETS[
  process.env.FEATURE_ENV
];

const QUERIES = {
  gladIntersectionAlerts:
    'SELECT {location}, alert__year, alert__week, SUM(alert__count) AS alert__count, SUM(alert_area__ha) AS alert_area__ha FROM data {WHERE} GROUP BY {location}, alert__year, alert__week ORDER BY alert__year DESC, alert__week DESC',
  alertsLatest:
    'SELECT alert__year, alert__week FROM data GROUP BY alert__year, alert__week ORDER BY alert__year DESC, alert__week DESC LIMIT 1'
};

const getLocationSelect = ({ adm1, adm2 }) =>
  `iso${adm1 ? ', adm1' : ''}${adm2 ? ', adm2' : ''}`;

const getLocationSelectGrouped = ({ adm0, adm1 }) =>
  `iso${adm0 ? ', adm1' : ''}${adm1 ? ', adm2' : ''}`;

// quyery building helpers
const getAlertsDatasetId = (adm0, adm1, adm2, grouped) => {
  if (adm2 || (adm1 && grouped)) return GLAD_ADM2_WEEKLY;
  if (adm1 || (adm0 && grouped)) return GLAD_ADM1_WEEKLY;
  return GLAD_ADM0_WEEKLY;
};

const getRequestUrl = ({ adm0, adm1, adm2, grouped }) => {
  const dataset = getAlertsDatasetId(adm0, adm1, adm2, grouped);
  const REQUEST_URL = `${process.env.GFW_API}/query/{dataset}?sql=`;
  return REQUEST_URL.replace('{dataset}', dataset);
};

export const fetchGladAlerts = ({
  threshold,
  adm0,
  adm1,
  adm2,
  tsc,
  grouped,
  ...params
}) => {
  const { gladIntersectionAlerts } = QUERIES;
  const url = `${getRequestUrl({
    adm0,
    adm1,
    adm2,
    grouped,
    ...params
  })}${gladIntersectionAlerts}`
    .replace(
      /{location}/g,
      grouped
        ? getLocationSelectGrouped({ adm0, adm1, adm2 })
        : getLocationSelect({ adm1, adm2 })
    )
    .replace(
      '{WHERE}',
      getWHEREQuery({ iso: adm0, adm1, adm2, ...params, glad: true })
    );
  return axios.get(url).then(response => ({
    data: {
      data: response.data.data.map(d => ({
        ...d,
        week: parseInt(d.alert__week, 10),
        year: parseInt(d.alert__year, 10),
        count: d.alert__count,
        alerts: d.alert__count,
        area_ha: d.alert_area__ha
      }))
    }
  }));
};

// Latest Dates for Alerts
const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchGLADLatest = ({ adm0, adm1, adm2 }) => {
  const url = `${getRequestUrl(adm0, adm1, adm2)}${QUERIES.alertsLatest}`;
  return axios
    .get(url)
    .then(response => {
      const { alert__week, alert__year } = response.data.data[0];
      const date = moment()
        .year(parseInt(alert__year, 10))
        .week(parseInt(alert__week, 10))
        .day('Monday')
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
