export const buildGadm36Id = (country, region, subRegion) =>
  `${country}${region ? `.${region}` : ''}${
    subRegion ? `.${subRegion}_1` : '_1'
  }`;

export const parseGadm36Id = (gid) => {
  if (!gid) return null;
  const ids = gid.split('.');
  const adm0 = (ids && ids[0]) || null;
  const adm1 = ids && ids[1] && ids[1].split('_')[0];
  const adm2 = ids && ids[2] && ids[2].split('_')[0];
  return {
    adm0,
    adm1: adm1 ? parseInt(adm1, 10) : undefined,
    adm2: adm2 ? parseInt(adm2, 10) : undefined,
  };
};

export const getLocationFromData = (data) => {
  let newLocation = {};
  if (data && data.gid_0) {
    newLocation = parseGadm36Id(data[`gid_${data.level || '0'}`]);
  }
  return {
    type: 'country',
    ...newLocation,
  };
};
