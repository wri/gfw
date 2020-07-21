import useRouter from 'utils/router';

export const setModalFiresOpen = (open) => {
  const { query, pathname, pushQuery } = useRouter();

  pushQuery({
    pathname,
    query: {
      ...query,
      gfwfires: open || null,
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
