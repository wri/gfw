import { jest } from '@jest/globals';
import getGfwMeta, { handleGfwParamsMeta } from '../gfw-meta';

jest.mock('services/analysis-cached', () => ({
  fetchGLADLatest: jest.fn(),
  fetchIntegratedLatest: jest.fn(),
  fetchVIIRSLatest: jest.fn(),
}));

const { fetchGLADLatest, fetchIntegratedLatest, fetchVIIRSLatest } =
  jest.requireMock('services/analysis-cached');

describe('utils/gfw-meta', () => {
  beforeEach(() => {
    fetchGLADLatest.mockResolvedValue({
      attributes: {
        updatedAt: '2024-01-08',
      },
    });
    fetchIntegratedLatest.mockResolvedValue({
      attributes: {
        updatedAt: '2024-01-15',
      },
    });
    fetchVIIRSLatest.mockResolvedValue({
      date: '2024-01-20',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('builds default date ranges for GLAD, INTEGRATED and VIIRS datasets', async () => {
    const meta = await getGfwMeta();

    expect(meta.datasets.GLAD.defaultEndDate).toBe('2024-01-08');
    expect(meta.datasets.GLAD.defaultStartDate).toBe('2024-01-01');

    expect(meta.datasets.INTEGRATED.defaultEndDate).toBe('2024-01-15');
    expect(meta.datasets.INTEGRATED.defaultStartDate).toBe('2024-01-08');

    expect(meta.datasets.VIIRS.defaultEndDate).toBe('2024-01-20');
    expect(meta.datasets.VIIRS.defaultStartDate).toBe('2024-01-13');
  });

  it('returns existing meta datasets from params when present', async () => {
    const existing = {
      GLAD: { updatedAt: 'existing' },
    };

    const result = await handleGfwParamsMeta({
      GFW_META: { datasets: existing },
    });

    expect(result).toBe(existing);
  });

  it('fetches new meta when datasets are missing or empty', async () => {
    const result = await handleGfwParamsMeta({});

    expect(result.GLAD).toBeDefined();
    expect(result.INTEGRATED).toBeDefined();
    expect(result.VIIRS).toBeDefined();
  });
});
