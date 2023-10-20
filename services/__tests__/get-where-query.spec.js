import { getWHEREQuery } from '../get-where-query';

describe('getWHEREQuery', () => {
  describe('Tree Cover Density query', () => {
    let params;

    beforeEach(() => {
      params = {
        type: 'country',
        adm0: 'PER',
        pathname: '/map/[[...location]]',
        locationType: 'country',
        extentYear: 2020,
        url: 'https://tiles.globalforestwatch.org/wri_tropical_tree_cover/v2020/ttcd_{thresh}/{z}/{x}/{y}.png',
        thresh: '40',
        threshold: 40,
        confirmedOnly: 0,
        gladLOnly: 0,
        gladSOnly: 0,
        raddOnly: 0,
        startDayIndex: 0,
        endDayIndex: null,
        numberOfDays: null,
        dataset: 'treeCoverDensity',
      };
    });

    // Tree Cover Density has a default threshold
    it('should return the default threshold even when user set a different threshold', () => {
      const query = getWHEREQuery(params);
      const expected = "WHERE iso = 'PER' ";

      expect(query).toEqual(expected);
    });
  });
});
