import request from 'utils/request';

const REQUEST_URL = `${process.env.CARTO_API}/sql?q=`;

const SQL_QUERIES = {
  aboutImpacts: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  allProjects:
    'SELECT a.*, b.latitude_average, b.longitude_average FROM gfw_use_cases_for_about_page a, country_list_iso_3166_codes_latitude_longitude b WHERE a.country_iso_code = b.alpha_3_code',
  sgfProjects: 'SELECT * FROM sgf_stories'
};

export const fetchAboutProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.aboutImpacts}`;
  return request.get(url);
};

export const fetchAllProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.allProjects}`;
  return request.get(url);
};

export const fetchSGFProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.sgfProjects}`;
  return request.get(url);
};
