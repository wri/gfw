import { jest } from '@jest/globals';
import { apiRequest } from 'utils/request';
import { fetchAnalysisEndpoint, fetchUmdLossGain } from 'services/analysis';

jest.mock('utils/request', () => ({
  apiRequest: {
    get: jest.fn(),
  },
}));

jest.mock('axios', () => ({
  all: jest.fn((promises) => Promise.all(promises)),
  spread: (fn) => (results) => fn(...results),
}));

describe('analysis service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAnalysisEndpoint', () => {
    it('builds an admin URL with period and threshold parameters', () => {
      fetchAnalysisEndpoint({
        type: 'country',
        slug: 'umd-loss-gain',
        adm0: 'BRA',
        adm1: '1',
        adm2: '2',
        params: {
          startDate: '2020-01-01',
          endDate: '2020-12-31',
          threshold: '30',
        },
      });

      expect(apiRequest.get).toHaveBeenCalledTimes(1);
      const url = apiRequest.get.mock.calls[0][0];
      expect(url).toContain('/v1/umd-loss-gain/admin/BRA/1/2?');
      expect(url).toContain('period=2020-01-01%2C2020-12-31');
      expect(url).toContain('threshold=30');
    });
  });

  describe('fetchUmdLossGain', () => {
    it('combines multiple analysis responses into a single object keyed by type', async () => {
      const lossResponse = {
        data: {
          data: {
            type: 'LOSS',
            attributes: { value: 1 },
          },
        },
      };

      const gainResponse = {
        data: {
          data: {
            type: 'GAIN',
            attributes: { value: 2 },
          },
        },
      };

      apiRequest.get
        .mockResolvedValueOnce(lossResponse)
        .mockResolvedValueOnce(gainResponse);

      const result = await fetchUmdLossGain({
        endpoints: [
          { slug: 'loss', params: {} },
          { slug: 'gain', params: {} },
        ],
        type: 'country',
        adm0: 'BRA',
        adm1: null,
        adm2: null,
        token: null,
      });

      expect(result).toEqual({
        loss: { value: 1 },
        gain: { value: 2 },
      });
    });
  });
});
