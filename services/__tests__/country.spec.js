import { jest } from '@jest/globals';

import { dataRequest } from 'utils/request';

import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
  getFAOCountriesProvider,
  getCountryLinksProvider,
  getCategorisedCountries,
  getCountryLinksSerialized,
  GADM_DATASET,
} from 'services/country';
import countryLinks from 'services/country-links.json';

jest.mock('utils/request', () => ({
  dataRequest: {
    get: jest.fn(),
  },
}));

jest.mock('services/country-links.json', () => ({
  rows: [
    {
      iso: 'CMR',
      external_links:
        '[{  "title": "Interactive Forest Atlas of Cameroon",  "url": "http://cmr.forest-atlas.org/"}]',
    },
    {
      iso: 'CAF',
      external_links:
        '[{ "title": "Interactive Forest Atlas of Central African Republic",  "url": "http://caf.forest-atlas.org/"}]',
    },
  ],
}));

describe('country service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCountriesProvider', () => {
    it('should fetch countries data', async () => {
      const mockResponse = { data: [{ iso: 'BRA', name: 'Brazil' }] };
      dataRequest.get.mockResolvedValue(mockResponse);

      const result = await getCountriesProvider();

      expect(dataRequest.get).toHaveBeenCalledWith(
        `${GADM_DATASET}?sql=SELECT country AS name, gid_0 AS iso FROM gadm_administrative_boundaries WHERE adm_level = '0' AND gid_0 NOT IN ('Z01', 'Z02', 'Z03', 'Z04', 'Z05', 'Z06', 'Z07', 'Z08', 'Z09') ORDER BY country`
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getRegionsProvider', () => {
    it('should fetch regions data based on adm0', async () => {
      const mockResponse = { data: [{ id: 'BRA.25', name: 'São Paulo' }] };
      dataRequest.get.mockResolvedValue(mockResponse);

      const result = await getRegionsProvider({ adm0: 'BRA' });

      expect(dataRequest.get).toHaveBeenCalledWith(
        `${GADM_DATASET}?sql=SELECT name_1 AS name, gid_1 AS id FROM gadm_administrative_boundaries WHERE adm_level='1' AND gid_0 = 'BRA' ORDER BY name`,
        { cancelToken: undefined }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSubRegionsProvider', () => {
    it('should fetch sub-regions data based on adm0 and adm1', async () => {
      const mockResponse = { data: [{ id: 'BRA.25.390', name: 'Osasco' }] };
      dataRequest.get.mockResolvedValue(mockResponse);

      const result = await getSubRegionsProvider({ adm0: 'BRA', adm1: '25' });

      expect(dataRequest.get).toHaveBeenCalledWith(
        `${GADM_DATASET}?sql=SELECT gid_2 as id, name_2 as name FROM gadm_administrative_boundaries WHERE gid_0 = 'BRA' AND gid_1 = 'BRA.25_1' AND adm_level='2' AND type_2 NOT IN ('Waterbody', 'Water body', 'Water Body') ORDER BY name`,
        { cancelToken: undefined }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getFAOCountriesProvider', () => {
    it('should fetch FAO countries data', async () => {
      const mockResponse = { data: [{ iso: 'BRA', name: 'BRA' }] };
      dataRequest.get.mockResolvedValue(mockResponse);

      const result = await getFAOCountriesProvider();

      expect(dataRequest.get).toHaveBeenCalledWith(
        'dataset/fao_forest_extent/v2020/query/json?sql=SELECT iso, country AS name FROM data WHERE year = 2020'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCountryLinksProvider', () => {
    it('should return country links', async () => {
      const result = await getCountryLinksProvider();

      expect(result).toEqual(countryLinks);
    });
  });

  describe('getCountryLinksSerialized', () => {
    it('should return serialized country links', async () => {
      const result = await getCountryLinksSerialized();

      expect(result).toEqual({
        CMR: [
          {
            title: 'Interactive Forest Atlas of Cameroon',
            url: 'http://cmr.forest-atlas.org/',
          },
        ],
        CAF: [
          {
            title: 'Interactive Forest Atlas of Central African Republic',
            url: 'http://caf.forest-atlas.org/',
          },
        ],
      });
    });
  });

  describe('getCategorisedCountries', () => {
    it('should fetch categorised countries data', async () => {
      const mockGadmResponse = { data: [{ iso: 'BRA', name: 'BRA' }] };
      const mockFaoResponse = { data: [{ iso: 'BRA', name: 'BRA' }] };

      dataRequest.get
        .mockResolvedValueOnce(mockGadmResponse)
        .mockResolvedValueOnce(mockFaoResponse);

      const result = await getCategorisedCountries();

      expect(result).toEqual({
        gadmCountries: mockGadmResponse.data,
        faoCountries: mockFaoResponse.data,
        countries: mockGadmResponse.data,
      });
    });

    it('should return categorised countries data as options', async () => {
      const mockGadmResponse = { data: [{ iso: 'BRA', name: 'BRA' }] };
      const mockFaoResponse = { data: [{ iso: 'BRA', name: 'BRA' }] };

      dataRequest.get
        .mockResolvedValueOnce(mockGadmResponse)
        .mockResolvedValueOnce(mockFaoResponse);

      const result = await getCategorisedCountries(true);

      expect(result).toEqual({
        gadmCountries: [{ label: 'BRA', value: 'BRA' }],
        faoCountries: [{ label: 'BRA', value: 'BRA' }],
        countries: [{ label: 'BRA', value: 'BRA' }],
      });
    });
  });
});
