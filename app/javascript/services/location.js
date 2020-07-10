/* eslint-disable no-else-return */
import { CARTO_API } from 'utils/constants';
import { get } from 'axios';
import { getGeodescriber } from 'services/geostore';
import { getArea } from 'services/areas';
import lowerCase from 'lodash/lowerCase';
import startCase from 'lodash/startCase';

export const countryConfig = {
  adm0: (params) =>
    get(
      `${CARTO_API}/sql?q=SELECT iso, name_engli as name FROM gadm36_countries WHERE iso = '${params.adm0}' AND iso != 'XCA' AND iso != 'TWN'`
    ).then((response) => {
      const { name, ...props } = response?.data?.rows?.[0];

      return {
        locationName: name,
        ...props,
      };
    }),
  adm1: (params) =>
    get(
      `${CARTO_API}/sql?q=SELECT iso, gid_1 as id, name_0 as adm0, name_1 as adm1 FROM gadm36_adm1 WHERE gid_1 = '${params.adm0}.${params.adm1}_1' AND iso != 'XCA' AND iso != 'TWN'`
    ).then((response) => {
      const { adm1, adm0, ...props } = response?.data?.rows?.[0];

      return {
        locationName: `${adm1}, ${adm0}`,
        ...props,
      };
    }),
  adm2: (params) =>
    get(
      `${CARTO_API}/sql?q=SELECT gid_2, name_0 as adm0, name_1 as adm1, name_2 as adm2 FROM gadm36_adm2 WHERE gid_2 = '${params.adm0}.${params.adm1}.${params.adm2}_1' AND iso != 'XCA' AND iso != 'TWN'`
    ).then((response) => {
      const { adm2, adm1, adm0, ...props } = response?.data?.rows?.[0];

      return {
        locationName: `${adm2}, ${adm1}, ${adm0}`,
        ...props,
      };
    }),
};

export const geostoreConfig = {
  adm0: (params) =>
    getGeodescriber({ geostore: params.adm0 }).then((response) => {
      const { title, ...props } = response?.data?.data;

      return {
        locationName: title,
        ...props,
      };
    }),
};

export const wdpaConfig = {
  adm0: (params) =>
    get(
      `${CARTO_API}/sql?q=SELECT name FROM wdpa_protected_areas WHERE wdpaid = '${params.adm0}'`
    ).then((response) => {
      const { name: locationName, ...props } = response?.data?.rows?.[0];

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
  adm0: (params) =>
    getArea(params.adm0).then((area) => {
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
        else if (locationParams.adm1) return countryConfig.adm1(locationParams);
        else if (locationParams.adm0) return countryConfig.adm0(locationParams);
      } else if (use && use.id) {
        return useConfig.adm1({ adm0: use.name, adm1: use.id });
      } else if (wdpaid) {
        return wdpaConfig.adm0({ adm0: wdpaid });
      }

      return getGeodescriber(area).then((response) => {
        const geodescriber = response?.data?.data;

        return {
          locationName: geodescriber.title || 'Area of Interest',
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

export const getLocationData = async (params) => {
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

  const locationData = await getLocationDataFunc(location);

  return locationData;
};
