import {
  selectLoadingFilterData,
  selectLoadingMeta,
  selectActiveWidget,
  selectWidgetSettings,
  selectWidgetsData,
  getCategory,
} from '../selectors';

describe('Widgets Selectors', () => {
  describe('selectActiveWidget', () => {
    it('returns active widget from state', () => {
      const state = {
        widgets: {
          activeWidget: { widget: 'tree-loss', title: 'Tree Loss' },
        },
      };
      const result = selectActiveWidget(state);
      expect(result).toEqual({ widget: 'tree-loss', title: 'Tree Loss' });
    });

    it('returns undefined when no active widget', () => {
      const state = {
        widgets: {},
      };
      const result = selectActiveWidget(state);
      expect(result).toBeUndefined();
    });
  });

  describe('selectWidgetSettings', () => {
    it('returns widget settings from state', () => {
      const state = {
        widgets: {
          settings: {
            'tree-loss': { threshold: 30 },
          },
        },
      };
      const result = selectWidgetSettings(state);
      expect(result).toEqual({
        'tree-loss': { threshold: 30 },
      });
    });

    it('returns empty object when no settings', () => {
      const state = {
        widgets: {},
      };
      const result = selectWidgetSettings(state);
      expect(result).toEqual({});
    });
  });

  describe('selectWidgetsData', () => {
    it('returns widgets data from state', () => {
      const state = {
        widgets: {
          data: {
            'tree-loss': { value: 100 },
          },
        },
      };
      const result = selectWidgetsData(state);
      expect(result).toEqual({
        'tree-loss': { value: 100 },
      });
    });

    it('returns undefined when widgets state is missing', () => {
      const state = {};
      const result = selectWidgetsData(state);
      expect(result).toBeUndefined();
    });
  });

  describe('getCategory', () => {
    it('returns category from state', () => {
      const state = {
        widgets: {
          category: 'forest-change',
        },
      };
      const result = getCategory(state);
      expect(result).toBe('forest-change');
    });

    it('returns undefined when category is missing', () => {
      const state = {
        widgets: {},
      };
      const result = getCategory(state);
      expect(result).toBeUndefined();
    });
  });

  describe('selectLoadingFilterData', () => {
    it('returns true when country data is loading', () => {
      const state = {
        countryData: {
          countriesLoading: true,
          regionsLoading: false,
          subRegionsLoading: false,
        },
        whitelists: { loading: false },
        areas: { loading: false },
      };
      const result = selectLoadingFilterData(state);
      expect(result).toBe(true);
    });

    it('returns true when regions are loading', () => {
      const state = {
        countryData: {
          countriesLoading: false,
          regionsLoading: true,
          subRegionsLoading: false,
        },
        whitelists: { loading: false },
        areas: { loading: false },
      };
      const result = selectLoadingFilterData(state);
      expect(result).toBe(true);
    });

    it('returns true when areas are loading', () => {
      const state = {
        countryData: {
          countriesLoading: false,
          regionsLoading: false,
          subRegionsLoading: false,
        },
        whitelists: { loading: false },
        areas: { loading: true },
      };
      const result = selectLoadingFilterData(state);
      expect(result).toBe(true);
    });

    it('returns false when nothing is loading', () => {
      const state = {
        countryData: {
          countriesLoading: false,
          regionsLoading: false,
          subRegionsLoading: false,
        },
        whitelists: { loading: false },
        areas: { loading: false },
      };
      const result = selectLoadingFilterData(state);
      expect(result).toBe(false);
    });

    it('returns falsy when countryData is missing', () => {
      const state = {
        whitelists: { loading: false },
        areas: { loading: false },
      };
      const result = selectLoadingFilterData(state);
      expect(result).toBeFalsy();
    });
  });

  describe('selectLoadingMeta', () => {
    it('returns true when geostore is loading', () => {
      const state = {
        geostore: { loading: true },
        geodescriber: { loading: false },
        meta: { loading: false },
      };
      const result = selectLoadingMeta(state);
      expect(result).toBe(true);
    });

    it('returns true when geodescriber is loading', () => {
      const state = {
        geostore: { loading: false },
        geodescriber: { loading: true },
        meta: { loading: false },
      };
      const result = selectLoadingMeta(state);
      expect(result).toBe(true);
    });

    it('returns false when nothing is loading', () => {
      const state = {
        geostore: { loading: false },
        geodescriber: { loading: false },
        meta: { loading: false },
      };
      const result = selectLoadingMeta(state);
      expect(result).toBe(false);
    });
  });
});
