import { getResourceWatchMetadata } from '../resource-watch';
import { MetadataNotFoundError } from '../errors';

describe('getResourceWatchMetadata', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('returns the payload normalized into the shared { metadata } contract', async () => {
    const payload = { title: 'Tree cover loss (widget)' };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => payload,
    });

    const result = await getResourceWatchMetadata('widget_tree_cover_loss');

    expect(result).toEqual({ metadata: payload });
  });

  it('throws MetadataNotFoundError on a 404', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    await expect(getResourceWatchMetadata('does_not_exist')).rejects.toThrow(
      MetadataNotFoundError
    );
  });

  it('throws MetadataNotFoundError when the response is a 200 with an { error } body', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ error: 'not found' }),
    });

    await expect(getResourceWatchMetadata('does_not_exist')).rejects.toThrow(
      MetadataNotFoundError
    );
  });

  it('throws a plain Error (not MetadataNotFoundError) on an upstream server failure', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    let caughtError;
    try {
      await getResourceWatchMetadata('some_key');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeDefined();
    expect(caughtError).not.toBeInstanceOf(MetadataNotFoundError);
    expect(caughtError.message).toMatch(/status 500/);
  });
});
