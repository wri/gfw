import { statsLatestDecoder } from 'services/stats-latest-decoder';

describe('statsLatestDecoder', () => {
  it('returns a positive number of days since the reference date', () => {
    const bands = [
      {
        max: 13005, // encoded high-confidence value
        histogram: {
          min: 10000,
          max: 40000,
          bin_count: 3,
          value_count: [0, 1, 0],
        },
      },
    ];

    const result = statsLatestDecoder(bands);

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });
});
