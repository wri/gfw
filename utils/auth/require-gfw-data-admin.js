import { parse } from 'cookie';

const normalizeToken = (token) => {
  if (!token) return null;
  let t = token.trim();
  // XXX: FB/Google token hack (mirrors services/user.js)
  if (t.endsWith('#')) {
    t = t.replace(/#$/, '');
  }
  return t;
};

const extractTokenFromRequest = (req) => {
  const auth = req.headers?.authorization || req.headers?.Authorization;

  if (
    auth &&
    typeof auth === 'string' &&
    auth.toLowerCase().startsWith('bearer ')
  ) {
    return normalizeToken(auth.substring(7));
  }

  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    try {
      const cookies = parse(cookieHeader);
      if (cookies['gfw-token']) {
        return normalizeToken(cookies['gfw-token']);
      }
    } catch (e) {
      // ignore cookie parse errors
    }
  }

  return null;
};

export const requireGfwDataApiAdmin = (req, res) => {
  const adminJwtFromEnv = process.env.GFW_DATA_API_ADMIN_JWT;

  if (!adminJwtFromEnv) {
    res.status(500).json({ error: 'GFW_DATA_API_ADMIN_JWT is not configured' });
    return false;
  }

  const token = extractTokenFromRequest(req);

  if (!token) {
    res.status(401).json({ error: 'Missing or invalid credentials' });
    return false;
  }

  const normalizedAdminToken = normalizeToken(adminJwtFromEnv);

  if (token !== normalizedAdminToken) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  return true;
};

export default requireGfwDataApiAdmin;
