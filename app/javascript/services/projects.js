import axios from 'axios';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  aboutImpacts: 'SELECT * FROM gfw_outcomes_for_about_page_images',
  allProjects:
    'SELECT a.*, b.latitude_average, b.longitude_average FROM gfw_use_cases_for_about_page a, country_list_iso_3166_codes_latitude_longitude b WHERE a.country_iso_code = b.alpha_3_code'
};

export const fetchAboutProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.aboutImpacts}`;
  return axios.get(url);
};

export const fetchAllProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.allProjects}`;
  return axios.get(url);
};
