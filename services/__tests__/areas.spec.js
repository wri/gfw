import { jest } from '@jest/globals';

import { getArea, getAreas } from '../areas';
import { apiAuthRequest } from '../../utils/request';

jest.mock('../../utils/request', () => ({
  apiAuthRequest: {
    get: jest.fn(),
  },
}));

describe('Areas Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  describe('Getting a Single Area', () => {
    describe('The Request to the API', () => {
      it('should add source params for gadm 4.1', async () => {
        // arrange
        apiAuthRequest.get.mockResolvedValueOnce({
          data: { data: { attributes: {} } },
        });

        // act
        await getArea('abcdef123456789');

        // assert
        expect(apiAuthRequest.get).toHaveBeenCalledWith(
          '/v2/area/abcdef123456789?source[provider]=gadm&source[version]=4.1',
          {
            headers: {},
          }
        );
      });
    });
  });

  describe('Getting Multiple Areas', () => {
    describe('The Request to the API', () => {
      it('should add source params for gadm 4.1', async () => {
        // arrange
        apiAuthRequest.get.mockResolvedValueOnce({
          data: { data: [{ attributes: {} }] },
        });

        // act
        await getAreas();

        // assert
        expect(apiAuthRequest.get).toHaveBeenCalledWith(
          '/v2/area?source[provider]=gadm&source[version]=4.1'
        );
      });
    });
  });
});
