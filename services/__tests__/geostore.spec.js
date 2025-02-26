import { jest } from '@jest/globals';

import { getGeostore, saveGeostore } from 'services/geostore';
import { getDatasetQuery, getDatasetGeostore } from 'services/datasets';

import { dataRequest, apiRequest } from 'utils/request';

jest.mock('utils/request', () => ({
  dataRequest: {
    get: jest.fn(),
  },
  apiRequest: jest.fn(),
}));

jest.mock('services/datasets', () => ({
  getDatasetQuery: jest.fn(),
  getDatasetGeostore: jest.fn(),
}));

describe('getGeostore', () => {
  it('should return null if type or adm0 is missing', () => {
    expect(getGeostore({ type: '', adm0: 'BRA' })).toBeNull();
    expect(getGeostore({ type: 'country', adm0: '' })).toBeNull();
  });

  it('should return false for an invalid type', () => {
    expect(getGeostore({ type: 'invalid', adm0: 'BRA' })).toBe(false);
  });
});

describe('fetchGeostore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch geostore for a country', async () => {
    const mockResponse = {
      data: {
        attributes: {
          geojson: { type: 'FeatureCollection', features: [] },
          hash: '123abc',
          bbox: [1, 2, 3, 4],
        },
      },
    };

    dataRequest.get.mockResolvedValueOnce(mockResponse);

    const result = await getGeostore({ type: 'country', adm0: 'BRA' });

    expect(result).toEqual({
      geojson: mockResponse.data.attributes.geojson,
      id: mockResponse.data.attributes.hash,
      bbox: mockResponse.data.attributes.bbox,
    });

    expect(dataRequest.get).toHaveBeenCalledWith(
      'https://data-api.globalforestwatch.org/geostore/admin/BRA?source[provider]=gadm&source[version]=3.6&simplify=0.1',
      expect.any(Object)
    );
  });

  it('should fetch geostore for a region with adm0 and adm1', async () => {
    const mockResponse = {
      data: {
        attributes: {
          geojson: { type: 'FeatureCollection', features: [] },
          hash: '456def',
          bbox: [10, 20, 30, 40],
        },
      },
    };

    dataRequest.get.mockResolvedValueOnce(mockResponse);

    const result = await getGeostore({
      type: 'country',
      adm0: 'BRA',
      adm1: '25',
    });

    expect(result).toEqual({
      geojson: mockResponse.data.attributes.geojson,
      id: mockResponse.data.attributes.hash,
      bbox: mockResponse.data.attributes.bbox,
    });

    expect(dataRequest.get).toHaveBeenCalledWith(
      'https://data-api.globalforestwatch.org/geostore/admin/BRA/25?source[provider]=gadm&source[version]=3.6&simplify=0.01',
      expect.any(Object)
    );
  });
});

describe('getWDPAGeostore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getDatasetQuery and getDatasetGeostore with correct parameters', async () => {
    const mockQueryResponse = [
      {
        gfw_geostore_id: '123abc',
        name: 'Test Area',
        marine: 1,
        status: 'active',
        status_yr: 2025,
      },
    ];
    getDatasetQuery.mockResolvedValueOnce(mockQueryResponse);

    const mockGeostoreResponse = {
      gfw_geojson: { type: 'FeatureCollection', features: [] },
      gfw_area__ha: 1000,
      gfw_bbox: [0, 0, 10, 10],
    };
    getDatasetGeostore.mockResolvedValueOnce(mockGeostoreResponse);

    const id = 'BRA';
    const token = 'fake-token';

    const result = await getGeostore({ type: 'wdpa', adm0: 'BRA', token });

    expect(getDatasetQuery).toHaveBeenCalledWith({
      dataset: 'wdpa_protected_areas',
      sql: `SELECT gfw_geostore_id, name, marine::int, status, status_yr FROM data WHERE wdpaid = '${id}'`,
      token,
    });

    expect(getDatasetGeostore).toHaveBeenCalledWith({
      dataset: 'wdpa_protected_areas',
      geostoreId: '123abc',
      token,
    });

    expect(result).toEqual({
      id: '123abc',
      location: mockQueryResponse[0],
      geojson: mockGeostoreResponse.gfw_geojson,
      areaHa: mockGeostoreResponse.gfw_area__ha,
      bbox: mockGeostoreResponse.gfw_bbox,
    });
  });
});

describe('saveGeostore', () => {
  it('should POST the geostore object', async () => {
    const mockResponse = { data: { id: '123abc' } };
    const mockOnUploadProgress = jest.fn();
    const mockOnDownloadProgress = jest.fn();
    const mockGeojson = { type: 'FeatureCollection', features: [] };

    apiRequest.mockResolvedValueOnce(mockResponse);

    const result = await saveGeostore(
      mockGeojson,
      mockOnUploadProgress,
      mockOnDownloadProgress
    );

    expect(apiRequest).toHaveBeenCalledWith({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: { geojson: mockGeojson },
      url: '/geostore/',
      onUploadProgress: mockOnUploadProgress,
      onDownloadProgress: mockOnDownloadProgress,
    });

    expect(result).toEqual(mockResponse);
  });
});
