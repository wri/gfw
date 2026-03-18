import { jest } from '@jest/globals';
import request from 'utils/request';
import { getCumulative } from 'services/climate';

jest.mock('utils/request', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('climate service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCumulative', () => {
    it('maps cumulative response rows into decoded field names', async () => {
      const mockRow = {
        treecover_loss__ha: 1,
        cumulative_deforestation__ha: 2,
        alert__count: 3,
        cumulative_emissions__t_C02: 4,
      };

      request.get.mockResolvedValue({
        data: {
          data: [mockRow],
        },
      });

      const promises = getCumulative({ adm0: 'BRA', download: false });
      expect(promises).toHaveLength(4);

      const [first] = await Promise.all(promises);

      expect(first.data.data[0]).toMatchObject({
        loss: 1,
      });
    });
  });
});
