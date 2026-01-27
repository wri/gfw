import { buildPayload, formatLegacyResponse } from '../gnw-data-request';

describe('gnw-data-request Utils', () => {
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

  describe('#buildPayload', () => {
    describe('Geostore', () => {
      it('builds the payload correctly with geostore', async () => {
        const result = buildPayload({ geostore });
        expect(result.aoi.feature_collection.features[0].geometry).toEqual(
          geostore.geojson.features[0].geometry
        );
      });
    });
    describe('Geostore', () => {
      it('builds the payload correctly with geostore ID', async () => {
        const result = buildPayload({ geostore });
        expect(result.aoi.feature_collection.features[0].id).toEqual(
          geostore.id
        );
      });
    });
    describe('General payload structure', () => {
      it('builds the payload correctly', async () => {
        const result = buildPayload({ geostore });
        expect(result).toEqual({
          aoi: {
            feature_collection: geostore.geojson,
            type: 'feature_collection',
          },
          start_year: '2021',
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
          feature_collection: geostore.geojson,
          type: 'feature_collection',
        },
        canopy_cover: 10,
        start_year: '2023',
        end_year: '2024',
        forest_filter: 'natural_forest',
        intersections: [],
      },
      result: {
        aoi_id: ['my_aoi', 'my_aoi', 'my_aoi'],
        aoi_type: ['feature_collection', 'feature_collection'],
        natural_forests_class: [
          'Natural Forest',
          'Non-Natural Forest',
          'Natural Forest',
        ],
        area_ha: [2556.634636171162, 15.2, 1158.7797555327415],
        tree_cover_loss_year: [2024, 2024, 2023],
      },
      status: 'saved',
    };
    describe('Appending geostore ID legacy output', () => {
      it('Appends geostore ID correctly', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse, geostore);
        expect(result.data.data[0]).toEqual(
          expect.objectContaining({
            geostore__id: geostore.id,
          })
        );
      });
    });
    describe('Sorting by Year', () => {
      it('sorts the data by year in ascending order', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse, geostore);
        expect(result.data.data.map((d) => d.year)).toEqual([2023, 2024, 2024]);
      });
    });
    describe('Natural Forest Class Assignment', () => {
      it('assigns the correct natural forest class', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse, geostore);
        const classes = result.data.data.map(
          (d) => d.sbtn_natural_forests__class
        );
        expect(classes).toEqual([
          'Natural Forest',
          'Natural Forest',
          'Non-Natural Forest',
        ]);
      });
    });
    describe('Year Field Mapping', () => {
      it('maps the tree cover loss year to the year field', async () => {
        const result = formatLegacyResponse(analyticsDataApiResponse, geostore);
        expect(result.data.data).toEqual([
          expect.objectContaining({
            year: 2023,
            umd_tree_cover_loss__year: 2023,
          }),
          expect.objectContaining({
            year: 2024,
            umd_tree_cover_loss__year: 2024,
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
        const result = formatLegacyResponse(analyticsDataApiResponse, geostore);

        expect(result.data.data).toEqual([
          expect.objectContaining({
            area: 1158.7797555327415,
            umd_tree_cover_loss__ha: 1158.7797555327415,
          }),
          expect.objectContaining({
            area: 2556.634636171162,
            umd_tree_cover_loss__ha: 2556.634636171162,
          }),
          expect.objectContaining({
            area: 15.2,
            umd_tree_cover_loss__ha: 15.2,
          }),
        ]);
      });
    });
    it('transform analytics data', async () => {
      const result = formatLegacyResponse(analyticsDataApiResponse, geostore);
      expect(result).toEqual({
        data: {
          data: [
            {
              geostore__id: geostore.id,
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 1158.7797555327415,
              area: 1158.7797555327415,
              umd_tree_cover_loss__year: 2023,
              year: 2023,
              gfw_gross_emissions_co2e_all_gases__mg: undefined,
              emissions: undefined,
            },
            {
              geostore__id: geostore.id,
              sbtn_natural_forests__class: 'Natural Forest',
              umd_tree_cover_loss__ha: 2556.634636171162,
              area: 2556.634636171162,
              umd_tree_cover_loss__year: 2024,
              year: 2024,
              gfw_gross_emissions_co2e_all_gases__mg: undefined,
              emissions: undefined,
            },
            {
              geostore__id: geostore.id,
              sbtn_natural_forests__class: 'Non-Natural Forest',
              umd_tree_cover_loss__ha: 15.2,
              area: 15.2,
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
