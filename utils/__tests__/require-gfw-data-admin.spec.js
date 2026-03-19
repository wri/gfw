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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const makeJwt = (payloadObj) => {
    const headerObj = { alg: 'none', typ: 'JWT' };
    const headerB64 = Buffer.from(JSON.stringify(headerObj)).toString(
      'base64url'
    );
    const payloadB64 = Buffer.from(JSON.stringify(payloadObj)).toString(
      'base64url'
    );
    // Signature is not verified by jwt.decode, but keep it base64url-like
    const signatureB64 = Buffer.from('signature').toString('base64url');
    return `${headerB64}.${payloadB64}.${signatureB64}`;
  };

  it('returns 401 when no token is provided', async () => {
    const req = buildReq();
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(false);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 403 when user role is not ADMIN', async () => {
    const payload = {
      role: 'USER',
    };
    const token = makeJwt(payload);

    const req = buildReq({
      headers: {
        cookie: `gfw-jwt=${token}`,
      },
    });
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(false);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('accepts when JWT has ADMIN role and normalizes trailing #', async () => {
    const payload = {
      role: 'ADMIN',
    };
    const token = makeJwt(payload);

    const req = buildReq({
      headers: {
        cookie: `gfw-jwt=${token}#; other=foo`,
      },
    });
    const res = buildRes();

    const allowed = requireGfwDataApiAdmin(req, res);

    expect(allowed).toBe(true);
    expect(res.status).not.toHaveBeenCalled();
  });
});
