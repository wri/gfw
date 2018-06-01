export const getAdminPath = ({ country, region, query, id }) =>
  `/dashboards/country/${country ? `${country}/` : ''}${
    region ? `${region}/` : ''
  }${id}${query && query.category ? `?category=${query.category}` : ''}`;
