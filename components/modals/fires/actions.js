import useRouter from 'utils/router';

export const setModalFiresOpen = (open) => {
  const { query, asPath, pushQuery } = useRouter();

  pushQuery({
    pathname: asPath?.split('?')?.[0],
    query: {
      ...query,
      gfwfires: open || null,
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
