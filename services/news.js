import { apiRequest } from 'utils/request';

const QUERY = 'SELECT%20name,%20description,%20link%20FROM%20gfw_home_news';
const REQUEST_URL = `/query/916022a9-2802-4cc6-a0f2-a77f81dd0c09?sql=${QUERY}`;

export const getNewsArticles = async () => {
  try {
    const resp = await apiRequest.get(REQUEST_URL);
    return resp?.data?.data;
  } catch (_) {
    return null;
  }
};

export default {
  getNewsArticles,
};
