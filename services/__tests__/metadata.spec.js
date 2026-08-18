import { jest } from '@jest/globals';
import { metadataRequest } from 'utils/request';
import { getMetadata } from 'services/metadata';

jest.mock('utils/request', () => ({
  metadataRequest: {
    get: jest.fn(),
  },
}));

describe('getMetadata', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses the unified metadataRequest for any metadata key', () => {
    metadataRequest.get.mockResolvedValueOnce({ data: {} });

    getMetadata('some-dataset-slug');

    expect(metadataRequest.get).toHaveBeenCalledWith('some-dataset-slug');
  });

  it('resolves a widget-shaped key identically to a dataset key, with no type argument', () => {
    metadataRequest.get.mockResolvedValueOnce({ data: {} });

    getMetadata('widget_tree_cover_loss');

    expect(metadataRequest.get).toHaveBeenCalledWith('widget_tree_cover_loss');
    expect(metadataRequest.get).toHaveBeenCalledTimes(1);
  });
});
