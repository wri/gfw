import { GFW_DOMAIN } from './domain';

// Blog content still lives on the legacy globalforestwatch.org domain — the
// globalnaturewatch.org equivalents 404 today (blocked on PZB-1140). Once that
// domain is serving the app, GFW_DOMAIN in utils/domain.js is the only line
// that needs to change.
export { GFW_DOMAIN };

export const BLOG_URL = `${GFW_DOMAIN}/blog`;

// Note: `gnwannoucement` is misspelled upstream in the campaign that analytics
// already tracks, so it must stay as-is.
export const GNW_ANNOUNCEMENT_URL = `${BLOG_URL}/data-and-tools/gfw-now-global-nature-watch/?utm_medium=notification&utm_source=homepage&utm_campaign=gnwannoucement`;
