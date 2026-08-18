import axios from 'axios';
import { getDataApiMetadata } from '../data-api';
import { MetadataNotFoundError } from '../errors';

jest.mock('axios');

describe('getDataApiMetadata', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns normalized metadata, merging latest-version metadata over dataset metadata', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          data: {
            id: 'umd_tree_cover_loss',
            metadata: { title: 'Tree cover loss', cautions: 'old caution' },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: { cautions: 'new caution', update_frequency: 'Yearly' },
        },
      });

    const result = await getDataApiMetadata('umd_tree_cover_loss');

    expect(result).toEqual({
      id: 'umd_tree_cover_loss',
      metadata: {
        title: 'Tree cover loss',
        cautions: 'new caution',
        update_frequency: 'Yearly',
      },
    });
  });

  it('does not let a null latest-version value overwrite dataset-level metadata', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          data: { metadata: { cautions: 'dataset-level caution' } },
        },
      })
      .mockResolvedValueOnce({
        data: { data: { cautions: null } },
      });

    const result = await getDataApiMetadata('some_key');

    expect(result.metadata.cautions).toBe('dataset-level caution');
  });

  it('tolerates a 404 on the latest-version metadata request and still returns dataset metadata', async () => {
    const notFound = new Error('Not Found');
    notFound.response = { status: 404 };
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Some dataset' } } },
      })
      .mockRejectedValueOnce(notFound);

    const result = await getDataApiMetadata('some_key');

    expect(result.metadata.title).toBe('Some dataset');
  });

  it('propagates a non-404 failure on the latest-version metadata request instead of silently swallowing it', async () => {
    const serverError = new Error('Internal Server Error');
    serverError.response = { status: 500 };
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Some dataset' } } },
      })
      .mockRejectedValueOnce(serverError);

    await expect(getDataApiMetadata('some_key')).rejects.toBe(serverError);
  });

  it('propagates a network/timeout failure on the latest-version metadata request', async () => {
    const timeoutError = new Error('timeout of 30000ms exceeded');
    timeoutError.code = 'ECONNABORTED';
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Some dataset' } } },
      })
      .mockRejectedValueOnce(timeoutError);

    await expect(getDataApiMetadata('some_key')).rejects.toBe(timeoutError);
  });

  it('throws MetadataNotFoundError when the dataset itself is a 404', async () => {
    const error = new Error('Not Found');
    error.response = { status: 404 };
    axios.get.mockRejectedValueOnce(error);

    await expect(getDataApiMetadata('does_not_exist')).rejects.toThrow(
      MetadataNotFoundError
    );
  });

  it('rethrows non-404 dataset failures as-is, without querying latest metadata', async () => {
    const error = new Error('Internal Server Error');
    error.response = { status: 500 };
    axios.get.mockRejectedValueOnce(error);

    await expect(getDataApiMetadata('some_key')).rejects.toBe(error);
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
