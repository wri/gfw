/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { tropicsIntersection } from '../intersections';

jest.mock('mapbox-gl', () => {
  class LngLat {
    constructor(lng, lat) {
      this.lng = lng;
      this.lat = lat;
    }
  }

  class LngLatBounds {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
      this.lng = 0;
      this.lat = 0;
    }

    getCenter() {
      return { lng: 0, lat: 0 };
    }

    // Always report that the center is contained to mark an intersection
    contains() {
      return true;
    }
  }

  return { LngLat, LngLatBounds };
});

describe('utils/intersections', () => {
  it('adds a tropics flag when AOI dashboard intersects tropics', () => {
    const params = {
      locationType: 'aoi',
      pathname: '/dashboards/forest',
    };

    const geostore = {
      id: 'geo-1',
      bbox: [-10, -10, 10, 10],
    };

    const result = tropicsIntersection(params, geostore);

    expect(result.tropics).toBe(true);
  });

  it('returns the original geostore for non-AOI or non-dashboard locations', () => {
    const params = {
      locationType: 'country',
      pathname: '/map',
    };
    const geostore = { id: 'geo-2' };

    const result = tropicsIntersection(params, geostore);
    expect(result).toBe(geostore);
  });
});
