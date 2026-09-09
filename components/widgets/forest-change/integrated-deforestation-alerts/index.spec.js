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

  // A window that lands entirely past the end of an alert system's data — carried
  // over from a fresher system, or dragged there on the time slider — is queried
  // as selected. Substituting the system's own default window instead reported
  // another period's count under the selected dates: every range after
  // 2026-07-25 showed the same 329,403 GLAD-L alerts for Brazil.
  describe('range past the end of the alert system data', () => {
    it('keeps an end date that runs past the GLAD dataset', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-07-20',
        endDate: '2026-08-29',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.startDate).toBe('2026-07-20');
      expect(callParams.endDate).toBe('2026-08-29');
    });

    it('keeps a window that starts past the dataset, empty as it is', async () => {
      await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-08-22',
        endDate: '2026-08-29',
      });

      const callParams = fetchIntegratedAlerts.mock.calls[0][0];
      expect(callParams.startDate).toBe('2026-08-22');
      expect(callParams.endDate).toBe('2026-08-29');
    });

    it('reports the selected range back to the widget settings', async () => {
      const data = await widgetConfig.getData({
        ...baseParams,
        deforestationAlertsDataset: 'glad_l',
        startDate: '2026-08-22',
        endDate: '2026-08-29',
      });

      expect(data.settings).toEqual({
        startDate: '2026-08-22',
        endDate: '2026-08-29',
      });
      // the datepicker still stops at the last day GLAD-L actually has
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
