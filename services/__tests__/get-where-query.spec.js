import { getWHEREQuery } from '../get-where-query';

describe('getWHEREQuery', () => {
  it('should return an string with each parameter separated by AND', () => {
    const params = {
      type: 'country',
      adm0: 'BRA',
      locationType: 'country',
      extentYear: 2000,
      thresh: 30,
      threshold: 30,
      forestType: 'plantations',
      dataset: 'annual',
    };
    const query = getWHEREQuery(params);
    const expected =
      "WHERE iso = 'BRA' AND umd_tree_cover_density_2000__threshold = 30 AND gfw_planted_forests__type IS NOT NULL ";

    expect(query).toEqual(expected);
  });

  // Tree Cover Density has a default threshold
  it('should not return threshold for Tree Cover Density', () => {
    const params = {
      type: 'country',
      adm0: 'PER',
      locationType: 'country',
      extentYear: 2020,
      thresh: '40',
      threshold: 40, // passing threshold as parameter from tropical tree cover layer
      dataset: 'treeCoverDensity',
    };

    const query = getWHEREQuery(params);
    const expected = "WHERE iso = 'PER' ";

    expect(query).toEqual(expected);
  });
});
