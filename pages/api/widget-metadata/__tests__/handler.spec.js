import handler from '../[...params]';

const createResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('widget metadata API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns normalized widget metadata', async () => {
    const metadata = { title: 'Tree cover loss' };
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(metadata),
    });
    const res = createResponse();

    await handler({ query: { params: ['widget_tree_cover_loss'] } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ metadata });
  });

  it('converts Resource Watch semantic errors to 404', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ error: 'Metadata not found' }),
    });
    const res = createResponse();

    await handler({ query: { params: ['missing_widget'] } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Metadata not found' });
  });

  it('returns 502 for an upstream server failure', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    const res = createResponse();

    await handler({ query: { params: ['widget_tree_cover_loss'] } }, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Metadata request failed with status 500',
    });
  });

  it('rejects invalid paths before contacting Resource Watch', async () => {
    const res = createResponse();

    await handler({ query: { params: ['..', 'metadata'] } }, res);

    expect(fetch).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
