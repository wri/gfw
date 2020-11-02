export const getGadm36Id = (country, region, subRegion) =>
  `${country}${region ? `.${region}` : ''}${
    subRegion ? `.${subRegion}_1` : '_1'
  }`;

export const parseGadm36Id = (gid) => {
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

export const getGadmLocationByLevel = ({ level, ...location }) => ({
  type: 'country',
  ...(location?.gid_0 && {
    ...parseGadm36Id(location[`gid_${level || '0'}`]),
  }),
});
