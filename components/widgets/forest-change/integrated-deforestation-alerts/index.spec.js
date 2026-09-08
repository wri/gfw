import { jest } from '@jest/globals';
import { fetchIntegratedAlerts } from 'services/analysis-cached';
import widgetConfig from './index';

jest.mock('services/analysis-cached', () => ({
  fetchIntegratedAlerts: jest.fn(),
}));

// GLAD-L is served by the standalone GLAD tables, every other alert system by the
// integrated ones. The two pipelines run independently and can be days apart, so
// the widget must take its default date range from the matching dataset.
const GFW_META = {
  datasets: {
    GLAD: {
      updatedAt: '2026-07-25',
      defaultStartDate: '2026-07-18',
      defaultEndDate: '2026-07-25',
    },
    INTEGRATED: {
      updatedAt: '2026-08-29',
      defaultStartDate: '2026-08-22',
      defaultEndDate: '2026-08-29',
    },
  },
};

const baseParams = {
  type: 'country',
  adm0: 'BRA',
  GFW_META,
  distAlertOptions: 'vegetation',
  // force the precomputed-table path
  status: 'unsaved',
};

describe('integrated-deforestation-alerts widget', () => {
  beforeEach(() => {
    fetchIntegratedAlerts.mockResolvedValue({ data: { data: [] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('default date range per alert system', () => {
    it('uses the GLAD dataset dates when GLAD-L is selected', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
      });

      expect(fetchIntegratedAlerts).toHaveBeenCalledTimes(1);
      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.alertSystem).toBe('glad_l');
      expect(callParams.endDate).toBe('2026-07-25');
    });

    it('uses the integrated dataset dates when all alerts are selected', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'all',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.alertSystem).toBe('all');
      expect(callParams.endDate).toBe('2026-08-29');
      expect(callParams.startDate).toBe('2026-08-22');
    });

    it('uses the integrated dataset dates for RADD', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'radd',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.endDate).toBe('2026-08-29');
    });

    it('still honours an explicit date range chosen by the user', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.startDate).toBe('2026-03-01');
      expect(callParams.endDate).toBe('2026-03-31');
    });
  });

  // getData feeds the range it resolved back into the widget settings, so the
  // dates from the previously selected alert system arrive as `params` on the
  // next call. Switching to a system whose data stops earlier would otherwise
  // keep querying a window that system has no alerts for, and report zero.
  describe('range carried over from another alert system', () => {
    it('clamps an end date that runs past the GLAD dataset', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-07-20',
        endDate: '2026-08-29',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.startDate).toBe('2026-07-20');
      expect(callParams.endDate).toBe('2026-07-25');
    });

    it('falls back to the default range when it starts past the dataset', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-08-22',
        endDate: '2026-08-29',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.startDate).toBe('2026-07-18');
      expect(callParams.endDate).toBe('2026-07-25');
    });

    it('reports the clamped range back to the widget settings', async () => {
      const data = await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-08-22',
        endDate: '2026-08-29',
      });

      expect(data.settings).toEqual({
        startDate: '2026-07-18',
        endDate: '2026-07-25',
      });
      expect(data.options.maxDate).toBe('2026-07-25');
    });

    it('leaves a range within the integrated dataset untouched', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'all',
        startDate: '2026-07-18',
        endDate: '2026-07-25',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.startDate).toBe('2026-07-18');
      expect(callParams.endDate).toBe('2026-07-25');
    });
  });
});
