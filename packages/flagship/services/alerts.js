import { apiRequest } from 'utils/request';
import moment from 'moment';
import { fetchAnalysisEndpoint } from 'services/analysis';

const lastFriday = moment()
  .day(-2)
  .format('YYYY-MM-DD');

export const fetchFireAlertsByGeostore = params =>
  fetchAnalysisEndpoint({
    ...params,
    params,
    name: 'viirs-alerts',
    slug: 'viirs-active-fires',
    version: 'v1'
  });

export const fetchLatestDate = url =>
  apiRequest.get(url, 3600, 'gladRequest')
    .catch(() => {
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
