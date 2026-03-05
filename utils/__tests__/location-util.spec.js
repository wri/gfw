import {
  isMapPage,
  isDashboardPage,
  isEmbedPage,
  getActiveArea,
  getDataLocation,
  buildFullLocationName,
  locationLevelToStr,
} from '../location';

describe('utils/location', () => {
  it('detects map, dashboard and embed pages from pathname', () => {
    const location = { pathname: '/map' };
    expect(isMapPage(location)).toBe(true);
    expect(isDashboardPage(location)).toBe(false);
    expect(isEmbedPage(location)).toBe(false);

    const dashboard = { pathname: '/dashboards/forest' };
    expect(isDashboardPage(dashboard)).toBe(true);

    const embed = { pathname: '/embed/widget' };
    expect(isEmbedPage(embed)).toBe(true);
  });

  it('gets the active area based on adm0 or subscriptionId', () => {
    const state = {
      location: {
        payload: { adm0: 'area-1' },
      },
      areas: {
        data: [
          { id: 'area-1', name: 'Area 1' },
          { id: 'area-2', name: 'Area 2' },
        ],
      },
    };

    const active = getActiveArea(state);
    expect(active).toEqual({ id: 'area-1', name: 'Area 1' });
  });

  it('builds a full location object for data fetching', () => {
    const state = {
      location: {
        pathname: '/dashboards/aoi',
        payload: {
          type: 'aoi',
          adm0: 'area-1',
        },
      },
      areas: {
        data: [
          {
            id: 'area-1',
            location: { adm0: 'BRA', adm1: '1', adm2: '2' },
          },
        ],
      },
    };

    const dataLocation = getDataLocation(state);
    expect(dataLocation).toMatchObject({
      areaId: 'area-1',
      locationType: 'aoi',
      adm0: 'BRA',
      adm1: '1',
      adm2: '2',
      pathname: '/dashboards/aoi',
    });
  });

  it('builds full human-readable location names from admin lists', () => {
    const name = buildFullLocationName(
      { adm0: 'BRA', adm1: '1', adm2: '10' },
      {
        adm0s: [{ value: 'BRA', label: 'Brazil' }],
        adm1s: [{ value: 1, label: 'Amazonas' }],
        adm2s: [{ value: 10, label: 'Manaus' }],
      }
    );

    expect(name).toBe('Manaus, Amazonas, Brazil');
  });

  it('determines the location level as a string', () => {
    expect(locationLevelToStr({ type: 'global' })).toBe('global');
    expect(locationLevelToStr({ adm0: 'BRA' })).toBe('adm0');
    expect(locationLevelToStr({ adm0: 'BRA', adm1: 1 })).toBe('adm1');
    expect(locationLevelToStr({ adm0: 'BRA', adm1: 1, adm2: 2 })).toBe('adm2');
  });
});
