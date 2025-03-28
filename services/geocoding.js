import { mapboxRequest } from 'utils/request';

export const fetchGeocodeLocations = (
  searchQuery = '',
  lang = 'en',
  cancelToken
) => {
  return mapboxRequest
    .get(
      `/geocoding/v5/mapbox.places/${searchQuery}.json?language=${lang}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=postcode,district,place,locality,neighborhood,address,poi`,
      {
        cancelToken,
      }
    )
    .then((mapboxResponse) => {
      return mapboxResponse?.data?.features;
    })
    .catch(() => {});
};
