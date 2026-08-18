import axios from 'axios';
import handler from 'pages/api/metadata/[...params]';

jest.mock('axios');

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Exercises the real route handler together with the real resolve.js and
// resolver modules (only axios/fetch are mocked) to guard against the
// original bug: a widget-only key routed through /api/metadata used to be
// rejected with a 400 before either upstream backend was even asked. Every
// other test in this suite mocks resolveMetadata itself, so this is the one
// place the full chain is exercised together.
describe('original bug regression: widget key via /api/metadata', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('reproduces the original bug scenario as fixed: widget_tree_cover_loss now resolves via Resource Watch fallback', async () => {
    const notFound = new Error('Not Found');
    notFound.response = { status: 404 };
    axios.get.mockRejectedValueOnce(notFound);

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ title: 'Tree cover loss' }),
    });

    const req = { query: { params: ['widget_tree_cover_loss'] } };
    const res = buildRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      metadata: { title: 'Tree cover loss' },
    });
  });
});
