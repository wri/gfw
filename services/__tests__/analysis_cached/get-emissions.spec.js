import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getEmissions } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getEmissions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the data API and maps emissions data fields', async () => {
    dataRequest.get.mockResolvedValueOnce({
      data: [
        {
          umd_tree_cover_loss__year: 2015,
          gfw_gross_emissions_co2e_all_gases__Mg: 100,
          gfw_gross_emissions_co2e_co2_only__Mg: 60,
          gfw_gross_emissions_co2e_non_co2__Mg: 40,
          wri_google_tree_cover_loss_drivers__driver: 'Forestry',
        },
      ],
      status: 'success',
    });

    const result = await getEmissions({
      type: 'country',
      adm0: 'BRA',
      threshold: 30,
      startYear: 2001,
      endYear: 2020,
      extentYear: 2000,
    });

    expect(dataRequest.get).toHaveBeenCalledTimes(1);
    const calledUrl = dataRequest.get.mock.calls[0][0];
    expect(calledUrl).toEqual(expect.stringContaining('/dataset/'));
    expect(calledUrl).toEqual(expect.stringContaining('query?sql='));

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data.data)).toBe(true);
    expect(result.data.data[0]).toMatchObject({
      umd_tree_cover_loss__year: 2015,
      gfw_gross_emissions_co2e_all_gases__Mg: 100,
      gfw_gross_emissions_co2e_co2_only__Mg: 60,
      gfw_gross_emissions_co2e_non_co2__Mg: 40,
      bound1: 'Forestry',
      year: 2015,
      allGases: 100,
      co2Only: 60,
      nonCo2Gases: 40,
    });
  });
});
