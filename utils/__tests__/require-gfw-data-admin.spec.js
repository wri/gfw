import { requireGfwDataApiAdmin } from 'utils/auth/require-gfw-data-admin';

const buildReq = (overrides = {}) => ({
  headers: {},
  ...overrides,
});

const buildRes = () => {
  const res = {
    statusCode: null,
    body: null,
  };

  res.status = jest.fn((code) => {
    res.statusCode = code;
    return res;
  });

  res.json = jest.fn((payload) => {
    res.body = payload;
    return res;
  });

  res.end = jest.fn();

  return res;
};

describe('requireGfwDataApiAdmin', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('fails closed with 500 when admin JWT is not configured', async () => {
    process.env.GFW_DATA_API_ADMIN_JWT = '';

    // Re-require to pick latest env
    // eslint-disable-next-line global-require
    const {
      requireGfwDataApiAdmin: freshRequire,
    } = require('../auth/require-gfw-data-admin');

    const req = buildReq();
    const res = buildRes();

    const allowed = freshRequire(req, res);

    expect(allowed).toBe(false);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringContaining('GFW_DATA_API_ADMIN_JWT'),
      })
    );
  });

  it('returns 401 when no token is provided', () => {
    process.env.GFW_DATA_API_ADMIN_JWT = 'admin-token';

    const req = buildReq();
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 403 when token does not match admin token', () => {
    process.env.GFW_DATA_API_ADMIN_JWT = 'admin-token';

    const req = buildReq({
      headers: {
        authorization: 'Bearer other-token',
      },
    });
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(false);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('accepts when Authorization header token matches admin token', () => {
    process.env.GFW_DATA_API_ADMIN_JWT = 'admin-token';

    const req = buildReq({
      headers: {
        authorization: 'Bearer admin-token',
      },
    });
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('accepts when gfw-token cookie matches admin token, normalizing trailing #', () => {
    process.env.GFW_DATA_API_ADMIN_JWT = 'admin-token';

    const req = buildReq({
      headers: {
        cookie: 'gfw-token=admin-token#; other=foo',
      },
    });
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });
});
