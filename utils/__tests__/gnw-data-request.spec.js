import { buildPayload, formatLegacyResponse } from '../gnw-data-request';

describe('gnw-data-request Utils', () => {
  describe('#buildPayload', () => {
    describe('Concatenation of admin levels', () => {
      it('builds the payload correctly with adm0 only', async () => {
        const result = buildPayload(
          { adm0: 'BRA' },
          { startYear: 2001, endYear: 2024 },
          30
        );
        expect(result.aoi.ids).toEqual(['BRA']);
      });
      it('builds the payload correctly with adm0 and adm1', async () => {
        const result = buildPayload(
          { adm0: 'BRA', adm1: 1 },
          { startYear: 2001, endYear: 2024 },
          30
        );
        expect(result.aoi.ids).toEqual(['BRA.1']);
      });
      it('builds the payload correctly with adm0, adm1 and adm2', async () => {
        const result = buildPayload(
          { adm0: 'BRA', adm1: 1, adm2: 2 },
          { startYear: 2001, endYear: 2024 },
          30
        );
        expect(result.aoi.ids).toEqual(['BRA.1.2']);
      });
    });
    describe('Canopy cover threshold', () => {
      it('builds the payload correctly with 0 threshold', async () => {
        const result = buildPayload(
          { adm0: 'BRA' },
          { startYear: 2001, endYear: 2024 },
          0
        );
        expect(result.canopy_cover).toEqual(0);
      });
      it('builds the payload correctly with 10 threshold', async () => {
        const result = buildPayload(
          { adm0: 'BRA' },
          { startYear: 2001, endYear: 2024 },
          10
        );
        expect(result.canopy_cover).toEqual(10);
      });
    });
    describe('Start and end years', () => {
      it('includes start and end years in the payload', async () => {
        const result = buildPayload(
          { adm0: 'BRA' },
          { startYear: 2005, endYear: 2015 },
          30
        );
        expect(result).toEqual(
          expect.objectContaining({
            start_year: '2005',
            end_year: '2015',
          })
        );
      });
    });
    describe('General payload structure', () => {
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
          start_year: '2001',
          end_year: '2024',
          forest_filter: 'natural_forest',
          intersections: [],
        });
      });
    });
  });

  describe('#formatLegacyResponse', () => {
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
        start_year: '2023',
        end_year: '2024',
        forest_filter: 'natural_forest',
        intersections: [],
      },
      result: {
        aoi_id: ['NZL.1', 'NZL.1'],
        aoi_type: ['admin', 'admin'],
        area_ha: [2556.634636171162, 1158.7797555327415],
        tree_cover_loss_year: [2024, 2023],
      },
      status: 'saved',
    };
    describe('Parsing Admin Levels from AOI IDs', () => {
      it('parses adm0, adm1, and adm2 correctly', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse);
        expect(result.data.data[0]).toEqual(
          expect.objectContaining({
            iso: 'NZL',
            adm1: 1,
            adm2: null,
          })
        );
      });
    });
    describe('Sorting by Year', () => {
      it('sorts the data by year in ascending order', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse);
        expect(result.data.data.map((d) => d.year)).toEqual([2023, 2024]);
      });
    });
    describe('Natural Forest Class Assignment', () => {
      it('assigns the correct natural forest class', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse);
        const classes = result.data.data.map(
          (d) => d.sbtn_natural_forests__class
        );
        expect(classes).toEqual(['Natural Forest', 'Natural Forest']);
      });
    });
    describe('Year Field Mapping', () => {
      it('maps the tree cover loss year to the year field', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse);
        expect(result.data.data).toEqual([
          expect.objectContaining({
            year: 2023,
            umd_tree_cover_loss__year: 2023,
          }),
          expect.objectContaining({
            year: 2024,
            umd_tree_cover_loss__year: 2024,
          }),
        ]);
      });
    });
    describe('Area Field Mapping', () => {
      it('maps the tree cover loss area to the area field', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse);

        expect(result.data.data).toEqual([
          expect.objectContaining({
            area: 1158.7797555327415,
            umd_tree_cover_loss__ha: 1158.7797555327415,
          }),
          expect.objectContaining({
            area: 2556.634636171162,
            umd_tree_cover_loss__ha: 2556.634636171162,
          }),
        ]);
      });
    });
    it('transform analytics data', async () => {
      const result = formatLegacyResponse(analyticsDataApiResponse);
      expect(result).toEqual({
        data: {
          data: [
            {
              iso: 'NZL',
              adm1: 1,
              adm2: null,
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1158.7797555327415,
              area: 1158.7797555327415,
              umd_tree_cover_loss__year: 2023,
              year: 2023,
              gfw_gross_emissions_co2e_all_gases__mg: undefined,
              emissions: undefined,
            },
            {
              iso: 'NZL',
              adm1: 1,
              adm2: null,
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 2556.634636171162,
              area: 2556.634636171162,
              umd_tree_cover_loss__year: 2024,
              year: 2024,
              gfw_gross_emissions_co2e_all_gases__mg: undefined,
              emissions: undefined,
            },
          ],
        },
        status: 'success',
      });
    });
  });
});
