import lowerCase from 'lodash/lowerCase';
import startCase from 'lodash/startCase';

import { getGeodescriberByGeostore } from 'services/geodescriber';
import { getDatasetQuery } from 'services/datasets';
import { getArea } from 'services/areas';
import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider,
} from 'services/country';

const findByIso = (list, iso) => list?.find((item) => item?.iso === iso);
const findById = (list, idPrefix) =>
  list?.find((item) => item?.id.startsWith(idPrefix));

export const countryConfig = {
  adm0: async ({ adm0 }) => {
    const { data: countries } = await getCountriesProvider();
    const country = findByIso(countries, adm0);
    const { name, ...props } = country || {};

    return {
      locationName: name,
      ...props,
    };
  },
  adm1: async ({ adm0, adm1 }) => {
    const [countriesData, regionsData] = await Promise.all([
      getCountriesProvider(),
      getRegionsProvider({ adm0 }),
    ]);

    const { data: countries } = countriesData || {};
    const { data: regions } = regionsData || {};

    const country = findByIso(countries, adm0);
    const region = findById(regions, `${adm0}.${adm1}_`);

    const { name, ...props } = region;

    return {
      locationName: `${name}, ${country?.name}`,
      ...props,
    };
  },
  adm2: async ({ adm0, adm1, adm2 }) => {
    const [countriesData, regionsData, subRegionsData] = await Promise.all([
      getCountriesProvider(),
      getRegionsProvider({ adm0 }),
      getSubRegionsProvider({ adm0, adm1 }),
    ]);

    const { data: countries } = countriesData || {};
    const { data: regions } = regionsData || {};
    const { data: subRegions } = subRegionsData || {};

    const country = findByIso(countries, adm0);
    const region = findById(regions, `${adm0}.${adm1}_`);
    const subRegion = findById(subRegions, `${adm0}.${adm1}.${adm2}_`);

    const { name, ...props } = subRegion;

    return {
      locationName: `${name}, ${country?.name}, ${region?.name}`,
      ...props,
    };
  },
};

export const geostoreConfig = {
  adm0: (params) =>
    getGeodescriberByGeostore({ geostore: params.adm0 }).then((response) => {
      const { title, ...props } = response?.data?.data;

      return {
        locationName: title || 'Area',
        ...props,
      };
    }),
};

export const wdpaConfig = {
  adm0: (params) =>
    getDatasetQuery({
      dataset: 'wdpa_protected_areas',
      sql: `SELECT name FROM data WHERE wdpaid = '${params.adm0}'`,
    }).then((data) => {
      const { name: locationName, ...props } = data?.[0];

      return {
        locationName,
        ...props,
      };
    }),
};

export const useConfig = {
  adm1: (params) => ({
    locationName: `${params.adm1}, ${startCase(lowerCase(params.adm0))}`,
  }),
};

export const aoiConfig = {
  adm0: (params, userToken = null) =>
    getArea(params.adm0, userToken).then((area) => {
      const { name, ...props } = area;

      if (name) {
        return {
          locationName: name,
          ...props,
        };
      }
      const { admin, iso, use, wdpaid } = props || {};

      if ((admin && admin.adm0) || (iso && iso.country)) {
        const locationParams = {
          adm0: iso.country || admin.adm0,
          adm1: iso.region || admin.adm1,
          adm2: iso.subRegion || admin.adm2,
        };
        if (locationParams.adm2) return countryConfig.adm2(locationParams);
        if (locationParams.adm1) return countryConfig.adm1(locationParams);
        if (locationParams.adm0) return countryConfig.adm0(locationParams);
      } else if (use && use.id) {
        return useConfig.adm1({ adm0: use.name, adm1: use.id });
      } else if (wdpaid) {
        return wdpaConfig.adm0({ adm0: wdpaid });
      }

      return getGeodescriberByGeostore(area).then((response) => {
        const geodescriber = response?.data?.data;

        return {
          locationName: geodescriber?.title || 'Area of Interest',
          geodescriber,
          ...props,
        };
      });
    }),
};

export const config = {
  country: countryConfig,
  geostore: geostoreConfig,
  aoi: aoiConfig,
  wdpa: wdpaConfig,
  use: useConfig,
};

export const getLocationData = async (params, userToken = null) => {
  const location = {
    type: params?.[0],
    adm0: params?.[1],
    adm1: params?.[2],
    adm2: params?.[3],
  };

  let getLocationDataFunc = () => {};
  if (location.adm2) getLocationDataFunc = config[location.type].adm2;
  else if (location.adm1) getLocationDataFunc = config[location.type].adm1;
  else if (location.adm0) getLocationDataFunc = config[location.type].adm0;

  const locationData = await getLocationDataFunc(location, userToken);

  return locationData;
};
