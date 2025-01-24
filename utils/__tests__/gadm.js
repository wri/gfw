import { beforeAll } from '@jest/globals';
import { getGadmId, parseGadmId, getGadmLocationByLevel } from 'utils/gadm';

describe('getGadmId', () => {
  it('should generate the correct GADM ID for country and region levels', () => {
    expect(getGadmId('BRA', '25')).toBe('BRA.25_1');
  });

  it('should generate the correct GADM ID for country, region, and sub-region levels', () => {
    expect(getGadmId('BRA', '25', '390')).toBe('BRA.25.390_1');
  });
});

describe('parseGadmId', () => {
  it('should parse a full GADM ID correctly', () => {
    const gid = 'BRA.25.390';
    expect(parseGadmId(gid)).toEqual({
      adm0: 'BRA',
      adm1: 25,
      adm2: 390,
    });
  });

  it('should parse a GADM ID with only country and region correctly', () => {
    const gid = 'BRA.25_1';
    expect(parseGadmId(gid)).toEqual({
      adm0: 'BRA',
      adm1: 25,
      adm2: undefined,
    });
  });
});

describe('getGadmLocationByLevel', () => {
  let location;

  beforeAll(() => {
    location = {
      gid_0: 'BRA',
      gid_1: 'BRA.25_1',
      gid_2: 'BRA.25.390_1',
    };
  });

  it('should return location with parsed GADM ID for adm_level 0', () => {
    expect(getGadmLocationByLevel({ adm_level: 0, ...location })).toEqual({
      type: 'country',
      adm0: 'BRA',
      adm1: undefined,
      adm2: undefined,
    });
  });

  it('should return location with parsed GADM ID for level 1', () => {
    expect(getGadmLocationByLevel({ adm_level: 1, ...location })).toEqual({
      type: 'country',
      adm0: 'BRA',
      adm1: 25,
      adm2: undefined,
    });
  });

  it('should return location with parsed GADM ID for level 2', () => {
    expect(getGadmLocationByLevel({ adm_level: 2, ...location })).toEqual({
      type: 'country',
      adm0: 'BRA',
      adm1: 25,
      adm2: 390,
    });
  });
});
