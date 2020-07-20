import useRouter from 'utils/router';

export const setAreaOfInterestModalOpen = (areaId) => {
  const { query, pathname, pushQuery } = useRouter();

  pushQuery({
    pathname,
    query: {
      ...query,
      areaId: areaId || null,
    },
  });
};
