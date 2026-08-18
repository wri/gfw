import { jest } from '@jest/globals';
import handler from '../[...params]';

const buildReq = (params) => ({ query: { params } });

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe('pages/api/widget-metadata/[...params]', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('wraps the Resource Watch payload in the shared { metadata } contract', async () => {
    const rwPayload = { title: 'Tree cover loss', overview: 'Some overview' };
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => rwPayload,
    });

    const req = buildReq(['widget_tree_cover_loss']);
    const res = buildRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ metadata: rwPayload });
  });

  it('rejects unsafe paths without calling Resource Watch', async () => {
    global.fetch = jest.fn();

    const req = buildReq(['../etc/passwd']);
    const res = buildRes();

    await handler(req, res);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
