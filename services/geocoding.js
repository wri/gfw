import { mapboxRequest } from 'utils/request';

export const fetchGeocodeLocations = (
  searchQuery = '',
  lang = 'en',
  cancelToken
) =>
  mapboxRequest
    .get(
      `/geocoding/v5/mapbox.places/${searchQuery}.json?language=${lang}&access_token=${process.env.MapboxAccessToken}`,
      {
        cancelToken,
      }
    )
    .then((response) => response?.data?.features);
