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

export const setContactUsOpen = () => {
  const { query, pathname, pushQuery } = useRouter();

  pushQuery({
    pathname,
    query: {
      ...query,
      gfwfires: null,
      contactUs: true,
    },
  });
};
