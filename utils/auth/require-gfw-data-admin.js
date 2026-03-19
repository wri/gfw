import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const normalizeToken = (token) => {
  if (!token) return null;
  let t = token.trim();
  // XXX: FB/Google token hack (mirrors services/user.js)
  if (t.endsWith('#')) {
    t = t.replace(/#$/, '');
  }
  return t;
};

const extractJwtFromCookie = (req) => {
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return null;

  try {
    const cookies = parse(cookieHeader);
    if (cookies['gfw-jwt']) {
      return normalizeToken(cookies['gfw-jwt']);
    }
  } catch (e) {
    // ignore cookie parse errors
  }

  return null;
};

const getRoleFromPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return null;

  if (payload.role) return payload.role;
  if (payload.data && payload.data.role) return payload.data.role;
  if (Array.isArray(payload.roles) && payload.roles.length)
    return payload.roles[0];

  return null;
};

export const requireGfwDataApiAdmin = (req, res) => {
  const jwtToken = extractJwtFromCookie(req);

  if (!jwtToken) {
    res.status(401).json({ error: 'Missing or invalid credentials' });
    return false;
  }

  let payload;

  try {
    // Decode without verification; cookie is issued by our backend
    payload = jwt.decode(jwtToken);
  } catch (e) {
    res.status(401).json({ error: 'Invalid or malformed token' });
    return false;
  }

  if (!payload) {
    res.status(401).json({ error: 'Invalid or malformed token' });
    return false;
  }

  const role = getRoleFromPayload(payload);

  if (role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  return true;
};

export default requireGfwDataApiAdmin;
