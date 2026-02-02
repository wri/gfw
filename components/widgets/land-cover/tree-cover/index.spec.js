import { jest } from '@jest/globals';
import {
  getExtent,
  getTropicalExtent,
  getTreeCoverOTF,
} from 'services/analysis-cached';
import { shouldQueryPrecomputedTables } from 'components/widgets/utils/helpers';
import { all } from 'axios';
import widgetConfig from './index';

jest.mock('services/analysis-cached', () => ({
  getExtent: jest.fn(),
  getTropicalExtent: jest.fn(),
  getTreeCoverOTF: jest.fn(),
}));

jest.mock('components/widgets/utils/helpers', () => ({
  shouldQueryPrecomputedTables: jest.fn(),
}));

jest.mock('axios', () => ({
  all: jest.fn(),
  spread: jest.fn((fn) => (arr) => fn(...arr)),
}));

describe('tree-cover widget', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    describe('when shouldQueryPrecomputedTables is true (precomputed path)', () => {
      it('calls getExtent twice with correct params when extentYear is 2000', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        const extentFn = getExtent;
        extentFn
          .mockResolvedValueOnce({
            data: { data: [{ extent: 100, total_area: 500, area__ha: 80 }] },
          })
          .mockResolvedValueOnce({
            data: {
              data: [{ extent: 200, total_area: 600, area__ha: 120 }],
            },
          });

        all.mockImplementation((promises) => Promise.all(promises));

        const params = {
          extentYear: 2000,
          threshold: 30,
          adm0: 'BRA',
          landCategory: null,
        };

        const result = await widgetConfig.getData(params);

        expect(extentFn).toHaveBeenCalledTimes(2);
        expect(extentFn).toHaveBeenNthCalledWith(1, {
          extentYear: 2000,
          adm0: 'BRA',
          landCategory: null,
          threshold: 30,
        });
        expect(extentFn).toHaveBeenNthCalledWith(2, {
          extentYear: 2000,
          adm0: 'BRA',
          forestType: '',
          landCategory: '',
          threshold: 30,
        });
        expect(result).toEqual({
          totalArea: 600,
          totalExtent: 200,
          treeCover: 100,
        });
      });

      it('calls getTropicalExtent twice when extentYear is 2020', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        const extentFn = getTropicalExtent;
        extentFn
          .mockResolvedValueOnce({
            data: { data: [{ extent: 150, total_area: 400, area__ha: 100 }] },
          })
          .mockResolvedValueOnce({
            data: {
              data: [{ extent: 250, total_area: 500, area__ha: 150 }],
            },
          });

        all.mockImplementation((promises) => Promise.all(promises));

        const params = {
          extentYear: 2020,
          decile: 30,
          adm0: 'IDN',
        };

        const result = await widgetConfig.getData(params);

        expect(extentFn).toHaveBeenCalledTimes(2);
        expect(extentFn).toHaveBeenNthCalledWith(1, {
          extentYear: 2020,
          adm0: 'IDN',
          decile: 30,
        });
        expect(extentFn).toHaveBeenNthCalledWith(2, {
          extentYear: 2020,
          adm0: 'IDN',
          forestType: '',
          landCategory: '',
          decile: 30,
        });
        expect(result).toEqual({
          totalArea: 500,
          totalExtent: 250,
          treeCover: 150,
        });
      });

      it('uses area__ha for totalExtent when landCategory is set (hasIntersection)', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        const extentFn = getExtent;
        extentFn
          .mockResolvedValueOnce({
            data: {
              data: [
                { extent: 10, total_area: 100, area__ha: 8 },
                { extent: 20, total_area: 100, area__ha: 12 },
              ],
            },
          })
          .mockResolvedValueOnce({
            data: {
              data: [{ extent: 30, total_area: 200, area__ha: 25 }],
            },
          });

        all.mockImplementation((promises) => Promise.all(promises));

        const result = await widgetConfig.getData({
          extentYear: 2010,
          threshold: 30,
          adm0: 'BRA',
          landCategory: 'forest',
        });

        expect(result).toEqual({
          totalArea: 200,
          totalExtent: 20,
          treeCover: 30,
        });
      });

      it('returns empty data when extent has no length', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(true);
        getExtent
          .mockResolvedValueOnce({ data: { data: [] } })
          .mockResolvedValueOnce({ data: { data: [] } });

        all.mockImplementation((promises) => Promise.all(promises));

        const result = await widgetConfig.getData({
          extentYear: 2000,
          threshold: 30,
          adm0: 'BRA',
        });

        expect(result).toEqual({});
      });
    });

    describe('when shouldQueryPrecomputedTables is false (OTF path)', () => {
      it('calls getTreeCoverOTF with params', async () => {
        shouldQueryPrecomputedTables.mockReturnValue(false);
        getTreeCoverOTF.mockResolvedValue({ totalArea: 1000, treeCover: 300 });

        const params = {
          extentYear: 2000,
          threshold: 30,
          adm0: 'BRA',
          geostore: { id: 'geo1' },
        };

        const result = await widgetConfig.getData(params);

        expect(getTreeCoverOTF).toHaveBeenCalledWith(params);
        expect(getExtent).not.toHaveBeenCalled();
        expect(getTropicalExtent).not.toHaveBeenCalled();
        expect(result).toEqual({ totalArea: 1000, treeCover: 300 });
      });
    });
  });

  describe('getDataURL', () => {
    it('returns two download promises when extentYear is 2000 (getExtent)', () => {
      getExtent.mockReturnValue(Promise.resolve('url1'));

      const params = {
        extentYear: 2000,
        threshold: 30,
        adm0: 'BRA',
      };

      const result = widgetConfig.getDataURL(params);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(getExtent).toHaveBeenCalledWith(
        expect.objectContaining({
          extentYear: 2000,
          adm0: 'BRA',
          threshold: 30,
          download: true,
          forestType: null,
          landCategory: null,
        })
      );
      expect(getExtent).toHaveBeenCalledWith(
        expect.objectContaining({
          extentYear: 2000,
          adm0: 'BRA',
          threshold: 30,
          download: true,
          forestType: 'plantations',
        })
      );
      expect(getTropicalExtent).not.toHaveBeenCalled();
    });

    it('returns three download promises when landCategory is set', () => {
      getExtent.mockReturnValue(Promise.resolve('url'));

      const result = widgetConfig.getDataURL({
        extentYear: 2010,
        threshold: 30,
        adm0: 'BRA',
        landCategory: 'forest',
      });

      expect(result).toHaveLength(3);
      expect(getExtent).toHaveBeenCalledTimes(3);
    });

    it('uses getTropicalExtent and decile when extentYear is 2020', () => {
      getTropicalExtent.mockReturnValue(Promise.resolve('tropical-url'));

      widgetConfig.getDataURL({
        extentYear: 2020,
        decile: 30,
        adm0: 'IDN',
      });

      expect(getTropicalExtent).toHaveBeenCalledWith(
        expect.objectContaining({
          extentYear: 2020,
          adm0: 'IDN',
          decile: 30,
          download: true,
          forestType: null,
          landCategory: null,
        })
      );
      expect(getExtent).not.toHaveBeenCalled();
    });
  });
});
