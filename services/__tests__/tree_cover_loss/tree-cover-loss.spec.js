import { jest } from '@jest/globals';
import { getTreeCoverLossAnalytics } from '../../../utils/gnw-data-request';
import { getLossNaturalForest as originalGetLossNaturalForest } from '../../analysis-cached';
import { getLossNaturalForest } from '../../tree-cover-loss';

jest.mock('../../analysis-cached', () => {
  return {
    getLossNaturalForest: jest.fn(),
  };
});

jest.mock('../../../utils/gnw-data-request', () => {
  return {
    getTreeCoverLossAnalytics: jest.fn(),
  };
});

describe('getLossNaturalForest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses the legacy service if the request is a download', async () => {
    // act
    await getLossNaturalForest({
      type: 'country',
      adm0: 'BRA',
      pathname: '/dashboards/[[...location]]',
      locationType: 'country',
      threshold: 30,
      startYear: 2021,
      endYear: 2024,
      extentYear: 2010,
      token: {
        promise: {},
      },
      dashboard: true,
      status: 'saved',
      download: true,
    });

    expect(originalGetLossNaturalForest).toHaveBeenCalled();
  });

  it('Uses the legacy service still if the request is of type `country` and is NOT a download', async () => {
    // act
    await getLossNaturalForest({
      type: 'country',
      adm0: 'BRA',
      pathname: '/dashboards/[[...location]]',
      locationType: 'country',
      threshold: 30,
      startYear: 2021,
      endYear: 2024,
      extentYear: 2010,
      token: {
        promise: {},
      },
      dashboard: true,
      status: 'saved',
      download: false,
    });

    expect(originalGetLossNaturalForest).toHaveBeenCalled();
  });

  it("Calls the legacy service for country types that don't need to be downloaded", async () => {
    // act
    await getLossNaturalForest({
      type: 'country',
      adm0: 'BRA',
      pathname: '/dashboards/[[...location]]',
      locationType: 'country',
      threshold: 30,
      startYear: 2021,
      endYear: 2024,
      extentYear: 2010,
      token: {
        promise: {},
      },
      dashboard: true,
      status: 'saved',
      download: false,
    });

    expect(originalGetLossNaturalForest).toHaveBeenCalled();
  });

  it("Calls the new service for geostores that don't need to be downloaded", async () => {
    const geostore = {
      id: '351cfa10a38f86eeacad8a86ab7ce845',
      geojson: {
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [112.371093750044, -1.71406936894705],
                  [112.54687500004, -2.35087223984772],
                  [113.475219726588, -2.08739834101191],
                  [112.371093750044, -1.71406936894705],
                ],
              ],
            },
          },
        ],
        type: 'FeatureCollection',
      },
    };
    await getLossNaturalForest({
      type: 'geostore',
      adm0: '351cfa10a38f86eeacad8a86ab7ce845',
      pathname: '/dashboards/[[...location]]',
      locationType: 'geostore',
      geostore,
      threshold: 30,
      startYear: 2021,
      endYear: 2024,
      extentYear: 2010,
      token: {
        promise: {},
      },
      dashboard: true,
      status: 'saved',
      download: false,
    });

    expect(getTreeCoverLossAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({ geostore }),
      { startYear: 2021, endYear: 2024 },
      0
    );
  });
});
