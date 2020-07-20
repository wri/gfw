import useRouter from 'utils/router';

export const setModalClimateOpen = (open) => {
  const { query, pathname, pushQuery } = useRouter();

  pushQuery({
    pathname,
    query: {
      ...query,
      gfwclimate: open || null,
    },
  });
};
