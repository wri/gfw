import { jest } from '@jest/globals';

import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
} from 'services/country';

import { countryConfig } from '../location';

jest.mock('services/country', () => ({
  getCountriesProvider: jest.fn(),
  getRegionsProvider: jest.fn(),
  getSubRegionsProvider: jest.fn(),
}));

describe('countryConfig', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('adm0', () => {
    it('should return the correct country data', async () => {
      const mockCountries = [{ iso: 'BRA', name: 'Brazil' }];
      getCountriesProvider.mockResolvedValue({ data: mockCountries });

      const result = await countryConfig.adm0({ adm0: 'BRA' });

      expect(result).toEqual({
        locationName: 'Brazil',
        iso: 'BRA',
      });
      expect(getCountriesProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe('adm1', () => {
    it('should return the correct region and country data', async () => {
      const mockCountries = [{ iso: 'BRA', name: 'Brazil' }];
      const mockRegions = [{ id: 'BRA.25_', name: 'São Paulo', iso: 'BRA' }];

      getCountriesProvider.mockResolvedValue({ data: mockCountries });
      getRegionsProvider.mockResolvedValue({ data: mockRegions });

      const result = await countryConfig.adm1({ adm0: 'BRA', adm1: '25' });

      expect(result).toEqual({
        locationName: 'São Paulo, Brazil',
        id: 'BRA.25_',
        iso: 'BRA',
      });
      expect(getCountriesProvider).toHaveBeenCalledTimes(1);
      expect(getRegionsProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe('adm2', () => {
    it('should return the correct sub-region, region, and country data', async () => {
      const mockCountries = [{ iso: 'BRA', name: 'Brazil' }];
      const mockRegions = [{ id: 'BRA.25_', name: 'São Paulo' }];
      const mockSubRegions = [{ id: 'BRA.25.390_', name: 'Osasco' }];

      getCountriesProvider.mockResolvedValue({ data: mockCountries });
      getRegionsProvider.mockResolvedValue({ data: mockRegions });
      getSubRegionsProvider.mockResolvedValue({ data: mockSubRegions });

      const result = await countryConfig.adm2({
        adm0: 'BRA',
        adm1: '25',
        adm2: '390',
      });

      expect(result).toEqual({
        locationName: 'Osasco, Brazil, São Paulo',
        id: 'BRA.25.390_',
      });
      expect(getCountriesProvider).toHaveBeenCalledTimes(1);
      expect(getRegionsProvider).toHaveBeenCalledTimes(1);
      expect(getSubRegionsProvider).toHaveBeenCalledTimes(1);
    });
  });
});
