import { createSelector } from 'reselect';
import camelCase from 'lodash/camelCase';

const getDatasets = state => state.datasets || null;
const getCategory = state => state.category || null;

export const getParsedDatasets = createSelector([getDatasets, getCategory], (datasets, category) => {
  if (!datasets) return null;
  return datasets.filter(d => d.vocabulary && d.vocabulary.length && d.vocabulary[0].tags.indexOf(camelCase(category)) > -1).map(d => {
    const metadata = d.metadata && d.metadata.length && d.metadata[0];
    const { name, source } = metadata;
    return {
      name: name || d.name,
      description: source,
      id: d.id,
      layer: d.layer && d.layer.length && d.layer[0].id
    };
  });
});

export const getData = createSelector([], () => [
  {
    name: 'DEFORESTATION ALERTS',
    description: '(near real-time)',
    layers: [
      {
        name: 'GLAD alerts',
        description: '(weekly, 30m, select countries, UMD/GLAD)',
        slugs: ['umd_as_it_happens', 'places_to_watch'],
        meta: 'umd_landsat_alerts'
      },
      {
        name: 'FORMA alerts',
        description: '(daily, 250m, tropics, WRI/Google)',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      }
    ]
  },
  {
    layers: [
      {
        name: 'VIIRS active fires',
        description: '(daily, 375m, global, NASA)',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      }
    ]
  },
  {
    name: 'TREE COVER CHANGE',
    layers: [
      {
        name: 'Tree cover loss',
        description: '(annual, 30m, global, Hansen/UMD/Google/USGS/NASA)',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      },
      {
        name: 'Tree cover gain',
        description: '(12 years, 30m, global, Hansen/UMD/Google/USGS/NASA)',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      },
      {
        name: 'Peru MINAM tree cover loss',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      }
    ]
  }
]);
