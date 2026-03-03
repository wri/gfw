import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getTreeLossOTF } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getTreeLossOTF', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches tree loss and extent and maps the response', async () => {
    dataRequest.get
      .mockResolvedValueOnce({
        data: [
          {
            umd_tree_cover_loss__year: 2010,
            area__ha: 12,
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            area__ha: 100,
          },
        ],
      });

    const result = await getTreeLossOTF({
      geostore: { id: 'geo-1' },
      startYear: 2001,
      endYear: 2010,
      extentYear: 2000,
      threshold: 30,
    });

    expect(dataRequest.get).toHaveBeenCalledTimes(2);
    const [firstUrl, secondUrl] = dataRequest.get.mock.calls.map((c) => c[0]);
    expect(firstUrl).toEqual(expect.stringContaining('umd_tree_cover_loss'));
    expect(secondUrl).toEqual(
      expect.stringContaining('umd_tree_cover_density_2000')
    );

    expect(result).toEqual({
      loss: [
        {
          umd_tree_cover_loss__year: 2010,
          area__ha: 12,
          area: 12,
          year: 2010,
        },
      ],
      extent: 100,
    });
  });
});
