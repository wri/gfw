import { jest } from '@jest/globals';
import moment from 'moment';
import { dataRequest } from '../../../utils/request';
import { fetchGLADLatest } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

const metadataResponse = (endDate) => ({
  data: {
    metadata: {
      content_date_range: {
        start_date: '2020-01-01',
        end_date: endDate,
      },
    },
  },
});

const maxDateResponse = (maxDate) => ({
  data: [{ max: maxDate }],
});

describe('fetchGLADLatest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the date of the most recent alert, not the dataset publication date', async () => {
    // The dataset is republished daily, so content_date_range.end_date tracks
    // the build date rather than the latest alert actually present in the data.
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-30'))
      .mockResolvedValueOnce(maxDateResponse('2026-07-25'));

    const result = await fetchGLADLatest();

    expect(result.attributes.updatedAt).toBe('2026-07-25');
  });

  it('queries the GADM daily alerts table for the latest alert date', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-30'))
      .mockResolvedValueOnce(maxDateResponse('2026-07-25'));

    await fetchGLADLatest();

    expect(dataRequest.get).toHaveBeenCalledTimes(2);
    const queryUrl = dataRequest.get.mock.calls[1][0];
    expect(queryUrl).toEqual(
      expect.stringContaining('gadm__glad__iso_daily_alerts')
    );
    expect(queryUrl).toEqual(
      expect.stringContaining('umd_glad_landsat_alerts__date')
    );
  });

  it('never returns a date beyond the published content date range', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-07-25'))
      .mockResolvedValueOnce(maxDateResponse('2026-08-30'));

    const result = await fetchGLADLatest();

    expect(result.attributes.updatedAt).toBe('2026-07-25');
  });

  it('falls back to the publication date when the latest alert query fails', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-30'))
      .mockRejectedValueOnce(new Error('query failed'));

    const result = await fetchGLADLatest();

    expect(result.attributes.updatedAt).toBe('2026-08-30');
  });

  it('falls back to the publication date when the query returns no rows', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-30'))
      .mockResolvedValueOnce({ data: [] });

    const result = await fetchGLADLatest();

    expect(result.attributes.updatedAt).toBe('2026-08-30');
  });

  it('falls back to last friday when the metadata request fails', async () => {
    dataRequest.get.mockRejectedValueOnce(new Error('metadata failed'));

    const result = await fetchGLADLatest();

    expect(result.attributes.updatedAt).toBe(
      moment().day(-2).format('YYYY-MM-DD')
    );
  });
});
