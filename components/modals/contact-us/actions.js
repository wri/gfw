import useRouter from 'utils/router';

export const setModalContactUsOpen = (open) => {
  const { query, pathname, pushQuery } = useRouter();

  pushQuery({
    pathname,
    query: {
      ...query,
      contactUs: open || null,
    },
  });
};
