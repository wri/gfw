export const subToArea = ({
  id,
  datasets,
  resource,
  params,
  application,
  ...rest
} = {}) => {
  const deforestationAlerts = datasets.includes('umd-loss-gain') || datasets.includes('glad-alerts');
  const fireAlerts = datasets.includes('viirs-active-fires');
  const monthlySummary = false;
  const { geostore, iso, use, useid, wdpaid } = params || {};

  return {
    ...rest,
    id,
    email: resource && resource.content,
    subscriptionId: id,
    application: application || 'gfw',
    status: 'pending',
    public: true,
    deforestationAlerts,
    fireAlerts,
    monthlySummary,
    geostore,
    ...(iso &&
    iso.country && {
      admin: {
        adm0: iso && iso.country,
        adm1: iso && iso.region,
        adm2: iso && iso.subRegion
      }
    }),
    ...(use &&
    useid && {
      use: {
        id: useid,
        name: use
      }
    }),
    ...(wdpaid && {
      wdpaid
    }),
    userArea: true
  };
};

export const areaToSub = () => {

};

export const mergeAreasWithSubs = (areas, subs) => {
  const areasWithSubs = areas.map(area => {
    const sub = subs.find(
      s => s.id === area.subscriptionId
    );

    return {
      ...sub,
      ...area,
      areaWithSubscription: true,
      userArea: true
    };
  });

  const areaSubIds = areasWithSubs.map(a => a.subscriptionId);
  const subsWithoutAreas = subs.filter(s => !areaSubIds.includes(s.id)).map(s => ({ ...s, subWithoutArea: true }));

  return [...areasWithSubs, ...subsWithoutAreas];
};
