import { jest } from '@jest/globals';
import { dataRequest } from '../../../utils/request';
import { getLossNaturalForest } from '../../analysis-cached';

jest.mock('../../../utils/request', () => {
  return {
    dataRequest: { get: jest.fn() },
  };
});

describe('getLossNaturalForest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('makes a call to the data api and adds `area`, `emissions`, and `year`', async () => {
    // arrange
    dataRequest.get.mockResolvedValueOnce({
      data: [
        {
          aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
          sbtn_natural_forests__class: 'Natural Forest',
          umd_tree_cover_loss__year: 2023,
          umd_tree_cover_loss__ha: 3070627.944982473,
          gfw_gross_emissions_co2e_all_gases__mg: 1398785973.642741,
        },
        {
          aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
          sbtn_natural_forests__class: 'Natural Forest',
          umd_tree_cover_loss__year: 2024,
          umd_tree_cover_loss__ha: 4435574.324661254,
          gfw_gross_emissions_co2e_all_gases__mg: 1817314276.7246742,
        },
        {
          aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
          sbtn_natural_forests__class: 'Non-Natural Forest',
          umd_tree_cover_loss__year: 2023,
          umd_tree_cover_loss__ha: 327571.28996749374,
          gfw_gross_emissions_co2e_all_gases__mg: 195078365.88840708,
        },
        {
          aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
          sbtn_natural_forests__class: 'Non-Natural Forest',
          umd_tree_cover_loss__year: 2024,
          umd_tree_cover_loss__ha: 282973.44824593404,
          gfw_gross_emissions_co2e_all_gases__mg: 170193888.0742313,
        },
        {
          aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
          sbtn_natural_forests__class: 'Unknown',
          umd_tree_cover_loss__year: 2023,
          umd_tree_cover_loss__ha: 703371.8651278677,
          gfw_gross_emissions_co2e_all_gases__mg: 209519602.75126565,
        },
        {
          aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
          sbtn_natural_forests__class: 'Unknown',
          umd_tree_cover_loss__year: 2024,
          umd_tree_cover_loss__ha: 661069.121257232,
          gfw_gross_emissions_co2e_all_gases__mg: 209225062.8424183,
        },
      ],
      status: 'success',
    });

    // act
    const result = await getLossNaturalForest({
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
    });

    // assert
    expect(dataRequest.get).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result).toEqual({
      status: 'success',
      data: {
        data: [
          {
            aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
            sbtn_natural_forests__class: 'Natural Forest',
            umd_tree_cover_loss__year: 2023,
            umd_tree_cover_loss__ha: 3070627.944982473,
            gfw_gross_emissions_co2e_all_gases__mg: 1398785973.642741,
            area: 3070627.944982473,
            emissions: 1398785973.642741,
            year: 2023,
          },
          {
            aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
            sbtn_natural_forests__class: 'Natural Forest',
            umd_tree_cover_loss__year: 2024,
            umd_tree_cover_loss__ha: 4435574.324661254,
            gfw_gross_emissions_co2e_all_gases__mg: 1817314276.7246742,
            area: 4435574.324661254,
            emissions: 1817314276.7246742,
            year: 2024,
          },
          {
            aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
            sbtn_natural_forests__class: 'Non-Natural Forest',
            umd_tree_cover_loss__year: 2023,
            umd_tree_cover_loss__ha: 327571.28996749374,
            gfw_gross_emissions_co2e_all_gases__mg: 195078365.88840708,
            area: 327571.28996749374,
            emissions: 195078365.88840708,
            year: 2023,
          },
          {
            aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
            sbtn_natural_forests__class: 'Non-Natural Forest',
            umd_tree_cover_loss__year: 2024,
            umd_tree_cover_loss__ha: 282973.44824593404,
            gfw_gross_emissions_co2e_all_gases__mg: 170193888.0742313,
            area: 282973.44824593404,
            emissions: 170193888.0742313,
            year: 2024,
          },
          {
            aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
            sbtn_natural_forests__class: 'Unknown',
            umd_tree_cover_loss__year: 2023,
            umd_tree_cover_loss__ha: 703371.8651278677,
            gfw_gross_emissions_co2e_all_gases__mg: 209519602.75126565,
            area: 703371.8651278677,
            emissions: 209519602.75126565,
            year: 2023,
          },
          {
            aoi_id: '351cfa10a38f86eeacad8a86ab7ce845',
            sbtn_natural_forests__class: 'Unknown',
            umd_tree_cover_loss__year: 2024,
            umd_tree_cover_loss__ha: 661069.121257232,
            gfw_gross_emissions_co2e_all_gases__mg: 209225062.8424183,
            area: 661069.121257232,
            emissions: 209225062.8424183,
            year: 2024,
          },
        ],
      },
    });
  });
});
