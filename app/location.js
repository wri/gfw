import { CARTO_API } from 'utils/constants';
import { get } from 'axios';
import { getGeodescriber } from 'services/geostore';
import { getArea } from 'services/areas';
import lowerCase from 'lodash/lowerCase';
import startCase from 'lodash/startCase';

export const config = {
  country: {
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
  },
  geostore: {
    adm0: (params) =>
      getGeodescriber({ geostore: params.adm0 }).then((response) => {
        const { title, ...props } = response?.data?.data;

        return {
          locationName: title,
          ...props,
        };
      }),
  },
  aoi: {
    adm0: (params) =>
      getArea(params.adm0).then((area) => {
        const { name, ...props } = area;

        if (name) {
          return {
            locationName: name,
            ...props,
          };
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
  },
  wdpa: {
    adm0: (params) =>
      get(
        `${CARTO_API}/sql?q=SELECT name FROM wdpa_protected_areas WHERE wdpaid = '${params.adm0}'`
      ).then((response) => {
        const { name: locationName, ...props } = response?.data?.rows?.[0];

        return {
          locationName,
          title: `${locationName} | Protected Areas`,
          ...props,
        };
      }),
  },
  use: {
    adm1: (params) => ({
      locationName: `${params.adm1}, ${startCase(lowerCase(params.adm0))}`,
    }),
  },
};

export default async ({ params }) => {
  const location = {
    type: params.location[0],
    adm0: params.location[1],
    adm1: params.location[2],
    adm2: params.location[3],
  };

  let getLocationData = null;
  if (location.adm2) getLocationData = config[location.type].adm2;
  else if (location.adm1) getLocationData = config[location.type].adm1;
  else if (location.adm0) getLocationData = config[location.type].adm0;

  if (location.type === 'global') {
    return {
      props: {
        locationName: 'Global',
      },
    };
  }

  if ((!location.type && !location.adm0) || !getLocationData) {
    return {
      props: {
        locationName: `Location not found`,
      },
    };
  }

  try {
    const locationData = await getLocationData(location);

    return {
      props: {
        ...(locationData && {
          ...locationData,
          titleParams: locationData,
        }),
      },
    };
  } catch {
    return {
      props: {
        locationName: `Location not found`,
        titleParams: {
          locationName: `Location not found`,
        },
      },
    };
  }
};
