import { jest } from '@jest/globals';
import {
  fetchVIIRSAlertsSum,
  fetchVIIRSAlertsSumOTF,
} from 'services/analysis-cached';
import widgetConfig from './index';

jest.mock('services/analysis-cached', () => ({
  fetchVIIRSAlertsSum: jest.fn(),
  fetchVIIRSAlertsSumOTF: jest.fn(),
}));

// The precomputed tables and the raw points table are fed separately and can be
// weeks apart (PZB-1287), so each path defaults to the range its own source has.
const GFW_META = {
  datasets: {
    VIIRS: {
      defaultStartDate: '2026-09-23',
      defaultEndDate: '2026-09-30',
      rawEndDate: '2026-08-17',
    },
  },
};

const baseParams = { GFW_META, geostore: { id: 'abc' } };

describe('fire-alerts-simple widget', () => {
  beforeEach(() => {
    fetchVIIRSAlertsSum.mockResolvedValue({ data: { data: [] } });
    fetchVIIRSAlertsSumOTF.mockResolvedValue({ data: { data: [] } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('defaults precomputed areas to the precomputed tables range', async () => {
    await widgetConfig.getData({ ...baseParams, type: 'country', adm0: 'IDN' });

    const callParams = fetchVIIRSAlertsSum.mock.calls[0][0];
    expect(callParams.startDate).toBe('2026-09-23');
    expect(callParams.endDate).toBe('2026-09-30');
  });

  it('defaults on-the-fly areas to the raw table range', async () => {
    await widgetConfig.getData({ ...baseParams, type: 'geostore' });

    const callParams = fetchVIIRSAlertsSumOTF.mock.calls[0][0];
    expect(callParams.startDate).toBe('2026-08-10');
    expect(callParams.endDate).toBe('2026-08-17');
  });
});
