import useRouter from 'utils/router';

export const setModalClimateOpen = (open) => {
  const { query, asPath, pushQuery } = useRouter();

  pushQuery({
    pathname: asPath?.split('?')?.[0],
    query: {
      ...query,
      gfwclimate: open || null,
    },
  });
};

export const setContactUsOpen = () => {
  const { query, asPath, pushQuery } = useRouter();

  pushQuery({
    pathname: asPath?.split('?')?.[0],
    query: {
      ...query,
      gfwfires: null,
      contactUs: true,
    },
  });
};
