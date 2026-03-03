import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getLossFires } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getLossFires', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns a download descriptor when download is true', () => {
    const result = getLossFires({
      type: 'country',
      adm0: 'BRA',
      threshold: 30,
      startYear: 2001,
      endYear: 2020,
      extentYear: 2000,
      download: true,
    });

    expect(result).toBeDefined();
    expect(result.name).toEqual(
      expect.stringContaining('treecover_loss_from_fires_by_region')
    );
    expect(result.url).toEqual(expect.stringContaining('download/csv'));
  });

  it('calls the data API and maps loss from fires data', async () => {
    dataRequest.get.mockResolvedValueOnce({
      data: [
        {
          umd_tree_cover_loss__year: 2012,
          umd_tree_cover_loss__ha: 3,
          umd_tree_cover_loss_from_fires__ha: 1,
        },
      ],
    });

    const result = await getLossFires({
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

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data.data)).toBe(true);
    expect(result.data.data[0]).toMatchObject({
      umd_tree_cover_loss__year: 2012,
      umd_tree_cover_loss__ha: 3,
      umd_tree_cover_loss_from_fires__ha: 1,
      year: 2012,
      areaLoss: 3,
      areaLossFires: 1,
    });
  });
});
