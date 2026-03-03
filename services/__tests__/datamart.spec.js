import { jest } from '@jest/globals';
import { dataRequest } from 'utils/request';
import { fetchDataMart } from 'services/datamart';

jest.mock('utils/request', () => ({
  dataRequest: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('fetchDataMart', () => {
  const baseParams = {
    dataset: 'tree_cover_loss',
    geostoreId: 'geo-1',
    type: 'geostore',
    adm0: 'BRA',
    adm1: '1',
    adm2: '2',
    threshold: 30,
    isDownload: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns existing data when the datalink already exists', async () => {
    const existingResponse = {
      data: { status: 'done', result: 'ok' },
    };

    dataRequest.get
      // getDataByParams
      .mockResolvedValueOnce({
        data: {
          status: 200,
          link: 'https://data-api.test/v0/land/tree_cover_loss/link',
        },
      })
      // getDataFromLink inside retryRequest
      .mockResolvedValueOnce(existingResponse);

    const result = await fetchDataMart(baseParams);

    expect(dataRequest.get).toHaveBeenCalledTimes(2);
    expect(dataRequest.post).not.toHaveBeenCalled();
    expect(result).toBe(existingResponse);
  });

  it('creates a new datalink when the initial lookup returns 404', async () => {
    const createdResponse = {
      data: { status: 'done', result: 'created' },
    };

    // getDataByParams rejects with 404
    dataRequest.get.mockRejectedValueOnce({
      response: { status: 404, statusText: 'Not found' },
    });

    // createRequestByParams
    dataRequest.post.mockResolvedValueOnce({
      data: {
        link: 'https://data-api.test/v0/land/tree_cover_loss/new-link',
      },
    });

    // getDataFromLink inside retryRequest
    dataRequest.get.mockResolvedValueOnce(createdResponse);

    const result = await fetchDataMart(baseParams);

    expect(dataRequest.get).toHaveBeenCalledTimes(2);
    expect(dataRequest.post).toHaveBeenCalledTimes(1);
    expect(result).toBe(createdResponse);
  });
});
