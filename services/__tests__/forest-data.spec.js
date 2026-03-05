import { jest } from '@jest/globals';
import { dataRequest, cartoRequest } from 'utils/request';
import { getFAOExtent, getFAOEcoLive } from 'services/forest-data';

jest.mock('utils/request', () => ({
  dataRequest: {
    get: jest.fn(),
  },
  cartoRequest: {
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

  describe('getFAOEcoLive', () => {
    it('maps economic and livelihood rows to expected field names', async () => {
      cartoRequest.get.mockResolvedValueOnce({
        data: {
          rows: [
            {
              iso: 'BRA',
              revenue__usd: 10,
              expenditure__usd: 20,
              gdp_2012__usd: 30,
              total_forest_employees: 40,
              female_forest_employees: 50,
            },
          ],
        },
      });

      const result = await getFAOEcoLive({});

      expect(cartoRequest.get).toHaveBeenCalledTimes(1);
      expect(cartoRequest.get).toHaveBeenCalledWith(
        expect.stringContaining('/sql?q=')
      );

      expect(result.data.rows[0]).toMatchObject({
        country: 'BRA',
        usdrev: 10,
        usdexp: 20,
        gdpusd2012: 30,
        forempl: 40,
        femempl: 50,
      });
    });
  });
});
