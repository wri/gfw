import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getLossGrouped } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getLossGrouped', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls the data API and maps grouped loss data', async () => {
    dataRequest.get.mockResolvedValueOnce({
      data: [
        {
          adm1: 1,
          umd_tree_cover_loss__year: 2010,
          umd_tree_cover_loss__ha: 5,
          gfw_gross_emissions_co2e_all_gases__Mg: 9,
        },
      ],
      status: 'success',
    });

    const result = await getLossGrouped({
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
      adm1: 1,
      umd_tree_cover_loss__year: 2010,
      umd_tree_cover_loss__ha: 5,
      gfw_gross_emissions_co2e_all_gases__Mg: 9,
      year: 2010,
      area: 5,
      emissions: 9,
    });
  });
});
