import moment from 'moment';
import { dateRange } from '../date-range';

describe('utils/date-range', () => {
  it('updates the start of the range when selecting a new start date', () => {
    const config = {
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      trimEndDate: '2024-01-10',
      startDateAbsolute: '2024-01-01',
      endDateAbsolute: '2024-01-10',
      rangeInterval: 'days',
      maxRange: null,
      minDate: '2024-01-01',
      maxDate: '2024-12-31',
    };

    const result = dateRange(config, moment('2024-01-05'), 0, false);

    expect(result).toEqual(['2024-01-05', '2024-01-10', '2024-01-10']);
  });
});
