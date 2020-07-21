// breakpoints for grid
export const SCREEN_S = 320;
export const SCREEN_M = 768;
export const SCREEN_L = 1024;
export const SCREEN_XL = 1080;

// urls for links
export const WEB_URL =
  process.env.FEATURE_ENV === 'staging'
    ? 'https://staging.globalforestwatch.org'
    : 'https://www.globalforestwatch.org';
export const APP_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : WEB_URL;
export const GFW_API =
  process.env.FEATURE_ENV === 'staging'
    ? 'https://staging-api.globalforestwatch.org'
    : 'https://production-api.globalforestwatch.org';
export const CARTO_API = 'https://wri-01.carto.com/api/v2';
export const RESOURCE_WATCH_API = 'https://api.resourcewatch.org/v1';
export const CLIMATE_WATCH_API = 'https://www.climatewatchdata.org/api/v1';
export const TRASE_API = 'https://trase.earth/api/v3';
export const BITLY_API_URL = 'https://api-ssl.bitly.com/v3';
export const DEVELOPERS_URL = 'https://developers.globalforestwatch.org';
export const HOWTO_URL = 'https://www.globalforestwatch.org/howto';
export const DATA_PORTAL_URL = 'https://data.globalforestwatch.org';
export const BLOG_URL = 'https://blog.globalforestwatch.org';
