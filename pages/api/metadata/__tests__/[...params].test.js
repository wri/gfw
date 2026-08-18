import { resolveMetadata } from 'utils/metadata/resolve';
import { MetadataNotFoundError } from 'utils/metadata/errors';
import handler from '../[...params]';

jest.mock('utils/metadata/resolve', () => ({
  resolveMetadata: jest.fn(),
}));

const buildReq = (params) => ({ query: { params } });

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('pages/api/metadata/[...params]', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with the resolved metadata for a valid, existing key', async () => {
    const body = { metadata: { title: 'Tree cover loss' } };
    resolveMetadata.mockResolvedValueOnce(body);

    const req = buildReq(['umd_tree_cover_loss']);
    const res = buildRes();

    await handler(req, res);

    expect(resolveMetadata).toHaveBeenCalledWith('umd_tree_cover_loss');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(body);
  });

  it('resolves a widget key identically to a dataset key, with no type declared', async () => {
    const body = { metadata: { title: 'Tree cover loss (widget)' } };
    resolveMetadata.mockResolvedValueOnce(body);

    const req = buildReq(['widget_tree_cover_loss']);
    const res = buildRes();

    await handler(req, res);

    expect(resolveMetadata).toHaveBeenCalledWith('widget_tree_cover_loss');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('supports multi-segment keys by joining all path params', async () => {
    resolveMetadata.mockResolvedValueOnce({ metadata: {} });

    const req = buildReq(['foo', 'bar']);
    const res = buildRes();

    await handler(req, res);

    expect(resolveMetadata).toHaveBeenCalledWith('foo/bar');
  });

  it('returns 400 for a syntactically unsafe path, without calling resolveMetadata', async () => {
    const req = buildReq(['../etc/passwd']);
    const res = buildRes();

    await handler(req, res);

    expect(resolveMetadata).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 404, not 400, when the key is valid but missing from both backends', async () => {
    resolveMetadata.mockRejectedValueOnce(
      new MetadataNotFoundError('No metadata found for "nonexistent_key"')
    );

    const req = buildReq(['nonexistent_key']);
    const res = buildRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 502, not 400, on a genuine upstream failure', async () => {
    resolveMetadata.mockRejectedValueOnce(new Error('Internal Server Error'));

    const req = buildReq(['some_key']);
    const res = buildRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
