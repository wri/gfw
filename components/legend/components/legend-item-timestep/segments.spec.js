import {
  parseLabelYears,
  yearToIndex,
  buildSegments,
  mapIndexToSegment,
  getSegmentByCenterIndex,
  segmentToIndex,
} from './segments';

describe('segments', () => {
  describe('parseLabelYears', () => {
    it('returns null for empty or falsy input', () => {
      expect(parseLabelYears(null)).toBeNull();
      expect(parseLabelYears(undefined)).toBeNull();
      expect(parseLabelYears('')).toBeNull();
    });

    it('parses single year label', () => {
      expect(parseLabelYears('2020')).toEqual({
        startYear: 2020,
        endYear: 2020,
      });
      expect(parseLabelYears('1976')).toEqual({
        startYear: 1976,
        endYear: 1976,
      });
    });

    it('parses year range with hyphen', () => {
      expect(parseLabelYears('1976-2002')).toEqual({
        startYear: 1976,
        endYear: 2002,
      });
      expect(parseLabelYears('2003-2018')).toEqual({
        startYear: 2003,
        endYear: 2018,
      });
    });

    it('parses year range with en-dash (U+2013)', () => {
      expect(parseLabelYears('1976–2002')).toEqual({
        startYear: 1976,
        endYear: 2002,
      });
    });

    it('handles reversed year ranges', () => {
      expect(parseLabelYears('2002-1976')).toEqual({
        startYear: 1976,
        endYear: 2002,
      });
    });

    it('trims whitespace', () => {
      expect(parseLabelYears(' 1976 - 2002 ')).toEqual({
        startYear: 1976,
        endYear: 2002,
      });
    });

    it('returns null for invalid formats', () => {
      expect(parseLabelYears('abc')).toBeNull();
      expect(parseLabelYears('1976-abc')).toBeNull();
      expect(parseLabelYears('abc-2002')).toBeNull();
      expect(parseLabelYears('1976-2002-2010')).toBeNull();
    });

    it('handles numeric input by converting to string', () => {
      expect(parseLabelYears(2020)).toEqual({
        startYear: 2020,
        endYear: 2020,
      });
    });
  });

  describe('yearToIndex', () => {
    it('returns null for missing year or minDate', () => {
      expect(yearToIndex(null, '2000-01-01')).toBeNull();
      expect(yearToIndex(2000, null)).toBeNull();
      expect(yearToIndex(undefined, '2000-01-01')).toBeNull();
    });

    it('converts year to index relative to minDate', () => {
      // For the same year as minDate, the implementation returns -0,
      // which should be treated as 0 for index purposes.
      expect(yearToIndex(2000, '2000-01-01', 'years')).toBeCloseTo(0);
      expect(yearToIndex(2001, '2000-01-01', 'years')).toBe(1);
      expect(yearToIndex(1999, '2000-01-01', 'years')).toBe(-1);
      expect(yearToIndex(2005, '2000-01-01', 'years')).toBe(5);
    });

    it('uses custom interval', () => {
      expect(yearToIndex(2000, '2000-01-01', 'months')).toBeCloseTo(0);
      expect(yearToIndex(2001, '2000-01-01', 'months')).toBe(12);
    });
  });

  describe('buildSegments', () => {
    const baseTimelineParams = {
      minDate: '2000-01-01',
      maxDate: '2020-01-01',
      interval: 'years',
    };

    it('returns null for empty or missing customTimelineRange', () => {
      expect(buildSegments(null)).toBeNull();
      expect(buildSegments({})).toBeNull();
      expect(
        buildSegments({ ...baseTimelineParams, customTimelineRange: [] })
      ).toBeNull();
    });

    it('builds segments from valid customTimelineRange', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [{ label: '2000-2005' }, { label: '2010-2015' }],
      };

      const segments = buildSegments(params);

      expect(segments).toHaveLength(2);
      expect(segments[0]).toMatchObject({
        id: 0,
        label: '2000-2005',
        startYear: 2000,
        endYear: 2005,
        yearCount: 6,
      });
      expect(segments[1]).toMatchObject({
        id: 1,
        label: '2010-2015',
        startYear: 2010,
        endYear: 2015,
        yearCount: 6,
      });
    });

    it('clamps segments to min/max year bounds', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [
          { label: '1995-2005' }, // starts before minDate
          { label: '2015-2025' }, // ends after maxDate
        ],
      };

      const segments = buildSegments(params);

      expect(segments[0].startYear).toBe(2000);
      expect(segments[0].endYear).toBe(2005);
      expect(segments[1].startYear).toBe(2015);
      expect(segments[1].endYear).toBe(2020);
    });

    it('filters out invalid segments', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [
          { label: '2000-2005' },
          { label: 'invalid' },
          { label: '2010-2015' },
          { label: '' },
        ],
      };

      const segments = buildSegments(params);

      expect(segments).toHaveLength(2);
      expect(segments[0].label).toBe('2000-2005');
      expect(segments[1].label).toBe('2010-2015');
    });

    it('uses datasetDate for centerIndex when provided', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [{ label: '2000-2005', datasetDate: 2003 }],
      };

      const segments = buildSegments(params);

      expect(segments[0].centerIndex).toBe(
        yearToIndex(2003, '2000-01-01', 'years')
      );
      expect(segments[0].datasetDate).toBe(2003);
    });

    it('calculates centerIndex as midpoint when datasetDate not provided', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [{ label: '2000-2005' }],
      };

      const segments = buildSegments(params);
      const expectedCenter = Math.round(
        (segments[0].startIndex + segments[0].endIndex) / 2
      );

      expect(segments[0].centerIndex).toBe(expectedCenter);
    });

    it('uses startIndex as centerIndex for single year segments', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [{ label: '2000' }],
      };

      const segments = buildSegments(params);

      expect(segments[0].centerIndex).toBe(segments[0].startIndex);
    });

    it('sorts segments by startIndex', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [
          { label: '2010-2015' },
          { label: '2000-2005' },
          { label: '2016-2020' },
        ],
      };

      const segments = buildSegments(params);

      expect(segments[0].startIndex).toBeLessThan(segments[1].startIndex);
      expect(segments[1].startIndex).toBeLessThan(segments[2].startIndex);
    });

    it('filters out segments outside min/max bounds', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [
          { label: '1990-1995' }, // completely before minDate
          { label: '2025-2030' }, // completely after maxDate
        ],
      };

      const segments = buildSegments(params);

      expect(segments).toBeNull();
    });

    it('handles single year segments', () => {
      const params = {
        ...baseTimelineParams,
        customTimelineRange: [{ label: '2005' }, { label: '2010' }],
      };

      const segments = buildSegments(params);

      expect(segments).toHaveLength(2);
      expect(segments[0].startYear).toBe(2005);
      expect(segments[0].endYear).toBe(2005);
      expect(segments[0].yearCount).toBe(1);
    });
  });

  describe('mapIndexToSegment', () => {
    const segments = [
      {
        id: 0,
        startIndex: 0,
        endIndex: 5,
        centerIndex: 2,
        startYear: 2000,
        endYear: 2005,
      },
      {
        id: 1,
        startIndex: 10,
        endIndex: 15,
        centerIndex: 12,
        startYear: 2010,
        endYear: 2015,
      },
    ];

    it('returns null for empty segments', () => {
      expect(mapIndexToSegment(null, 5)).toBeNull();
      expect(mapIndexToSegment([], 5)).toBeNull();
    });

    it('returns null for index outside segment range', () => {
      expect(mapIndexToSegment(segments, -1)).toBeNull();
      expect(mapIndexToSegment(segments, 20)).toBeNull();
    });

    it('finds nearest segment by centerIndex', () => {
      const result1 = mapIndexToSegment(segments, 1);
      expect(result1.segment.id).toBe(0);
      expect(result1.snappedIndex).toBe(2);

      const result2 = mapIndexToSegment(segments, 11);
      expect(result2.segment.id).toBe(1);
      expect(result2.snappedIndex).toBe(12);
    });

    it('handles index at segment boundary', () => {
      const result = mapIndexToSegment(segments, 5);
      expect(result.segment.id).toBe(0);
      expect(result.snappedIndex).toBe(2);
    });

    it('handles index between segments (closer to first)', () => {
      const result = mapIndexToSegment(segments, 6);
      expect(result.segment.id).toBe(0);
      expect(result.snappedIndex).toBe(2);
    });

    it('handles index between segments (closer to second)', () => {
      const result = mapIndexToSegment(segments, 8);
      expect(result.segment.id).toBe(1);
      expect(result.snappedIndex).toBe(12);
    });

    it('handles index exactly at centerIndex', () => {
      const result = mapIndexToSegment(segments, 12);
      expect(result.segment.id).toBe(1);
      expect(result.snappedIndex).toBe(12);
    });
  });

  describe('getSegmentByCenterIndex', () => {
    const segments = [
      {
        id: 0,
        centerIndex: 2,
      },
      {
        id: 1,
        centerIndex: 12,
      },
    ];

    it('returns null for empty segments', () => {
      expect(getSegmentByCenterIndex(null, 2)).toBeNull();
      expect(getSegmentByCenterIndex([], 2)).toBeNull();
    });

    it('finds segment with matching centerIndex', () => {
      expect(getSegmentByCenterIndex(segments, 2)).toEqual(segments[0]);
      expect(getSegmentByCenterIndex(segments, 12)).toEqual(segments[1]);
    });

    it('returns null when no segment matches', () => {
      expect(getSegmentByCenterIndex(segments, 5)).toBeNull();
      expect(getSegmentByCenterIndex(segments, 20)).toBeNull();
    });
  });

  describe('segmentToIndex', () => {
    const segments = [
      {
        id: 0,
        centerIndex: 2,
        startYear: 2000,
        endYear: 2005,
      },
      {
        id: 1,
        centerIndex: 12,
        startYear: 2010,
        endYear: 2015,
      },
    ];

    it('returns null for empty segments', () => {
      expect(segmentToIndex(null, { id: 0 })).toBeNull();
      expect(segmentToIndex([], { id: 0 })).toBeNull();
    });

    it('finds segment by id and returns centerIndex', () => {
      expect(segmentToIndex(segments, { id: 0 })).toBe(2);
      expect(segmentToIndex(segments, { id: 1 })).toBe(12);
    });

    it('returns null for invalid id', () => {
      expect(segmentToIndex(segments, { id: 99 })).toBeNull();
    });

    it('finds segment by year and returns centerIndex', () => {
      expect(segmentToIndex(segments, { year: 2002 })).toBe(2);
      expect(segmentToIndex(segments, { year: 2012 })).toBe(12);
      expect(segmentToIndex(segments, { year: 2000 })).toBe(2);
      expect(segmentToIndex(segments, { year: 2005 })).toBe(2);
    });

    it('returns null for year outside all segments', () => {
      expect(segmentToIndex(segments, { year: 1990 })).toBeNull();
      expect(segmentToIndex(segments, { year: 2020 })).toBeNull();
    });

    it('returns null when neither id nor year provided', () => {
      expect(segmentToIndex(segments, {})).toBeNull();
      expect(segmentToIndex(segments, { id: null, year: null })).toBeNull();
    });

    it('prioritizes id over year', () => {
      expect(segmentToIndex(segments, { id: 1, year: 2002 })).toBe(12);
    });
  });
});
