import {
  checkLocationInsideBbox,
  reverseLatLng,
  validateLatLng,
  validateLat,
  validateLng,
} from '../geoms';

describe('utils/geoms', () => {
  it('checks if a point is inside a bbox', () => {
    const latLng = [0, 0];
    const bbox = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
      [-1, -1],
    ];

    expect(checkLocationInsideBbox(latLng, bbox)).toBe(true);
  });

  it('reverses latitude and longitude pairs', () => {
    const bounds = [
      [10, 20],
      [-10, -20],
    ];
    expect(reverseLatLng(bounds)).toEqual([
      [20, 10],
      [-20, -10],
    ]);
  });

  it('validates latitude and longitude ranges', () => {
    expect(validateLatLng(0, 0)).toBe(true);
    expect(validateLatLng(100, 0)).toBe(false);
    expect(validateLat(45)).toBe(true);
    expect(validateLat(100)).toBe(false);
    expect(validateLng(90)).toBe(true);
    expect(validateLng(200)).toBe(false);
  });
});
