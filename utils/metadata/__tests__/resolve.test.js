import axios from 'axios';
import { resolveMetadata } from '../resolve';
import { MetadataNotFoundError } from '../errors';

jest.mock('axios');

describe('resolveMetadata (fallback test matrix)', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('resolves Data-API-only metadata without ever querying Resource Watch', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Some dataset' } } },
      })
      .mockResolvedValueOnce({ data: { data: {} } });
    global.fetch = jest.fn();

    const result = await resolveMetadata('umd_tree_cover_loss');

    expect(result.metadata.title).toBe('Some dataset');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('falls back to Resource Watch when the Data API 404s (widget-only key)', async () => {
    const notFound = new Error('Not Found');
    notFound.response = { status: 404 };
    axios.get.mockRejectedValueOnce(notFound);

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ title: 'Tree cover loss (widget)' }),
    });

    const result = await resolveMetadata('widget_tree_cover_loss');

    expect(result).toEqual({ metadata: { title: 'Tree cover loss (widget)' } });
    expect(axios.get).toHaveBeenCalledTimes(1); // dataset only, no latest-metadata call
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('prefers the Data API when a key exists on both backends', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: { data: { metadata: { title: 'Dataset version' } } },
      })
      .mockResolvedValueOnce({ data: { data: {} } });
    global.fetch = jest.fn();

    const result = await resolveMetadata('overlapping_key');

    expect(result.metadata.title).toBe('Dataset version');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('throws MetadataNotFoundError when the key is missing from both backends', async () => {
    const notFound = new Error('Not Found');
    notFound.response = { status: 404 };
    axios.get.mockRejectedValueOnce(notFound);

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(resolveMetadata('nonexistent_key')).rejects.toThrow(
      MetadataNotFoundError
    );
  });

  it('throws MetadataNotFoundError when the Data API 404s and Resource Watch reports its 200 + { error } not-found shape', async () => {
    const notFound = new Error('Not Found');
    notFound.response = { status: 404 };
    axios.get.mockRejectedValueOnce(notFound);

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ error: 'not found' }),
    });

    await expect(resolveMetadata('nonexistent_key')).rejects.toThrow(
      MetadataNotFoundError
    );
  });

  it('propagates a Data API server failure without querying Resource Watch', async () => {
    const serverError = new Error('Internal Server Error');
    serverError.response = { status: 500 };
    axios.get.mockRejectedValueOnce(serverError);
    global.fetch = jest.fn();

    await expect(resolveMetadata('some_key')).rejects.toBe(serverError);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('propagates a Data API network/timeout failure without querying Resource Watch', async () => {
    const timeoutError = new Error('timeout of 30000ms exceeded');
    timeoutError.code = 'ECONNABORTED';
    axios.get.mockRejectedValueOnce(timeoutError);
    global.fetch = jest.fn();

    await expect(resolveMetadata('some_key')).rejects.toBe(timeoutError);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('still merges latest-version metadata over dataset metadata when resolved via the Data API', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          data: {
            metadata: { title: 'Tree cover loss', cautions: 'old caution' },
          },
        },
      })
      .mockResolvedValueOnce({
        data: { data: { cautions: 'new caution' } },
      });

    const result = await resolveMetadata('umd_tree_cover_loss');

    expect(result.metadata.cautions).toBe('new caution');
  });
});
