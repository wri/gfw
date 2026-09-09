import { jest } from '@jest/globals';
import { dataRequest } from 'utils/request';
import {
  alertDatasetFromUrl,
  resolveLatestAlertDate,
} from 'services/latest-alert-date';

jest.mock('utils/request', () => ({
  dataRequest: { get: jest.fn() },
}));

const maxDateResponse = (max) => ({ data: [{ max }] });

describe('alertDatasetFromUrl', () => {
  it('reads the dataset out of a layer latest url', () => {
    expect(alertDatasetFromUrl('dataset/umd_glad_landsat_alerts/latest')).toBe(
      'umd_glad_landsat_alerts'
    );
  });

  it('returns undefined when there is no url', () => {
    expect(alertDatasetFromUrl(undefined)).toBeUndefined();
  });
});

describe('resolveLatestAlertDate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('replaces the publication date with the last alert in the data', async () => {
    dataRequest.get.mockResolvedValueOnce(maxDateResponse('2026-07-25'));

    const date = await resolveLatestAlertDate(
      'umd_glad_landsat_alerts',
      '2026-09-08'
    );

    expect(date).toBe('2026-07-25');
    expect(dataRequest.get.mock.calls[0][0]).toEqual(
      expect.stringContaining('gadm__glad__iso_daily_alerts')
    );
  });

  it('reads RADD from its own column of the integrated table', async () => {
    dataRequest.get.mockResolvedValueOnce(maxDateResponse('2026-09-02'));

    const date = await resolveLatestAlertDate('wur_radd_alerts', '2026-09-08');

    expect(date).toBe('2026-09-02');
    const queryUrl = dataRequest.get.mock.calls[0][0];
    expect(queryUrl).toEqual(
      expect.stringContaining('gadm__integrated_alerts__iso_daily_alerts')
    );
    expect(queryUrl).toEqual(expect.stringContaining('wur_radd_alerts__date'));
  });

  it('never moves the date past what the dataset published', async () => {
    // the precomputed table is derived from the raster, so it cannot lead it
    dataRequest.get.mockResolvedValueOnce(maxDateResponse('2026-09-10'));

    const date = await resolveLatestAlertDate(
      'gfw_integrated_alerts',
      '2026-09-06'
    );

    expect(date).toBe('2026-09-06');
  });

  it('keeps the published date when the query fails', async () => {
    dataRequest.get.mockRejectedValueOnce(new Error('502'));

    const date = await resolveLatestAlertDate(
      'umd_glad_landsat_alerts',
      '2026-09-08'
    );

    expect(date).toBe('2026-09-08');
  });

  it('leaves datasets with no alert table alone, without a request', async () => {
    const date = await resolveLatestAlertDate('tree-cover-loss', '2026-09-08');

    expect(date).toBe('2026-09-08');
    expect(dataRequest.get).not.toHaveBeenCalled();
  });
});
