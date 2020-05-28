import { apiRequest } from 'utils/request';
import moment from 'moment';
import { fetchAnalysisEndpoint } from 'services/analysis';

const QUERIES = {
  viirsAlerts: '{location}?group=true&period={period}&thresh=0'
};

const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

const getLocation = (adm0, adm1, adm2) =>
  `iso = '${adm0}'${adm1 ? ` AND adm1 = ${adm1}` : ''}${
    adm2 ? ` AND adm2 = ${adm2}` : ''
  }`;

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
