import { jest } from '@jest/globals';
import { dataRequest } from 'utils/request';
import { getFAOExtent } from 'services/forest-data';

jest.mock('utils/request', () => ({
  dataRequest: {
    get: jest.fn(),
  },
}));

describe('forest-data service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFAOExtent', () => {
    it('maps FAO extent response into widget rows with renamed keys', async () => {
      dataRequest.get.mockResolvedValueOnce({
        data: [
          {
            iso: 'BRA',
            country: 'Brazil',
            planted_forest__ha: 1,
            primary_forest__ha: 2,
            regenerated_forest__ha: 3,
            fao_treecover__ha: 4,
            area_ha: 5,
          },
        ],
      });

      const result = await getFAOExtent({ adm0: 'BRA', faoYear: 2020 });

      expect(dataRequest.get).toHaveBeenCalledTimes(1);
      expect(dataRequest.get).toHaveBeenCalledWith(
        expect.stringContaining('/dataset/fao_forest_extent')
      );

      expect(result).toEqual({
        data: {
          rows: [
            {
              iso: 'BRA',
              country: 'Brazil',
              planted_forest: 1,
              forest_primary: 2,
              forest_regenerated: 3,
              extent: 4,
              area_ha: 5,
            },
          ],
        },
      });
    });
  });
});
