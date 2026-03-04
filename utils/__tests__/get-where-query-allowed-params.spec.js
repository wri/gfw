import ALLOWED_PARAMS from '../get-where-query-allowed-params';

describe('utils/get-where-query-allowed-params', () => {
  it('includes expected allowed params for annual dataset', () => {
    expect(ALLOWED_PARAMS.annual).toEqual(
      expect.arrayContaining(['adm0', 'adm1', 'adm2', 'threshold'])
    );
  });

  it('includes confirmed alert flag for integrated_alerts and glad datasets', () => {
    expect(ALLOWED_PARAMS.integrated_alerts).toEqual(
      expect.arrayContaining(['is__confirmed_alert'])
    );
    expect(ALLOWED_PARAMS.glad).toEqual(
      expect.arrayContaining(['is__confirmed_alert'])
    );
  });

  it('includes confidence for viirs dataset', () => {
    expect(ALLOWED_PARAMS.viirs).toEqual(
      expect.arrayContaining(['confidence'])
    );
  });
});
