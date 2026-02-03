import { jest } from '@jest/globals';
import { formatNumber } from 'utils/format';
import { parseData, parseSentence } from './selectors';

jest.mock('utils/format', () => ({
  formatNumber: jest.fn(({ num }) => `${num}%`),
}));

describe('tree-cover selectors', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseData', () => {
    const baseColors = {
      naturalForest: '#color1',
      nonForest: '#color2',
      otherCover: '#color3',
    };

    it('returns null when data is empty', () => {
      expect(
        parseData(
          { data: null, colors: baseColors, indicator: null, settings: {} },
          {}
        )
      ).toBeNull();
      expect(
        parseData(
          { data: {}, colors: baseColors, indicator: null, settings: {} },
          {}
        )
      ).toBeNull();
    });

    it('returns two items (Tree Cover, Other Land Cover) when no indicator and no landCategory', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 800, treeCover: 400 },
        colors: baseColors,
        indicator: null,
        settings: { landCategory: null },
      };
      const result = parseData(state, {});

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        label: 'Tree Cover',
        value: 400,
        color: '#color1',
        percentage: 40,
      });
      expect(result[1].label).toBe('Other Land Cover');
      expect(result[1].value).toBe(600);
      expect(result[1].color).toBe('#color2');
      expect(result[1].percentage).toBe(60);
    });

    it('appends indicator label to Tree Cover when indicator is set', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 800, treeCover: 300 },
        colors: baseColors,
        indicator: { label: 'Plantations', value: 'plantations' },
        settings: { landCategory: null },
      };
      const result = parseData(state, {});

      expect(result[0].label).toBe('Tree Cover in Plantations');
      expect(result).toHaveLength(3);
      expect(result[1].label).toBe('Other tree cover');
      expect(result[1].value).toBe(500);
      expect(result[2].label).toBe('Other Land Cover');
    });

    it('uses otherCover (totalExtent - treeCover) for Other Land Cover when hasIntersection, indicator set, and no plantations', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 600, treeCover: 200 },
        colors: baseColors,
        indicator: { label: 'Natural forest', value: 'natural_forest' },
        settings: { landCategory: 'forest' },
      };
      const result = parseData(state, {});

      expect(result[1].value).toBe(400);
      expect(result[1].percentage).toBe(40);
    });

    it('uses totalArea - treeCover - otherCover for Other Land Cover when hasPlantations', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 700, treeCover: 300 },
        colors: baseColors,
        indicator: { label: 'X', value: 'plantations' },
        settings: { landCategory: null },
      };
      const result = parseData(state, {});

      expect(result[1].label).toBe('Other tree cover');
      expect(result[1].value).toBe(400);
      expect(result[2].label).toBe('Other Land Cover');
      expect(result[2].value).toBe(300);
      expect(result[2].percentage).toBe(30);
    });
  });

  describe('parseSentence', () => {
    const baseSentences = {
      default: {
        global: {
          treeCover: 'Global tree cover sentence.',
          tropicalTreeCover: 'Global tropical sentence.',
        },
        region: {
          treeCover: 'Region tree cover sentence.',
          tropicalTreeCover: 'Region tropical sentence.',
        },
      },
      withIndicator: {
        global: {
          treeCover: 'Global with indicator.',
          tropicalTreeCover: 'Global tropical with indicator.',
        },
        region: {
          treeCover: 'Region with indicator.',
          tropicalTreeCover: 'Region tropical with indicator.',
        },
      },
    };

    it('returns null when data is null', () => {
      const state = {
        data: null,
        settings: {},
        locationLabel: 'Brazil',
        indicator: null,
        sentence: baseSentences,
        adminLevel: 'region',
      };
      expect(parseSentence(state, {})).toBeNull();
    });

    it('returns null when sentences is null', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 800, treeCover: 400 },
        settings: {},
        locationLabel: 'Brazil',
        indicator: null,
        sentence: null,
        adminLevel: 'region',
      };
      expect(parseSentence(state, {})).toBeNull();
    });

    it('returns default region treeCover sentence and params when extentYear is 2000', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 1000, treeCover: 250 },
        settings: { extentYear: 2000, threshold: 30, decile: 30 },
        locationLabel: 'Brazil',
        indicator: null,
        sentence: baseSentences,
        adminLevel: 'region',
      };
      const result = parseSentence(state, {});

      expect(result).toEqual({
        sentence: 'Region tree cover sentence.',
        params: {
          year: 2000,
          location: 'Brazil',
          percentage: '25%',
          indicator: undefined,
          threshold: '>30%',
        },
      });
      expect(formatNumber).toHaveBeenCalledWith({ num: 25, unit: '%' });
    });

    it('returns default global tropicalTreeCover sentence when admLevel is global and extentYear is 2020', () => {
      const state = {
        data: { totalArea: 500, totalExtent: 500, treeCover: 100 },
        settings: { extentYear: 2020, threshold: 30, decile: 25 },
        locationLabel: 'global',
        indicator: null,
        sentence: baseSentences,
        adminLevel: 'global',
      };
      const result = parseSentence(state, {});

      expect(result.sentence).toBe('Global tropical sentence.');
      expect(result.params.threshold).toBe('>25%');
      expect(result.params.year).toBe(2020);
      expect(formatNumber).toHaveBeenCalledWith({ num: 20, unit: '%' });
    });

    it('returns withIndicator sentence and includes indicator label when indicator is set', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 1000, treeCover: 400 },
        settings: { extentYear: 2000, threshold: 30 },
        locationLabel: 'Indonesia',
        indicator: { label: 'Plantations' },
        sentence: baseSentences,
        adminLevel: 'region',
      };
      const result = parseSentence(state, {});

      expect(result.sentence).toBe('Region with indicator.');
      expect(result.params.indicator).toBe('Plantations');
    });

    it('uses totalExtent as bottom when hasIntersection (landCategory or forestType)', () => {
      const state = {
        data: { totalArea: 1000, totalExtent: 400, treeCover: 100 },
        settings: { extentYear: 2000, landCategory: 'forest', threshold: 30 },
        locationLabel: 'Brazil',
        indicator: null,
        sentence: baseSentences,
        adminLevel: 'region',
      };
      const result = parseSentence(state, {});

      expect(formatNumber).toHaveBeenCalledWith({ num: 25, unit: '%' });
      expect(result.params.percentage).toBe('25%');
    });
  });
});
