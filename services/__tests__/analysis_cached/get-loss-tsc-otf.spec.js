import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getLossTscOTF } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getLossTscOTF', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const params = {
    geostore: { id: 'geo-1' },
    startYear: 2001,
    endYear: 2025,
    extentYear: 2000,
    threshold: 30,
  };

  it('queries the on-the-fly tree cover loss raster for the geostore', async () => {
    dataRequest.get.mockResolvedValueOnce({ data: [] });

    await getLossTscOTF(params);

    expect(dataRequest.get).toHaveBeenCalledTimes(1);
    const [url] = dataRequest.get.mock.calls[0];
    expect(url).toEqual(
      expect.stringContaining('/dataset/umd_tree_cover_loss/latest/query')
    );
    expect(url).toEqual(
      expect.stringContaining(
        'GROUP%20BY%20wri_google_tree_cover_loss_drivers__category'
      )
    );
    expect(url).toEqual(expect.stringContaining('geostore_id=geo-1'));
    expect(url).toEqual(
      expect.stringContaining(
        'umd_tree_cover_density_2000__threshold%20%3E=%2030'
      )
    );
    expect(url).toEqual(
      expect.stringContaining('umd_tree_cover_loss__year%20%3E=%202001')
    );
    expect(url).toEqual(
      expect.stringContaining('umd_tree_cover_loss__year%20%3C=%202025')
    );
  });

  it('maps driver categories to the labels used by the precomputed tables', async () => {
    dataRequest.get.mockResolvedValueOnce({
      data: [
        { wri_google_tree_cover_loss_drivers__category: 1, area__ha: 10 },
        { wri_google_tree_cover_loss_drivers__category: 2, area__ha: 20 },
        { wri_google_tree_cover_loss_drivers__category: 3, area__ha: 30 },
        { wri_google_tree_cover_loss_drivers__category: 4, area__ha: 40 },
        { wri_google_tree_cover_loss_drivers__category: 5, area__ha: 50 },
        { wri_google_tree_cover_loss_drivers__category: 6, area__ha: 60 },
        { wri_google_tree_cover_loss_drivers__category: 7, area__ha: 70 },
      ],
    });

    const { data } = await getLossTscOTF(params);

    expect(
      data.data.map(({ driver_type, umd_tree_cover_loss__ha }) => [
        driver_type,
        umd_tree_cover_loss__ha,
      ])
    ).toEqual([
      ['Permanent agriculture', 10],
      ['Hard commodities', 20],
      ['Shifting cultivation', 30],
      ['Logging', 40],
      ['Wildfire', 50],
      ['Settlements & Infrastructure', 60],
      ['Other natural disturbances', 70],
    ]);
  });

  it('leaves the driver undefined for categories it does not know', async () => {
    dataRequest.get.mockResolvedValueOnce({
      data: [{ wri_google_tree_cover_loss_drivers__category: 99, area__ha: 1 }],
    });

    const { data } = await getLossTscOTF(params);

    expect(data.data[0].driver_type).toBeUndefined();
  });

  it('falls back to adm0 when there is no geostore', async () => {
    dataRequest.get.mockResolvedValueOnce({ data: [] });

    await getLossTscOTF({ ...params, geostore: undefined, adm0: 'geo-adm' });

    expect(dataRequest.get.mock.calls[0][0]).toEqual(
      expect.stringContaining('geostore_id=geo-adm')
    );
  });
});
