import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getLoss } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getLoss', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the data API and maps loss data with area, emissions, year and bound1', async () => {
    dataRequest.get.mockResolvedValueOnce({
      data: [
        {
          umd_tree_cover_loss__year: 2020,
          umd_tree_cover_loss__ha: 10,
          gfw_gross_emissions_co2e_all_gases__Mg: 20,
          wri_google_tree_cover_loss_drivers__driver: 'Agriculture',
        },
      ],
      status: 'success',
    });

    const result = await getLoss({
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
      umd_tree_cover_loss__year: 2020,
      umd_tree_cover_loss__ha: 10,
      gfw_gross_emissions_co2e_all_gases__Mg: 20,
      bound1: 'Agriculture',
      year: 2020,
      area: 10,
      emissions: 20,
    });
  });
});
