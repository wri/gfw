import { jest } from '@jest/globals';
import { dataRequest } from 'utils/request';
import { resolveAlertDates } from 'providers/latest-provider/actions';

jest.mock('utils/request', () => ({
  dataRequest: { get: jest.fn() },
}));

describe('resolveAlertDates', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // The map time slider ends on latestDates[layerId]; taking that from the
  // dataset's publication date offered days with no alerts on them.
  it('ends an alert layer on its last day of data, not on the build date', async () => {
    dataRequest.get.mockResolvedValueOnce({ data: [{ max: '2026-07-25' }] });

    const dates = await resolveAlertDates({ gladLOnly: '2026-09-08' }, [
      {
        id: 'gladLOnly',
        latestUrl: 'dataset/umd_glad_landsat_alerts/latest',
      },
    ]);

    expect(dates).toEqual({ gladLOnly: '2026-07-25' });
  });

  it('leaves layers that are not alert datasets untouched', async () => {
    const dates = await resolveAlertDates({ 'tree-cover-loss': '2026-09-08' }, [
      {
        id: 'tree-cover-loss',
        latestUrl: 'dataset/umd_tree_cover_loss/latest',
      },
    ]);

    expect(dates).toEqual({ 'tree-cover-loss': '2026-09-08' });
    expect(dataRequest.get).not.toHaveBeenCalled();
  });
});
