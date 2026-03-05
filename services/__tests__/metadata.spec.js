import { jest } from '@jest/globals';
import { metadataRequest, metadataWidgetRequest } from 'utils/request';
import { getMetadata } from 'services/metadata';

jest.mock('utils/request', () => ({
  metadataRequest: {
    get: jest.fn(),
  },
  metadataWidgetRequest: {
    get: jest.fn(),
  },
}));

describe('getMetadata', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses metadataWidgetRequest when metaType is "widget"', () => {
    metadataWidgetRequest.get.mockResolvedValueOnce({ data: {} });

    getMetadata('some-widget-slug', 'widget');

    expect(metadataWidgetRequest.get).toHaveBeenCalledWith('some-widget-slug');
    expect(metadataRequest.get).not.toHaveBeenCalled();
  });

  it('uses metadataRequest for non-widget meta types', () => {
    metadataRequest.get.mockResolvedValueOnce({ data: {} });

    getMetadata('some-dataset-slug', 'dataset');

    expect(metadataRequest.get).toHaveBeenCalledWith('some-dataset-slug');
    expect(metadataWidgetRequest.get).not.toHaveBeenCalled();
  });
});
