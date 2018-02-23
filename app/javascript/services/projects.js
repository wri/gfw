import axios from 'axios';

const REQUEST_URL = `${process.env.CARTO_API_URL}/sql?q=`;

const SQL_QUERIES = {
  aboutImpacts: 'SELECT * FROM gfw_outcomes_for_about_page_images'
};

export const fetchAboutProjects = () => {
  const url = `${REQUEST_URL}${SQL_QUERIES.aboutImpacts}`;
  return axios.get(url);
};
