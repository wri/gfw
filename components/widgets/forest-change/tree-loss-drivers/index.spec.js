import { jest } from '@jest/globals';
import { getLoss, getLossTscOTF } from 'services/analysis-cached';
import widgetConfig from './index';

jest.mock('services/analysis-cached', () => ({
  getLoss: jest.fn(),
  getLossTscOTF: jest.fn(),
}));

describe('tree-loss-drivers widget', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    describe('when shouldQueryPrecomputedTables is true (precomputed path)', () => {
      it('queries the precomputed tables and groups by driver', async () => {
        getLoss.mockResolvedValue({
          data: {
            data: [
              {
                wri_google_tree_cover_loss_drivers__driver:
                  'Permanent agriculture',
                umd_tree_cover_loss__ha: 10,
              },
              {
                wri_google_tree_cover_loss_drivers__driver:
                  'Permanent agriculture',
                umd_tree_cover_loss__ha: 5,
              },
              {
                wri_google_tree_cover_loss_drivers__driver: 'Unknown',
                umd_tree_cover_loss__ha: 3,
              },
            ],
          },
        });

        const params = { type: 'wdpa', wdpaid: '2017', threshold: 30 };

        const result = await widgetConfig.getData(params);

        expect(getLoss).toHaveBeenCalledWith({
          ...params,
          landCategory: 'tsc',
          lossTsc: true,
        });
        expect(getLossTscOTF).not.toHaveBeenCalled();
        expect(result).toEqual([
          { driver_type: 'Permanent agriculture', loss_area_ha: 15 },
        ]);
      });
    });

    describe('when shouldQueryPrecomputedTables is false (OTF path)', () => {
      it('queries on the fly for a geostore that has no precomputed row', async () => {
        getLossTscOTF.mockResolvedValue({
          data: {
            data: [
              {
                driver_type: 'Permanent agriculture',
                umd_tree_cover_loss__ha: 127704,
              },
              { driver_type: 'Wildfire', umd_tree_cover_loss__ha: 704 },
            ],
          },
        });

        const params = {
          type: 'geostore',
          geostore: { id: '8983e9e3b5b0c0264870add75a8e5933' },
          threshold: 30,
          startYear: 2001,
          endYear: 2025,
          extentYear: 2000,
        };

        const result = await widgetConfig.getData(params);

        expect(getLossTscOTF).toHaveBeenCalledWith(params);
        expect(getLoss).not.toHaveBeenCalled();
        expect(result).toEqual([
          { driver_type: 'Permanent agriculture', loss_area_ha: 127704 },
          { driver_type: 'Wildfire', loss_area_ha: 704 },
        ]);
      });

      it('still uses the precomputed tables for a saved area', async () => {
        getLoss.mockResolvedValue({ data: { data: [] } });

        await widgetConfig.getData({
          type: 'geostore',
          status: 'saved',
          geostore: { id: 'geo-1' },
          threshold: 30,
        });

        expect(getLoss).toHaveBeenCalledTimes(1);
        expect(getLossTscOTF).not.toHaveBeenCalled();
      });
    });
  });
});
