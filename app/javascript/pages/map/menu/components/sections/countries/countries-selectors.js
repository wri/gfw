import { createSelector } from 'reselect';

export const getData = createSelector([], () => [
  {
    name: 'SELECT COUNTRY',
    layers: [
      {
        name: 'Brazil land cover',
        description: '(2000-2016, MapBiomas)',
        slugs: ['umd_as_it_happens', 'places_to_watch'],
        meta: 'umd_landsat_alerts'
      },
      {
        name: 'Brazil biomes',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      },
      {
        name: 'Brazil indigenous lands',
        slugs: ['forma_month_3'],
        meta: 'forma_250_alerts'
      }
    ]
  },
  {
    text:
      'User from <b>Brazil</b>? <a href="#">Add your own data</a> to the Global Forest Watch interactive map.'
  }
]);
