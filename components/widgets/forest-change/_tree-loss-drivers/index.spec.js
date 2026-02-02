import { jest } from '@jest/globals';
import { fetchDataMart } from 'services/datamart';
import widgetConfig from './index';
import { shouldQueryPrecomputedTables } from '../../utils/helpers';

jest.mock('services/datamart', () => ({
  fetchDataMart: jest.fn(),
}));

jest.mock('../../utils/helpers', () => ({
  shouldQueryPrecomputedTables: jest.fn(),
}));

const DATASET = 'tree_cover_loss_by_driver';

describe('tree-loss-drivers widget', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    describe('type mapping', () => {
      beforeEach(() => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        fetchDataMart.mockResolvedValue({
          data: {
            status: 'ok',
            result: {
              tree_cover_loss_by_driver: [
                { drivers_type: 'A', loss_area_ha: 10 },
              ],
            },
          },
        });
      });

      it('calls fetchDataMart with type protected_area when type is wdpa', async () => {
        await widgetConfig.getData({
          type: 'wdpa',
          adm0: '1',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            type: 'protected_area',
            adm0: '1',
            threshold: 30,
            isDownload: false,
          })
        );
      });

      it('calls fetchDataMart with type global when type is global', async () => {
        await widgetConfig.getData({
          type: 'global',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            type: 'global',
            threshold: 30,
            isDownload: false,
          })
        );
      });

      it('calls fetchDataMart with type admin when type is admin and adm0 is set', async () => {
        await widgetConfig.getData({
          type: 'admin',
          adm0: 'BRA',
          adm1: '25',
          adm2: '123',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            type: 'admin',
            adm0: 'BRA',
            adm1: '25',
            adm2: '123',
            threshold: 30,
            isDownload: false,
          })
        );
      });

      it('calls fetchDataMart with type geostore and geostoreId when type is geostore', async () => {
        const geostoreId = 'abc123';
        await widgetConfig.getData({
          type: 'geostore',
          geostore: { id: geostoreId },
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            geostoreId,
            type: 'geostore',
            threshold: 30,
            isDownload: false,
          })
        );
      });

      it('calls fetchDataMart with type geostore and geostoreId from params when type is omitted (default)', async () => {
        const geostoreId = 'xyz789';
        await widgetConfig.getData({
          geostore: { id: geostoreId },
          adm0: 'BRA',
          adm1: '25',
          adm2: '456',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith({
          dataset: DATASET,
          geostoreId,
          type: 'geostore',
          adm0: 'BRA',
          adm1: '25',
          adm2: '456',
          threshold: 30,
          isDownload: false,
        });
      });
    });

    describe('precomputed tables (check branch)', () => {
      beforeEach(() => {
        fetchDataMart.mockResolvedValue({
          data: {
            status: 'ok',
            result: {
              tree_cover_loss_by_driver: [
                { drivers_type: 'X', loss_area_ha: 1 },
              ],
            },
          },
        });
      });

      it('calls fetchDataMart with type admin when shouldQueryPrecomputedTables is true and locationType is not aoi or geostore', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        await widgetConfig.getData({
          type: 'geostore',
          geostore: { id: 'geo1' },
          adm0: 'BRA',
          locationType: 'country',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'admin',
            adm0: 'BRA',
            isDownload: false,
          })
        );
      });

      it('keeps type geostore and sets geostoreId to adm0 when shouldQueryPrecomputedTables is true and locationType is aoi', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        await widgetConfig.getData({
          type: 'geostore',
          geostore: { id: 'geo1' },
          adm0: 'BRA',
          locationType: 'aoi',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'geostore',
            geostoreId: 'BRA',
            adm0: 'BRA',
            isDownload: false,
          })
        );
      });

      it('keeps type geostore and sets geostoreId to adm0 when shouldQueryPrecomputedTables is true and locationType is geostore', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        await widgetConfig.getData({
          type: 'geostore',
          geostore: { id: 'geo1' },
          adm0: 'IDN',
          locationType: 'geostore',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'geostore',
            geostoreId: 'IDN',
            adm0: 'IDN',
            isDownload: false,
          })
        );
      });
    });

    describe('success response', () => {
      it('returns mapped array with driver_type and loss_area_ha', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        fetchDataMart.mockResolvedValue({
          data: {
            status: 'ok',
            result: {
              tree_cover_loss_by_driver: [
                { drivers_type: 'A', loss_area_ha: 10 },
                { drivers_type: 'B', loss_area_ha: 20 },
              ],
            },
          },
        });

        const result = await widgetConfig.getData({
          type: 'geostore',
          geostore: { id: 'id1' },
          threshold: 30,
        });

        expect(result).toEqual([
          { driver_type: 'A', loss_area_ha: 10 },
          { driver_type: 'B', loss_area_ha: 20 },
        ]);
      });
    });

    describe('error handling', () => {
      it('throws Error with response message when response.data.status is failed', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        fetchDataMart.mockResolvedValue({
          data: { status: 'failed', message: 'Server error' },
        });

        await expect(
          widgetConfig.getData({
            type: 'geostore',
            geostore: { id: 'id1' },
            threshold: 30,
          })
        ).rejects.toThrow(new Error('Server error'));
      });
    });
  });

  describe('getDataURL', () => {
    describe('type mapping', () => {
      beforeEach(() => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        fetchDataMart.mockResolvedValue('https://example.com/file.csv');
      });

      it('calls fetchDataMart with type protected_area when type is wdpa', async () => {
        await widgetConfig.getDataURL({
          type: 'wdpa',
          adm0: '1',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            type: 'protected_area',
            adm0: '1',
            threshold: 30,
            isDownload: true,
          })
        );
      });

      it('calls fetchDataMart with type global when type is global', async () => {
        await widgetConfig.getDataURL({
          type: 'global',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            type: 'global',
            threshold: 30,
            isDownload: true,
          })
        );
      });

      it('calls fetchDataMart with type admin when type is admin and adm0 is set', async () => {
        await widgetConfig.getDataURL({
          type: 'admin',
          adm0: 'BRA',
          adm1: '25',
          adm2: '123',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            type: 'admin',
            adm0: 'BRA',
            adm1: '25',
            adm2: '123',
            threshold: 30,
            isDownload: true,
          })
        );
      });

      it('calls fetchDataMart with type geostore and geostoreId when type is geostore', async () => {
        const geostoreId = 'abc123';
        await widgetConfig.getDataURL({
          type: 'geostore',
          geostore: { id: geostoreId },
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            geostoreId,
            type: 'geostore',
            threshold: 30,
            isDownload: true,
          })
        );
      });
    });

    describe('precomputed tables', () => {
      beforeEach(() => {
        fetchDataMart.mockResolvedValue('https://example.com/download.csv');
      });

      it('calls fetchDataMart with type admin when shouldQueryPrecomputedTables is true and locationType is country', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        await widgetConfig.getDataURL({
          type: 'geostore',
          geostore: { id: 'geo1' },
          adm0: 'BRA',
          locationType: 'country',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'admin',
            adm0: 'BRA',
            isDownload: true,
          })
        );
      });

      it('uses type geostore and geostoreId adm0 when shouldQueryPrecomputedTables is true and locationType is aoi', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        await widgetConfig.getDataURL({
          type: 'geostore',
          geostore: { id: 'geo1' },
          adm0: 'IDN',
          locationType: 'aoi',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'geostore',
            geostoreId: 'IDN',
            isDownload: true,
          })
        );
      });
    });

    describe('success response', () => {
      it('returns array with name and url from fetchDataMart result', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        const url = 'https://example.com/tree_cover_loss_by_driver.csv';
        fetchDataMart.mockResolvedValue(url);

        const result = await widgetConfig.getDataURL({
          type: 'geostore',
          geostore: { id: 'id1' },
          threshold: 30,
        });

        expect(result).toEqual([{ name: DATASET, url }]);
      });
    });

    describe('fetchDataMart arguments', () => {
      it('calls fetchDataMart with isDownload true', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        fetchDataMart.mockResolvedValue('https://example.com/file.csv');

        await widgetConfig.getDataURL({
          type: 'admin',
          adm0: 'BRA',
          adm1: '25',
          adm2: '456',
          threshold: 30,
        });

        expect(fetchDataMart).toHaveBeenCalledWith(
          expect.objectContaining({
            dataset: DATASET,
            adm0: 'BRA',
            adm1: '25',
            adm2: '456',
            threshold: 30,
            isDownload: true,
          })
        );
      });
    });
  });
});
