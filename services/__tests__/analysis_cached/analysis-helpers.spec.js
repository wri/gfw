import {
  getIndicator,
  getDatesFilter,
  getWeeksFilter,
} from '../../analysis-cached';

describe('analysis-cached helpers', () => {
  describe('getIndicator', () => {
    it('returns null when no forest type or land category is provided', () => {
      expect(getIndicator(null, null, 2010)).toBeNull();
    });

    it('returns a value matching the forest type when only forest type is provided', () => {
      const result = getIndicator('plantations', null, 2010);

      expect(result).toBeDefined();
      expect(result.value).toBe('plantations');
      expect(typeof result.label).toBe('string');
      expect(result.label.length).toBeGreaterThan(0);
    });
  });

  describe('getDatesFilter', () => {
    it('builds a filter using the provided startDate year and week', () => {
      const filter = getDatesFilter({ startDate: '2024-01-15' });

      expect(filter).toContain('alert__year = 2024');
      expect(filter).toContain('alert__week >=');
      expect(filter).toContain('OR alert__year >= 2024');
    });
  });

  describe('getWeeksFilter', () => {
    it('builds a complex weeks filter using weeks and latest', () => {
      const filter = getWeeksFilter({
        weeks: 4,
        latest: '2024-02-01',
        isFirst: true,
      });

      expect(filter).toContain('alert__year =');
      expect(filter).toContain('alert__week');
      expect(filter).toContain('OR ((alert__year = ');
    });
  });
});
