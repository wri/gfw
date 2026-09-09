import { metadataWidgetRequest } from 'utils/request';

describe('metadataWidgetRequest', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();

    if (originalFetch) {
      global.fetch = originalFetch;
    } else {
      delete global.fetch;
    }
  });

  it('resolves successful widget metadata responses', async () => {
    const data = { metadata: { title: 'Tree cover loss' } };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {},
      json: jest.fn().mockResolvedValueOnce(data),
    });

    await expect(
      metadataWidgetRequest.get('widget_tree_cover_loss')
    ).resolves.toMatchObject({
      data,
      status: 200,
      statusText: 'OK',
    });
  });

  it('rejects non-2xx widget metadata responses with the API error', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      headers: {},
      json: jest.fn().mockResolvedValueOnce({
        error: 'Upstream metadata request failed',
      }),
    });

    await expect(
      metadataWidgetRequest.get('widget_tree_cover_loss')
    ).rejects.toThrow('Upstream metadata request failed');
  });

  it('rejects non-2xx responses without an error payload using the status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: {},
      json: jest.fn().mockResolvedValueOnce({}),
    });

    await expect(
      metadataWidgetRequest.get('widget_tree_cover_loss')
    ).rejects.toThrow('Request failed with status 404');
  });
});
