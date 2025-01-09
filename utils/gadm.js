export const getGadm36Id = (country, region, subRegion) =>
  `${country}${region ? `.${region}` : ''}${
    subRegion ? `.${subRegion}_1` : '_1'
  }`;

export const parseGadmId = (gid) => {
  if (!gid) return null;

  const ids = gid.split('.');
  const adm0 = ids?.[0] || null;
  const adm1 = ids[1]?.split('_')?.[0];
  const adm2 = ids[2]?.split('_')?.[0];

  return {
    adm0,
    adm1: adm1 ? parseInt(adm1, 10) : undefined,
    adm2: adm2 ? parseInt(adm2, 10) : undefined,
  };
};

/**
 * @param {string} adm_level - The administrative level
 * @param {object} location - Location object from user's clicked area
 * @return {object} - Object with area type, location and gadm properties
 */
export const getGadmLocationByLevel = ({ adm_level, ...location }) => ({
  type: 'country',
  ...(location?.gid_0 && {
    ...parseGadmId(location[`gid_${adm_level || '0'}`]),
  }),
});
