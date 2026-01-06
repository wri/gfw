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

  it('uses the updated service if the request is of type `country` and is NOT a download', async () => {
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

    expect(originalGetLossNaturalForest).not.toHaveBeenCalled();
  });

  it("calls the GNW data service for country types that don't need to be downloaded", async () => {
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

    expect(getTreeCoverLossAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        adm0: 'BRA',
        adm1: undefined,
        adm2: undefined,
      }),
      { startYear: 2001, endYear: 2024 },
      0
    );
  });
});
