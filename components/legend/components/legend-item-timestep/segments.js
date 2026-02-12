import moment from 'moment';

// Utils shared with existing timeline helpers
import { dateDiff } from './utils';

// Parse label like "1976–2002" or "1976-2002" or "2020"
export const parseLabelYears = (label) => {
  if (!label) return null;

  const normalized = String(label).replace('–', '-');
  const parts = normalized.split('-').map((p) => p.trim());

  if (parts.length === 1) {
    const year = parseInt(parts[0], 10);
    if (Number.isNaN(year)) return null;
    return { startYear: year, endYear: year };
  }

  if (parts.length === 2) {
    const startYear = parseInt(parts[0], 10);
    const endYear = parseInt(parts[1], 10);

    if (Number.isNaN(startYear) || Number.isNaN(endYear)) return null;

    return {
      startYear: Math.min(startYear, endYear),
      endYear: Math.max(startYear, endYear),
    };
  }

  return null;
};

// Convert a calendar year into the timeline index (difference from minDate)
export const yearToIndex = (year, minDate, interval = 'years') => {
  if (!year || !minDate) return null;

  const yearDate = moment.utc(`${year}-01-01`).format('YYYY-MM-DD');

  return dateDiff(yearDate, minDate, interval);
};

// Build segments from customTimelineRange and the base timeline dates
export const buildSegments = (timelineParams) => {
  const {
    customTimelineRange,
    minDate,
    maxDate,
    interval = 'years',
  } = timelineParams || {};

  if (!customTimelineRange || !customTimelineRange.length) return null;

  const minYear = moment.utc(minDate).year();
  const maxYear = moment.utc(maxDate).year();

  // First, normalize each mark into a segment definition
  const rawSegments = customTimelineRange
    .map((item, index) => {
      const { label, datasetDate } = item || {};
      if (!label) return null;

      const parsed = parseLabelYears(label);
      if (!parsed) return null;

      const { startYear, endYear } = parsed;

      // Clamp to overall min/max to be safe
      const clampedStartYear = Math.max(startYear, minYear);
      const clampedEndYear = Math.min(endYear, maxYear);

      if (clampedEndYear < clampedStartYear) return null;

      // Segment bounds in index space, based on years
      const startIndex = yearToIndex(clampedStartYear, minDate, interval);
      const endIndex = yearToIndex(clampedEndYear, minDate, interval);

      if (startIndex == null || endIndex == null) {
        return null;
      }

      // Center of the segment: use datasetDate when provided so the slider thumb
      // aligns with the mark (same position as customTimelineMarks), and the
      // map receives the correct dataset reference. Otherwise use midpoint.
      let centerIndex;
      if (datasetDate != null) {
        const dataIndex = yearToIndex(datasetDate, minDate, interval);
        centerIndex =
          dataIndex != null
            ? dataIndex
            : Math.round((startIndex + endIndex) / 2);
      } else {
        centerIndex =
          clampedStartYear === clampedEndYear
            ? startIndex
            : Math.round((startIndex + endIndex) / 2);
      }

      const yearCount = clampedEndYear - clampedStartYear + 1;

      return {
        id: index,
        label,
        datasetDate,
        startYear: clampedStartYear,
        endYear: clampedEndYear,
        startIndex,
        endIndex,
        centerIndex,
        yearCount,
      };
    })
    .filter(Boolean);

  if (!rawSegments.length) return null;

  // Ensure segments are ordered by their startIndex
  const segments = rawSegments.sort((a, b) => a.startIndex - b.startIndex);

  return segments;
};

// Given a linear slider index, find the nearest segment and snapped index
export const mapIndexToSegment = (segments, index) => {
  if (!segments || !segments.length) return null;

  // Global index span covered by grouped segments
  const minIndex = segments[0].startIndex;
  const maxIndex = segments[segments.length - 1].endIndex;

  // If the index is outside all grouped ranges, we should NOT apply
  // segmented behavior, so the caller can fall back to linear mode.
  if (index < minIndex || index > maxIndex) {
    return null;
  }

  const clampedIndex = index;

  let closest = segments[0];
  let closestDistance = Math.abs(clampedIndex - closest.centerIndex);

  segments.forEach((segment) => {
    const distance = Math.abs(clampedIndex - segment.centerIndex);
    if (distance < closestDistance) {
      closest = segment;
      closestDistance = distance;
    }
  });

  return {
    segment: closest,
    snappedIndex: closest.centerIndex,
  };
};

// Get segment whose centerIndex equals the given index (for output date lookup)
export const getSegmentByCenterIndex = (segments, index) => {
  if (!segments || !segments.length) return null;
  return segments.find((s) => s.centerIndex === index) || null;
};

// Map a segment id or explicit year to a slider index
export const segmentToIndex = (segments, { id, year }) => {
  if (!segments || !segments.length) return null;

  if (typeof id === 'number') {
    const seg = segments.find((s) => s.id === id);
    return seg ? seg.centerIndex : null;
  }

  if (typeof year === 'number') {
    const seg = segments.find((s) => year >= s.startYear && year <= s.endYear);
    return seg ? seg.centerIndex : null;
  }

  return null;
};
