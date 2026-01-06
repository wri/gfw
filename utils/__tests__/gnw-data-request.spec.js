import {
  buildPayload,
  formatLegacyResponse,
  getTreeCoverLossAnalytics,
} from '../gnw-data-request';

describe('gnw-data-request utils', () => {
  xit('makes the gnw analytics call', async () => {
    const result = await getTreeCoverLossAnalytics(
      { adm0: 'BRA' },
      { startYear: 2001, endYear: 2024 },
      0
    );
    expect(result).toEqual('gary');
  });

  describe('buildPayload', () => {
    it('builds the payload correctly', async () => {
      const result = buildPayload(
        { adm0: 'BRA', adm1: 1 },
        { startYear: 2001, endYear: 2024 },
        30
      );
      expect(result).toEqual({
        aoi: {
          ids: ['BRA.1'],
          provider: 'gadm',
          type: 'admin',
          version: '4.1',
        },
        canopy_cover: 30,
        end_year: '2024',
        forest_filter: 'natural_forest',
        intersections: [],
        start_year: '2001',
      });
    });
  });

  describe('transformAnalyticsData', () => {
    it('transform analytics data', async () => {
      const analyticsDataApiResponse = {
        message: 'Analysis completed successfully.',
        metadata: {
          _analytics_name: 'tree_cover_loss',
          _version: '20250912',
          aoi: {
            ids: ['NZL.1'],
            provider: 'gadm',
            type: 'admin',
            version: '4.1',
          },
          canopy_cover: 10,
          end_year: '2024',
          forest_filter: 'primary_forest',
          intersections: [],
          start_year: '2001',
        },
        result: {
          aoi_id: [
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
            'NZL.1',
          ],
          aoi_type: [
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
            'admin',
          ],
          area_ha: [
            2556.634636171162, 1158.7797555327415, 1969.2792681455612,
            1320.579611968249, 1257.76527672261, 1499.2215265706182,
            1827.7269138991833, 1636.352021470666, 1728.135644249618,
            1449.5788154751062, 1133.7870344221592, 1757.6983755789697,
            2305.6131632886827, 1504.5436458401382, 1408.9320944286883,
            1641.2402835600078, 1109.0992141067982, 1244.5108942128718,
            1147.0571401715279, 1440.2631400935352, 1836.7907093465328,
            1911.3393810801208, 1142.0626455694437, 1862.3853544928133,
          ],
          carbon_emissions_MgCO2e: null,
          tree_cover_loss_year: [
            2002, 2009, 2014, 2020, 2022, 2008, 2005, 2007, 2013, 2021, 2024,
            2004, 2001, 2006, 2010, 2012, 2015, 2016, 2017, 2018, 2023, 2003,
            2011, 2019,
          ],
        },
        status: 'saved',
      };

      const result = formatLegacyResponse(analyticsDataApiResponse);
      expect(result).toEqual({
        data: {
          data: [
            {
              area: 2305.6131632886827,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 2305.6131632886827,
              umd_tree_cover_loss__year: 2001,
              year: 2001,
            },
            {
              area: 2556.634636171162,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 2556.634636171162,
              umd_tree_cover_loss__year: 2002,
              year: 2002,
            },
            {
              area: 1911.3393810801208,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1911.3393810801208,
              umd_tree_cover_loss__year: 2003,
              year: 2003,
            },
            {
              area: 1757.6983755789697,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1757.6983755789697,
              umd_tree_cover_loss__year: 2004,
              year: 2004,
            },
            {
              area: 1827.7269138991833,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1827.7269138991833,
              umd_tree_cover_loss__year: 2005,
              year: 2005,
            },
            {
              area: 1504.5436458401382,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1504.5436458401382,
              umd_tree_cover_loss__year: 2006,
              year: 2006,
            },
            {
              area: 1636.352021470666,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1636.352021470666,
              umd_tree_cover_loss__year: 2007,
              year: 2007,
            },
            {
              area: 1499.2215265706182,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1499.2215265706182,
              umd_tree_cover_loss__year: 2008,
              year: 2008,
            },
            {
              area: 1158.7797555327415,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1158.7797555327415,
              umd_tree_cover_loss__year: 2009,
              year: 2009,
            },
            {
              area: 1408.9320944286883,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1408.9320944286883,
              umd_tree_cover_loss__year: 2010,
              year: 2010,
            },
            {
              area: 1142.0626455694437,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1142.0626455694437,
              umd_tree_cover_loss__year: 2011,
              year: 2011,
            },
            {
              area: 1641.2402835600078,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1641.2402835600078,
              umd_tree_cover_loss__year: 2012,
              year: 2012,
            },
            {
              area: 1728.135644249618,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1728.135644249618,
              umd_tree_cover_loss__year: 2013,
              year: 2013,
            },
            {
              area: 1969.2792681455612,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1969.2792681455612,
              umd_tree_cover_loss__year: 2014,
              year: 2014,
            },
            {
              area: 1109.0992141067982,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1109.0992141067982,
              umd_tree_cover_loss__year: 2015,
              year: 2015,
            },
            {
              area: 1244.5108942128718,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1244.5108942128718,
              umd_tree_cover_loss__year: 2016,
              year: 2016,
            },
            {
              area: 1147.0571401715279,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1147.0571401715279,
              umd_tree_cover_loss__year: 2017,
              year: 2017,
            },
            {
              area: 1440.2631400935352,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1440.2631400935352,
              umd_tree_cover_loss__year: 2018,
              year: 2018,
            },
            {
              area: 1862.3853544928133,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1862.3853544928133,
              umd_tree_cover_loss__year: 2019,
              year: 2019,
            },
            {
              area: 1320.579611968249,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1320.579611968249,
              umd_tree_cover_loss__year: 2020,
              year: 2020,
            },
            {
              area: 1449.5788154751062,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1449.5788154751062,
              umd_tree_cover_loss__year: 2021,
              year: 2021,
            },
            {
              area: 1257.76527672261,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1257.76527672261,
              umd_tree_cover_loss__year: 2022,
              year: 2022,
            },
            {
              area: 1836.7907093465328,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1836.7907093465328,
              umd_tree_cover_loss__year: 2023,
              year: 2023,
            },
            {
              area: 1133.7870344221592,
              iso: 'NZL.1',
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1133.7870344221592,
              umd_tree_cover_loss__year: 2024,
              year: 2024,
            },
          ],
        },
        status: 'success',
      });
    });
  });
});
