import axios from 'axios';
import moment from 'moment';
import { getIndicator } from 'utils/strings';

// // ISO
// const GLAD_ADM0_SUMMARY = 'ec9a2221-830d-40ff-ae65-358726c4fa29';
// const GLAD_ADM0_WEEKLY = '3170421d-ee32-4f9d-b4b0-a76bac33cd26';

// // Adm1
// const GLAD_ADM1_SUMMARY = '674573eb-249c-4f65-aefa-65e4f58aad6f';
// const GLAD_ADM1_WEEKLY = '181a6e5d-7548-4471-a74c-fbab4456239a';

// // Adm2
// const GLAD_ADM2_SUMMARY = 'd9dc9bc5-36ce-4c64-819a-c778eed33526';
// const GLAD_ADM2_DAILY = 'c78b4379-8030-4940-bd04-b07baee47146';
// const GLAD_ADM2_WEEKLY = '79683341-dc3d-4d80-8a47-b82153943da2';

const QUERIES = {
  gladIntersectionAlerts:
    "SELECT iso, adm1, adm2, week, year, alerts as count, area_ha, polyname FROM data WHERE {location} AND polyname = '{polyname}'",
  alertsLatest:
    'SELECT year, week FROM data GROUP BY year, week ORDER BY year DESC, week DESC LIMIT 1'
};

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
