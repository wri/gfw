import { createThunkAction } from 'redux/actions';

import useRouter from 'utils/router';

export const setModalContactUsOpen = createThunkAction(
  'setModalContactUsOpen',
  (open) => () => {
    const { query, pathname, pushQuery } = useRouter();

    pushQuery({
      pathname,
      query: {
        ...query,
        contactUs: open || null,
      },
    });
  }
);
