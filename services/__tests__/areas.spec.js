import { jest } from '@jest/globals';

import { getArea, getAreas, saveArea, deleteArea } from '../areas';
import { apiAuthRequest } from '../../utils/request';
import { trackEvent } from '../../utils/analytics';

jest.mock('../../utils/request', () => {
  const mockApiAuthRequest = jest.fn(() => {
    return Promise.resolve({});
  });

  mockApiAuthRequest.get = jest.fn(() => Promise.resolve({}));
  mockApiAuthRequest.delete = jest.fn(() => Promise.resolve({}));

  return {
    apiAuthRequest: mockApiAuthRequest,
  };
});

jest.mock('../../utils/analytics', () => ({
  trackEvent: jest.fn(),
}));

describe('Areas Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Getting a Single Area', () => {
    describe('The Request to the API', () => {
      it('should add source params for gadm 3.6', async () => {
        // arrange
        apiAuthRequest.get.mockResolvedValueOnce({
          data: { data: { attributes: {} } },
        });

        // act
        await getArea('abcdef123456789');

        // assert
        expect(apiAuthRequest.get).toHaveBeenCalledWith(
          '/v2/area/abcdef123456789?source[provider]=gadm&source[version]=3.6',
          {
            headers: {},
          }
        );
      });
    });
  });

  describe('Getting Multiple Areas', () => {
    describe('The Request to the API', () => {
      it('should add source params for gadm 3.6', async () => {
        // arrange
        apiAuthRequest.get.mockResolvedValueOnce({
          data: { data: [{ attributes: {} }] },
        });

        // act
        await getAreas();

        // assert
        expect(apiAuthRequest.get).toHaveBeenCalledWith(
          '/v2/area?source[provider]=gadm&source[version]=3.6'
        );
      });

      it('should return a valid array containing area item', async () => {
        // arrange
        apiAuthRequest.get.mockResolvedValueOnce({
          data: {
            data: [
              {
                type: 'area',
                id: '67892867738cd20016c88173',
                attributes: {
                  name: 'Brazil',
                  admin: {
                    adm0: 'BRA',
                    source: {
                      provider: 'gadm',
                      version: '3.6',
                    },
                  },
                  iso: {
                    country: 'BRA',
                    source: {
                      provider: 'gadm',
                      version: '3.6',
                    },
                  },
                },
              },
            ],
          },
        });

        // act
        const result = await getAreas();

        // assert
        expect(result).toEqual([
          {
            id: '67892867738cd20016c88173',
            name: 'Brazil',
            admin: {
              adm0: 'BRA',
              source: {
                provider: 'gadm',
                version: '3.6',
              },
            },
            iso: {
              country: 'BRA',
              source: {
                provider: 'gadm',
                version: '3.6',
              },
            },
            use: {},
            userArea: true,
          },
        ]);
      });
    });
  });

  describe('Saving an Area', () => {
    describe('When creating a new area', () => {
      it('should send a POST request and track the event', async () => {
        // arrange
        const mockData = { name: 'New Area' };
        apiAuthRequest.mockResolvedValueOnce({
          data: {
            data: { id: 'newarea123', attributes: { name: 'New Area' } },
          },
        });

        // act
        const result = await saveArea(mockData);

        // assert
        expect(apiAuthRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'POST',
            url: '/v2/area',
            data: mockData,
          })
        );

        expect(trackEvent).toHaveBeenCalledWith({
          category: 'User AOIs',
          action: 'User saves aoi',
          label: 'newarea123',
        });
        expect(result).toEqual({
          id: 'newarea123',
          name: 'New Area',
          userArea: true,
        });
      });
    });

    describe('When updating an existing area', () => {
      it('should send a PATCH request and track the event', async () => {
        // arrange
        const mockData = { id: 'updatearea456', name: 'Updated Area' };
        apiAuthRequest.mockResolvedValueOnce({
          data: {
            data: { id: 'updatearea456', attributes: { name: 'Updated Area' } },
          },
        });

        // act
        const result = await saveArea(mockData);

        // assert
        expect(apiAuthRequest).toHaveBeenCalledWith(
          expect.objectContaining({
            method: 'PATCH',
            url: '/v2/area/updatearea456',
            data: mockData,
          })
        );
        expect(trackEvent).toHaveBeenCalledWith({
          category: 'User AOIs',
          action: 'User edits aoi',
          label: 'updatearea456',
        });
        expect(result).toEqual({
          id: 'updatearea456',
          name: 'Updated Area',
          userArea: true,
        });
      });
    });
  });

  describe('Deleting an Area', () => {
    it('should send a DELETE request and track the event', async () => {
      // arrange
      const areaId = 'deletearea789';
      apiAuthRequest.delete.mockResolvedValueOnce();

      // act
      await deleteArea(areaId);

      // assert
      expect(apiAuthRequest.delete).toHaveBeenCalledWith(
        '/v2/area/deletearea789'
      );
      expect(trackEvent).toHaveBeenCalledWith({
        category: 'User AOIs',
        action: 'User deletes aoi',
        label: 'deletearea789',
      });
    });
  });
});
