import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { fetchVIIRSLatest } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

const metadataResponse = (endDate) => ({
  data: {
    metadata: {
      content_date_range: {
        start_date: null,
        end_date: endDate,
      },
    },
  },
});

// The requests run concurrently, so route mocks by URL rather than call order.
const mockRequests = ({ raw, tables }) =>
  dataRequest.get.mockImplementation((url) =>
    url.includes('nasa_viirs_fire_alerts') ? raw() : tables()
  );

describe('fetchVIIRSLatest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the latest alert in the precomputed tables, even when the raw table lags', async () => {
    // The raw points table stalled on 08-17 while the precomputed tables the
    // dashboards query kept updating through 09-30 (PZB-1287).
    mockRequests({
      raw: () => Promise.resolve(metadataResponse('2026-08-17')),
      tables: () => Promise.resolve(metadataResponse('2026-09-30')),
    });

    const result = await fetchVIIRSLatest();

    expect(result.date).toBe('2026-09-30');
    expect(result.rawDate).toBe('2026-08-17');
  });

  it('reads the pinned version of the GADM daily alerts table', async () => {
    mockRequests({
      raw: () => Promise.resolve(metadataResponse('2026-08-17')),
      tables: () => Promise.resolve(metadataResponse('2026-09-30')),
    });

    await fetchVIIRSLatest();

    const tablesUrl = dataRequest.get.mock.calls
      .map(([url]) => url)
      .find((url) => !url.includes('nasa_viirs_fire_alerts'));
    expect(tablesUrl).toEqual(
      expect.stringContaining('gadm__viirs__adm2_daily_alerts/v20251202')
    );
  });

  it('falls back to the raw table date when the tables metadata request fails', async () => {
    mockRequests({
      raw: () => Promise.resolve(metadataResponse('2026-08-17')),
      tables: () => Promise.reject(new Error('request failed')),
    });

    const result = await fetchVIIRSLatest();

    expect(result.date).toBe('2026-08-17');
  });

  it('falls back to the raw table date when the tables metadata has no end date', async () => {
    mockRequests({
      raw: () => Promise.resolve(metadataResponse('2026-08-17')),
      tables: () => Promise.resolve({ data: { metadata: {} } }),
    });

    const result = await fetchVIIRSLatest();

    expect(result.date).toBe('2026-08-17');
  });
});
