import { jest } from '@jest/globals';
import moment from 'moment';
import { dataRequest } from '../../../utils/request';
import { fetchIntegratedLatest } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

const metadataResponse = (endDate) => ({
  data: {
    metadata: {
      last_update: endDate,
      content_date_range: {
        start_date: '2019-01-01',
        end_date: endDate,
      },
    },
  },
});

const maxDateResponse = (maxDate) => ({
  data: [{ max: maxDate }],
});

describe('fetchIntegratedLatest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reads the dataset metadata from the response payload', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-31'))
      .mockResolvedValueOnce(maxDateResponse('2026-08-31'));

    const result = await fetchIntegratedLatest();

    expect(result.attributes.updatedAt).toBe('2026-08-31');
    expect(result.attributes.updatedAt).not.toBe(
      moment().day(-2).format('YYYY-MM-DD')
    );
  });

  it('returns the date of the most recent alert, not the publication date', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-31'))
      .mockResolvedValueOnce(maxDateResponse('2026-08-29'));

    const result = await fetchIntegratedLatest();

    expect(result.attributes.updatedAt).toBe('2026-08-29');
  });

  it('queries the integrated GADM daily alerts table', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-31'))
      .mockResolvedValueOnce(maxDateResponse('2026-08-29'));

    await fetchIntegratedLatest();

    const queryUrl = dataRequest.get.mock.calls[1][0];
    expect(queryUrl).toEqual(
      expect.stringContaining('gadm__integrated_alerts__iso_daily_alerts')
    );
    expect(queryUrl).toEqual(
      expect.stringContaining('gfw_integrated_alerts__date')
    );
  });

  it('falls back to the publication date when the latest alert query fails', async () => {
    dataRequest.get
      .mockResolvedValueOnce(metadataResponse('2026-08-31'))
      .mockRejectedValueOnce(new Error('query failed'));

    const result = await fetchIntegratedLatest();

    expect(result.attributes.updatedAt).toBe('2026-08-31');
  });

  it('falls back to last friday when the metadata request fails', async () => {
    dataRequest.get.mockRejectedValueOnce(new Error('metadata failed'));

    const result = await fetchIntegratedLatest();

    expect(result.attributes.updatedAt).toBe(
      moment().day(-2).format('YYYY-MM-DD')
    );
  });
});
