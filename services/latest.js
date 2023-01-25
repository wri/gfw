import { dataRequest } from 'utils/request';
import { format, subDays } from 'date-fns';

const lastFriday = () => {
  const date = new Date();
  return format(subDays(date, 7), 'yyyy-MM-dd');
};

export const fetchLatestDate = (url) =>
  dataRequest.get(url).catch(() => {
    return new Promise((resolve) =>
      resolve({
        data: {
          data: [
            {
              attributes: { date: lastFriday() },
            },
          ],
        },
      })
    );
  });
