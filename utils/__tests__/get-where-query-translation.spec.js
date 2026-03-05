import { translateParameterKey } from '../get-where-query-translation';

describe('utils/get-where-query-translation', () => {
  it('translates confidence to confidence__cat', () => {
    expect(
      translateParameterKey('confidence', {
        type: 'country',
        dataset: 'annual',
      })
    ).toBe('confidence__cat');
  });

  it('translates adm params for country type', () => {
    const base = { type: 'country', dataset: 'annual' };
    expect(translateParameterKey('adm0', base)).toBe('iso');
    expect(translateParameterKey('adm1', base)).toBe('adm1');
    expect(translateParameterKey('adm2', base)).toBe('adm2');
  });

  it('translates threshold depending on dataset', () => {
    expect(
      translateParameterKey('threshold', {
        type: 'country',
        dataset: 'tropicalTreeCover',
      })
    ).toBe('wri_tropical_tree_cover__decile');

    expect(
      translateParameterKey('threshold', {
        type: 'country',
        dataset: 'annual',
      })
    ).toBe('umd_tree_cover_density_2000__threshold');
  });
});
